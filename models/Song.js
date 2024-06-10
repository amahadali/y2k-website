// models/Song.js
import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artistName: { type: String, required: true },
  mp3Url: { type: String, required: true },
  imageUrl: { type: String, required: true },
  dateUploaded: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Song || mongoose.model("Song", songSchema);
