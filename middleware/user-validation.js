const { body } = require("express-validator");

exports.login = [body("username").trim().notEmpty().withMessage("Username atau email tidak boleh kosong").escape(), body("password").notEmpty().withMessage("Password tidak boleh kosong")];
exports.register = [
  body("name").trim().notEmpty().withMessage("Nama tidak boleh kosong").isLength({ min: 3 }).withMessage("Nama minimal 3 karakter").escape(),

  body("username").trim().notEmpty().withMessage("Username tidak boleh kosong").isAlphanumeric().withMessage("Username hanya boleh huruf dan angka").isLength({ min: 5 }).withMessage("Username minimal 5 karakter"),

  body("email").trim().notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid").normalizeEmail(),
  body("phone").trim().notEmpty().withMessage("Nomor telepon tidak boleh kosong").isMobilePhone("id-ID").withMessage("Nomor telepon Indonesia tidak valid"),
  body("alamat").trim().notEmpty().withMessage("Alamat tidak boleh kosong").escape(),
  body("password").notEmpty().withMessage("Password tidak boleh kosong").isLength({ min: 8 }).withMessage("Password minimal 8 karakter"),
];
