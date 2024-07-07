import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  profileImage: { type: String },
  dateJoined: { type: Date, default: Date.now },
  libraries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Library" }],
});

export default mongoose.models.User || mongoose.model("User", userSchema);
