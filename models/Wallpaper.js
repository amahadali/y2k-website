// Import mongoose for schema and model management
import mongoose from "mongoose";

// Define the schema for the 'Wallpaper' model
const wallpaperSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the wallpaper
  imageUrl: { type: String, required: true }, // URL of the wallpaper image
  dateUploaded: { type: Date, default: Date.now }, // Date when the wallpaper was uploaded
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
});

// Export the 'Wallpaper' model, use existing one or create a new one
export default mongoose.models.Wallpaper ||
  mongoose.model("Wallpaper", wallpaperSchema);
