// Import mongoose for schema and model management
import mongoose from "mongoose";

// Define the schema for the 'Ringtone' model
const ringtoneSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the ringtone
  mp3Url: { type: String, required: true }, // URL for the MP3 file
  imageUrl: { type: String, required: true }, // URL for the ringtone's image
  dateUploaded: { type: Date, default: Date.now }, // Date when the ringtone was uploaded
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
});

// Export the 'Ringtone' model, use existing one or create a new one
export default mongoose.models.Ringtone ||
  mongoose.model("Ringtone", ringtoneSchema);
