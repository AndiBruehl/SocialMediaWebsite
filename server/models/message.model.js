// models/message.model.js
import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["image", "gif"], required: true },
    url: { type: String, required: true },
    publicId: { type: String }, // for deletion later if needed
    width: Number,
    height: Number,
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      index: true,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    text: { type: String, default: "" }, // text is optional (pure media supported)
    attachments: { type: [attachmentSchema], default: [] },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // read receipts
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
