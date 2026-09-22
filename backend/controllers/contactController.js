const Message = require("../models/Message");
const transporter = require("../config/mailer");

/**
 * @desc    Submit a contact message
 * @route   POST /api/contact
 * @access  Public
 */
const createMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    // ---------- 1. Validate ----------
    if (!name || !email || !message) {
      res.status(400);
      throw new Error("Please provide name, email, and message");
    }

    // ---------- 2. Save to MongoDB ----------
    const newMessage = await Message.create({ name, email, message });
    console.log(`💾 Message saved from ${email}`);

    // ---------- 3. Send email notification ----------
    // Wrapped in its own try/catch so email failure does NOT break the request.
    try {
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, // sends to yourself
        replyTo: email,             // hitting Reply → replies to the visitor
        subject: `📬 New message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;
                      padding: 24px; background: #0f0f24; color: #f8fafc;
                      border-radius: 12px;">
            <h2 style="color: #a855f7; margin: 0 0 16px;">New Portfolio Message</h2>

            <p style="margin: 8px 0;">
              <strong>Name:</strong> ${name}
            </p>

            <p style="margin: 8px 0;">
              <strong>Email:</strong>
              <a href="mailto:${email}" style="color: #ec4899;">${email}</a>
            </p>

            <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>

            <blockquote style="border-left: 3px solid #7c3aed; margin: 8px 0;
                                padding: 8px 16px; background: #1a1a3a;
                                border-radius: 6px;">
              ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>")}
            </blockquote>

            <p style="font-size: 12px; color: #a5a5c4; margin-top: 24px;">
              Received on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
            </p>
          </div>
        `,
      });

      console.log(`📧 Email sent for message from ${email}`);
    } catch (mailErr) {
      console.error("⚠️  Email failed (message still saved):", mailErr.message);
    }

    // ---------- 4. Respond to the client ----------
    res.status(201).json({
      success: true,
      message: "Message received. Thanks for reaching out!",
      data: {
        id: newMessage._id,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all messages (admin use)
 * @route   GET /api/contact
 * @access  Public (secure later)
 */
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = { createMessage, getMessages };