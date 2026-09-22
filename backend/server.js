// ---------- Load env FIRST (before anything that reads process.env) ----------
const dotenv = require("dotenv");
dotenv.config();

// ---------- Core packages ----------
const express = require("express");
const cors = require("cors");

// ---------- Local modules (these read process.env, so must load AFTER dotenv.config) ----------
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projects");
const contactRoutes = require("./routes/contact");
const errorHandler = require("./middleware/errorHandler");

// ---------- Connect to MongoDB ----------
connectDB();

// ---------- Init Express ----------
const app = express();

// ---------- Middleware ----------
app.use(
  cors({
    origin: "*", // in production, replace with your frontend URL
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));

// ---------- Health check ----------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Portfolio API is running 🚀",
    endpoints: {
      projects: "/api/projects",
      contact: "/api/contact",
    },
  });
});

// ---------- Routes ----------
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);

// ---------- 404 handler ----------
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ---------- Global error handler (must be last) ----------
app.use(errorHandler);

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});