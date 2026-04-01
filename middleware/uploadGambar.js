const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // const ext = file.mimetype.split("/")[1];
    cb(null, `avatar-${uniqueSuffix}.webp`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedExt = /jpeg|jpg|png|webp/;
    const isExtValid = allowedExt.test(path.extname(file.originalname).toLowerCase());

    // 2. Cek MIME Type (Sangat Penting!)
    const allowedMime = /image\/jpeg|image\/jpg|image\/png|image\/webp/;
    const isMimeValid = allowedMime.test(file.mimetype);

    if (isExtValid && isMimeValid) {
      return cb(null, true);
    }

    cb(new Error("Format file tidak didukung! Gunakan JPG, PNG, atau WebP."));
  },
});

module.exports = upload;
