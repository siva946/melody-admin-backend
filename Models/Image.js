import mongoose from "mongoose";
const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: String,
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Image", imageSchema);
