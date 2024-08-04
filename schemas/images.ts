import mongoose from "mongoose";

const imagesSchema = new mongoose.Schema({
  email: { type: String, required: true },
  url: { type: String, required: true },
  tag: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.images ||
  mongoose.model("images", imagesSchema, "images");
