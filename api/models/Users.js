const { Model } = require("objection");
const { compare, hash } = require("bcrypt");
const crypto = require("crypto");
const service = require("../service/emailService");

class users extends Model {
  static get tableName() {
    return "users";
  }
  static get idColumn() {
    return "id";
  }
  static async getUserData(uuid) {
    // return await this.query().findById(id).select("id", "uuid", "name", "email", "role", "avatar", "is_verified");
    return await this.query().where("uuid", uuid).first().select("id", "uuid", "name", "email", "role", "avatar", "is_verified");
  }
  static async getUUID() {
    return await this.query().select("uuid");
  }

  static async Login(username, password) {
    if (!username) throw new Error("Username atau email tidak boleh kosong");
    if (!password) throw new Error("Password tidak boleh kosong");
    // if (password.length < 8) throw new Error("Password minimal 8 karakter");

    const user = await this.query().where("username", username).orWhere("email", username).orWhere("phone", username).first();

    if (!user) {
      throw new Error("akun belum terdaftar");
    }
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new Error("Username atau Password salah");
    }
    delete user.password;
    return user;
  }
  static async register(data) {
    const existingUser = await this.query().where("email", data.email).orWhere("username", data.username).orWhere("phone", data.phone).first();

    if (existingUser) {
      if (existingUser.email === data.email) throw new Error("Email sudah terdaftar");
      if (existingUser.username === data.username) throw new Error("Username sudah terdaftar");
      if (existingUser.phone === data.phone) throw new Error("Nomor telepon sudah terdaftar");
    }

    if (!data.password || data.password.length < 8) {
      throw new Error("Password minimal 8 karakter");
    }

    const hashedPassword = await hash(data.password, 10);
    return await this.query().insert({
      ...data,
      password: hashedPassword,
      is_verified: false,
    });
  }

  static async generateAuthCode(userUuid) {
    if (!userUuid) throw new Error("UUID user diperlukan untuk generate OTP");

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.query().where("uuid", userUuid).patch({
      otp_code: code,
      otp_expires_at: expiresAt,
      // otp_attempts: 0,
      last_otp_sent_at: new Date(),
    });

    return code;
  }
  static async verifyAuthCode(userUuid, code) {
    const user = await this.query().findOne({ uuid: userUuid }).throwIfNotFound({ message: "User tidak ditemukan!" });
    if (new Date() > new Date(user.otp_code_expires_at)) {
      throw new Error("Kode OTP sudah kadaluarsa");
    }
    if (String(user.otp_code) !== String(code)) {
      console.log("Kode OTP yang dimasukkan:", code);
      console.log("Kode OTP yang tersimpan di database:", user.otp_code);
      throw new Error("Kode OTP tidak valid");
    }
    const updatedUser = await this.query()
      .patch({
        is_verified: true,
        otp_attempts: 0,
        otp_code: null,
      })
      .where("uuid", userUuid);

    return updatedUser;
  }
  static async resendCode(userUuid) {
    const user = await this.query().findOne({ uuid: userUuid }).select("email", "otp_attempts").throwIfNotFound({ message: "User tidak ditemukan!" });

    if (user.otp_attempts >= 3) {
      throw new Error("Tunggu 5 menit, permintaan OTP mencapai batas");
    }

    const newCode = await this.generateAuthCode(userUuid);
    const expiresAt = new Date(Date.now() + 5 * 60000);
    if (new Date() > expiresAt) {
      throw new Error("Kode OTP sudah kadaluarsa, silakan minta kode baru");
    }

    const updatedUser = await this.query()
      .patch({
        otp_attempts: user.otp_attempts + 1,
      })
      .where("uuid", userUuid)
      .returning("*")
      .first();
    await service.sendOTPEmail(user.email, newCode);

    return updatedUser;
  }
  static async patchIsVerified(userUuid) {
    return await this.query().patchAndFetchById(userUuid, { is_verified: true });
  }
}

module.exports = users;
