import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["song", "ringtone", "wallpaper", "game"],
  },
  name: {
    type: String,
    required: true,
  },
  artistName: {
    type: String,
    required: function () {
      return this.type === "song";
    },
  },
  developerName: {
    type: String,
    required: function () {
      return this.type === "game";
    },
  },
  ringtone: {
    type: String,
    required: function () {
      return this.type === "ringtone";
    },
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
