// models/Comment.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  datePosted: { type: Date, default: Date.now },
});

export default mongoose.models.Comment ||
  mongoose.model("Comment", commentSchema);
