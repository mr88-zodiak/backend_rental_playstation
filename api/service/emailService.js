const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bimasopan14@gmail.com",
    pass: process.env.EMAIL_SERVICE,
  },
});

const sendOTPEmail = async (targetEmail, otpCode) => {
  const mailOptions = {
    from: '"PlayHub Station" <bimasopan14@gmail.com>',
    to: targetEmail,
    subject: "Kode Verifikasi Akun",
    html: `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
        <h2>Verifikasi Akun Anda</h2>
        <p>Terima kasih telah mendaftar. Gunakan kode OTP di bawah ini untuk memverifikasi akun Anda:</p>
        <h1 style="color: #4A90E2; letter-spacing: 5px;">${otpCode}</h1>
        <p>Kode ini berlaku selama <b>5 menit</b>. Jangan bagikan kode ini kepada siapapun.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Gagal kirim email:", error);
    return false;
  }
};

module.exports = { sendOTPEmail };
