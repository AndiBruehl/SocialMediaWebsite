import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // für Gelesen-Status je User
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
