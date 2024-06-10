// models/Library.js
import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  dateCreated: { type: Date, default: Date.now },
});

export default mongoose.models.Library ||
  mongoose.model("Library", librarySchema);
