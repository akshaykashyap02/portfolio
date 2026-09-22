// ---------- Load env FIRST ----------
const dotenv = require("dotenv");
dotenv.config();

// ---------- Core packages ----------
const express = require("express");
const cors = require("cors");

// ---------- Local modules ----------
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
    origin: "*",
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
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ---------- Global error handler ----------
app.use(errorHandler);

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});