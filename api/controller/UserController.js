const users = require("../models/Users");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const service = require("../service/emailService");
require("dotenv").config();

exports.home = async (req, res) => {
  res.status(200).json({
    message: "selamat datang di serverku",
  });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await users.Login(username, password);
    if (user.is_verified == false) {
      return res.status(403).json({
        status: "failed",
        message: "User belum diverifikasi",
      });
    }
    const token = jwt.sign({ uuid: user.uuid, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // 'lax' biasanya lebih bersahabat untuk redirect OAuth
      maxAge: 24 * 60 * 60 * 1000,
    });
    delete user.password;
    res.status(200).json({
      status: "success",
      message: "Berhasil login",
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
};
exports.register = async (req, res) => {
  try {
    const data = req.body;
    const user = await users.register(data);
    const getuuid = await users.getUUID();
    const get = await users.getUserData(getuuid[getuuid.length - 1].uuid);
    delete user.password;

    const token = await users.generateAuthCode(getuuid[getuuid.length - 1].uuid);
    const isSent = await service.sendOTPEmail(user.email, token);
    res.status(201).json({
      status: "success",
      message: isSent ? "OTP dikirim ke email" : "Gagal kirim email, tapi registrasi sukses",
      data: { userId: get.uuid },
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
};
exports.googleCallback = async (req, res) => {
  try {
    let user = req.user;
    user = await users.patchIsVerified(user.uuid);
    const token = jwt.sign({ id: user.uuid, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // 'lax' biasanya lebih bersahabat untuk redirect OAuth
      maxAge: 24 * 60 * 60 * 1000,
    });
    const userData = { ...user };
    delete userData.password;
    delete userData.otp_code;
    res.status(200).json({
      status: "success",
      message: "Berhasil login dengan Google",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
exports.getUserData = async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const user = await users.getUserData(uuid);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message,
    });
  }
};
exports.resendCode = async (req, res) => {
  try {
    const { uuid } = req.params;
    await users.resendCode(uuid);
    res.status(200).json({
      status: "success",
      message: "Kode baru telah dikirim ke email Anda!",
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
};
exports.verify = async (req, res) => {
  try {
    const { otp_code } = req.body;
    const { uuid } = req.params;

    await users.verifyAuthCode(uuid, otp_code);
    const user = await users.getUserData(uuid);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User tidak ditemukan",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Akun Anda berhasil diverifikasi. Selamat datang di PlayHub Station!",
      data: {
        id: uuid,
        email: user.email,
        is_verified: user.is_verified,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e.message,
    });
  }
};
exports.logout = async (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({
    status: "success",
    message: "Berhasil logout",
  });
};
exports.getAllUsers = async (req, res) => {
  try {
    const usersData = await users.getAllUsers();
    res.status(200).json({
      status: "success",
      data: usersData,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message,
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    await users.deleteUser(uuid);
    res.status(200).json({
      status: "success",
      message: "User berhasil dihapus",
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const updateData = req.body;
    const updatedUser = await users.updatedUserByuuid(uuid, updateData);
    let targetHapus = ["password", "otp_code", "otp_expires_at", "otp_attempts", "last_otp_sent_at"];
    targetHapus.forEach((key) => {
      delete updatedUser[key];
    });
    res.status(200).json({
      status: "success",
      message: "User berhasil diperbarui",
      data: updatedUser,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message,
    });
  }
};
exports.getUserByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await users.getUserData(uuid);
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User tidak ditemukan",
      });
    }
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (e) {
    res.status(500).json({
      status: "failed",
      message: e.message,
    });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const { uuid } = req.params;
    if (!req.file) {
      return res.status(400).json({
        status: "failed",
        message: "File avatar tidak ditemukan",
      });
    }

    const avatarPath = req.file.path;
    const fileBuffer = fs.readFileSync(avatarPath);

    const optimizedAvatarBuffer = await users.optimizeImage(fileBuffer);

    fs.writeFileSync(avatarPath, optimizedAvatarBuffer);

    const updatedUser = await users.updatedUserByuuid(uuid, { avatar: avatarPath });
    const userData = updatedUser.toJSON();
    const targetHapus = ["password", "otp_attempts", "otp_expires_at", "otp_code", "last_otp_sent_at"];

    targetHapus.forEach((key) => {
      delete userData[key];
    });

    res.status(200).json({
      status: "success",
      message: "Avatar berhasil diunggah dan diperkecil ukurannya",
      data: userData,
    });
  } catch (e) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      status: "failed",
      message: e.message,
    });
  }
};
