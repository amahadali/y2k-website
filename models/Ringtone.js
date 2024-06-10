// models/Ringtone.js
import mongoose from "mongoose";

const ringtoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  mp3Url: { type: String, required: true },
  imageUrl: { type: String, required: true },
  dateUploaded: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.models.Ringtone ||
  mongoose.model("Ringtone", ringtoneSchema);
