const { Model } = require("objection");
const { compare, hash } = require("bcrypt");

class users extends Model {
  static get tableName() {
    return "users";
  }
  static async getUserData(id) {
    return await this.query()
      .findById(id)
      .throwIfNotFound({ message: "User tidak ditemukan!" })
      .select("id", "name", "email", "role", "image", "alamat", "phone")
      .withGraphFetched("sewa(orderByDate)")
      .modifiers({
        orderByDate(builder) {
          builder.select("id", "order_id", "status", "total", "created_at").orderBy("created_at", "desc");
        },
      });
  }

  static async Login(username, password) {
    if (!username) throw new Error("Username atau email tidak boleh kosong");
    if (!password) throw new Error("Password tidak boleh kosong");
    // if (password.length < 8) throw new Error("Password minimal 8 karakter");

    const user = await this.query().where("username", username).orWhere("email", username).orWhere("phone", username).first();

    if (!user) {
      throw new Error("Username atau Password salah");
    }
    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new Error("Username atau Password salah");
    }
    delete user.password;
    return user;
  }
  static async register(data) {
    const existingUser = await this.query().where("email", data.email).orWhere("username", data.username).orWhere("phone", data.phone).orWhere("name", data.name).orWhere("alamat", data.alamat).first();

    if (existingUser) {
      if (existingUser.email === data.email) throw new Error("Email sudah terdaftar");
      if (existingUser.username === data.username) throw new Error("Username sudah terdaftar");
      if (existingUser.phone === data.phone) throw new Error("Nomor telepon sudah terdaftar");
      if (existingUser.nama === data.name) throw new Error("Nama sudah terdaftar");
      if (existingUser.alamat === data.alamat) throw new Error("Alamat sudah terdaftar");
    }
    if (!data.password || data.password.length < 8) {
      throw new Error("Password minimal 8 karakter");
    }
    const hashedPassword = await hash(data.password, 10);

    return await this.query().insert({
      ...data,
      password: hashedPassword,
    });
  }
}

module.exports = users;
