// Import mongoose for schema and model management
import mongoose from "mongoose";

// Define the schema for the 'Song' model
const songSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the song
  artistName: { type: String, required: true }, // Name of the artist
  mp3Url: { type: String, required: true }, // URL for the MP3 file
  imageUrl: { type: String, required: true }, // URL for the song's image
  dateUploaded: { type: Date, default: Date.now }, // Date when the song was uploaded
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
});

// Export the 'Song' model, use existing one or create a new one
export default mongoose.models.Song || mongoose.model("Song", songSchema);
