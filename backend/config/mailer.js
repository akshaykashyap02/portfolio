const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection when server starts
transporter.verify((err) => {
  if (err) {
    console.error("❌ Email transporter error:", err.message);
  } else {
    console.log("📧 Email transporter ready");
  }
});

module.exports = transporter;