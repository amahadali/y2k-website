// Import mongoose for schema and model management
import mongoose from "mongoose";

// Define the schema for the 'User' model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Unique and required username
  email: { type: String, required: true, unique: true }, // Unique and required email address
  password: { type: String }, // Password, not required to allow for cases where authentication is handled differently
  profileImage: { type: String }, // URL for the profile image, optional
  dateJoined: { type: Date, default: Date.now }, // Date the user joined, defaulting to the current date and time
  libraries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Library" }], // References to Library models
});

// Export the 'User' model, use existing one or create a new one
export default mongoose.models.User || mongoose.model("User", userSchema);
