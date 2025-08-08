import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    isGroup: { type: Boolean, default: false, index: true },
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    ],
    name: { type: String },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  { timestamps: true }
);

// Ein 1:1-Conversation ist uniquely identified by Teilnehmer-Kombination.
// (Für echte Uniqueness bräuchte man ein sortiertes participants-Feld + index)
conversationSchema.index({ updatedAt: -1 });

export default mongoose.model("Conversation", conversationSchema);
