import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  desc: String,
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  desc: { type: String, required: false },
  img: { type: String, default: "" }, // ✅ NEU: Bild im Kommentar
  createdAt: { type: Date, default: Date.now },
  replies: [replySchema],
});

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  desc: { type: String, default: "" },
  img: { type: String, default: "" },
  location: { type: String, default: "" }, // ✅ NEU: Location
  likes: { type: Array, default: [] },
  comments: { type: [commentSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Post", postSchema);
