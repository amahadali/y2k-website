// models/Game.js
import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  developerName: { type: String, required: true },
  url: { type: String },
  imageUrl: { type: String, required: true },
  dateUploaded: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Game || mongoose.model("Game", gameSchema);
