import mongoose from "mongoose";
import { Schema } from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  desc: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      desc: String,
      createdAt: { type: Date, default: Date.now },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
  ],
});

const postSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
    default: "",
  },
  img: {
    type: String,
    default: "",
  },
  likes: {
    type: Array,
    default: [],
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
