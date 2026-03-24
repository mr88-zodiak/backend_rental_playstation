const users = require("../models/Users");
const jwt = require("jsonwebtoken");
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
    delete user.password;
    res.status(200).json({
      status: "success",
      data: user,
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
    delete user.password;
    res.status(200).json({
      status: "success",
      data: user,
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
    const user = req.user;
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Hanya lewat HTTPS di production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    if (user.password) delete user.password;

    res.status(200).json({
      status: "success",
      message: "Berhasil login dengan Google",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
exports.getUserData = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await users.getUserData(id);
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
