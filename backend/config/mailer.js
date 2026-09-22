const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = {
  async sendMail({ from, to, replyTo, subject, html }) {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      replyTo,
      subject,
      html,
    });

    if (error) {
      throw new Error(error.message || "Resend email failed");
    }

    return data;
  },

  async verify() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    return true;
  },
};

transporter
  .verify()
  .then(() => {
    console.log("📧 Resend email client ready");
  })
  .catch((err) => {
    console.error("❌ Resend configuration error:", err.message);
  });

module.exports = transporter;