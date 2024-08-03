// Import mongoose for schema and model management
import mongoose from "mongoose";

// Define the schema for the 'Library' model
const librarySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the library
  description: { type: String }, // Optional description of the library
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // References to Post models
  dateCreated: { type: Date, default: Date.now }, // Date the library was created
});

// Export the 'Library' model, use existing one or create a new one
export default mongoose.models.Library ||
  mongoose.model("Library", librarySchema);
