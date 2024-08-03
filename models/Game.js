// Import mongoose for schema and model management
import mongoose from "mongoose";

// Define the schema for the 'Game' model
const gameSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Game title
  developerName: { type: String, required: true }, // Developer name
  imageUrl: { type: String, required: true }, // URL of the game's image
  dateUploaded: { type: Date, default: Date.now }, // Date of upload
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
});

// Export the 'Game' model, use existing one or create a new one
export default mongoose.models.Game || mongoose.model("Game", gameSchema);
