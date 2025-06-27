import mongoose from "mongoose";
import { Schema } from "mongoose";

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
