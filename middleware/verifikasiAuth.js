const isVerified = (req, res, next) => {
  if (!req.user.is_verified) {
    return res.status(403).json({
      status: "failed",
      message: "Akses ditolak. Silakan verifikasi akun Anda terlebih dahulu.",
    });
  }
  next();
};

module.exports = isVerified;
