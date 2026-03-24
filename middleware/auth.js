exports.checkAuth = (req, res, next) => {
  const token = req.cookies.auth_token; // Ambil dari cookie

  if (!token) {
    return res.status(401).json({ message: "Sesi habis, silakan login kembali" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
};
