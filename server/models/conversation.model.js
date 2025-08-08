// models/conversation.model.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    isGroup: { type: Boolean, default: false, index: true },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    ],
    name: { type: String }, // for groups
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // group owner
    lastMessage: {
      // denormalized for list previews
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ updatedAt: -1 });

export default mongoose.model("Conversation", conversationSchema);
