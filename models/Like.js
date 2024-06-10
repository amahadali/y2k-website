// models/Like.js
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  dateLiked: { type: Date, default: Date.now },
});

export default mongoose.models.Like || mongoose.model("Like", likeSchema);
