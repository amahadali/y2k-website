// Import mongoose for schema and model management
import mongoose from "mongoose";

// Define the schema for the 'Post' model
const postSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the post
  imageUrl: { type: String, required: true }, // URL of the post's image
  postType: {
    type: String,
    enum: ["ringtone", "game", "song", "wallpaper"], // Allowed types for the post
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "postType", // Dynamic reference based on postType
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  datePosted: { type: Date, default: Date.now }, // Date the post was created
});

// Export the 'Post' model, use existing one or create a new one
export default mongoose.models.Post || mongoose.model("Post", postSchema);
