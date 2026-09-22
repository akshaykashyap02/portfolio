const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    icon: {
      type: String,
      default: "fas fa-code", // Font Awesome class
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: "",
      trim: true,
    },
    codeUrl: {
      type: String,
      default: "",
      trim: true,
    },
    order: {
      type: Number,
      default: 0, // optional: lets you control display order
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);