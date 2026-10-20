const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Project = require("../models/Project");

dotenv.config();

const sampleProjects = [
  {
  title: "CampusConnect",
  description: "A platform connecting students and campus resources — built and deployed on Vercel.",
  icon: "fas fa-graduation-cap",
  tags: ["Web", "Vercel", "JavaScript"],  // ← update with your real stack
  liveUrl: "https://campusconnect-akshay.vercel.app",
  codeUrl: "",                             // put GitHub URL here if public, else leave ""
  order: 1,
},
  {
    title: "Real-Time Chat App",
    description: "A full-stack MERN real-time chat application with instant messaging, user authentication, and online status.",
    icon: "fas fa-comments",
    tags: ["React", "Node.js", "Socket.io", "MongoDB"],
    liveUrl: "https://chat-appak.vercel.app",
    codeUrl: "https://github.com/akshaykashyap", // Replace with actual repo link
    featured: true,
    order: 1,
  },

];

const seedDB = async () => {
  try {
    await connectDB();
    await Project.deleteMany();
    console.log("🗑️  Cleared existing projects");

    const inserted = await Project.insertMany(sampleProjects);
    console.log(`✅ Inserted ${inserted.length} projects`);

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedDB();