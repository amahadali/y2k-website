// models/Wallpaper.js
import mongoose from "mongoose";

const wallpaperSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  dateUploaded: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Wallpaper ||
  mongoose.model("Wallpaper", wallpaperSchema);
