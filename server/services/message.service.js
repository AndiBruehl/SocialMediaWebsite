import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";
import { getIO } from "../socket/index.js";

// Hilfsfunktion: 1:1 Conversation finden oder anlegen
async function findOrCreateDirectConversation(userId1, userId2) {
  // Prüfe ob Conversation existiert (beide participants)
  let conv = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [userId1, userId2] },
  });

  if (!conv) {
    conv = await Conversation.create({
      isGroup: false,
      participants: [userId1, userId2],
    });
  }

  return conv;
}

export async function sendMessage({
  sender,
  recipient,
  text,
  mediaUrl,
  mediaPublicId,
}) {
  if (!sender || !recipient) {
    throw new Error("sender and recipient are required");
  }

  const sId = new mongoose.Types.ObjectId(sender);
  const rId = new mongoose.Types.ObjectId(recipient);

  // 1:1 conversation (create if missing)
  const conversation = await findOrCreateDirectConversation(sId, rId);

  const msg = await Message.create({
    conversationId: conversation._id,
    sender: sId,
    recipient: rId,
    text: text || "",
    mediaUrl: mediaUrl || "",
    mediaPublicId: mediaPublicId || "",
    readBy: [sId], // sender has implicitly read the message
  });

  // Update conversation lastMessage + bump updatedAt
  conversation.lastMessage = msg._id;
  await conversation.save();

  // Populate minimal fields for client
  const populated = await Message.findById(msg._id)
    .populate("sender", "_id username profilePicture")
    .populate("recipient", "_id username profilePicture");

  // Emit realtime event to both users
  try {
    const io = getIO();
    io.to(`user:${String(sId)}`).emit("message:new", populated);
    io.to(`user:${String(rId)}`).emit("message:new", populated);
  } catch (e) {
    // socket not initialized? do nothing
  }

  return populated;
}

export async function getConversation(userId1, userId2) {
  const sId = new mongoose.Types.ObjectId(userId1);
  const rId = new mongoose.Types.ObjectId(userId2);

  const conv = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [sId, rId] },
  });

  if (!conv) return [];

  const messages = await Message.find({ conversationId: conv._id })
    .sort({ createdAt: 1 })
    .populate("sender", "_id username profilePicture")
    .populate("recipient", "_id username profilePicture");

  return messages;
}

export async function getUnreadMessages(userId) {
  // Simple unread = messages not in readBy for this user
  const uid = new mongoose.Types.ObjectId(userId);
  const messages = await Message.find({ readBy: { $ne: uid }, recipient: uid })
    .sort({ createdAt: -1 })
    .populate("sender", "_id username profilePicture");
  return messages;
}

export async function markAsRead(messageId, userId) {
  const uid = new mongoose.Types.ObjectId(userId);
  const updated = await Message.findByIdAndUpdate(
    messageId,
    { $addToSet: { readBy: uid } },
    { new: true }
  );
  return updated;
}

export async function markAsUnread(messageId, userId) {
  const uid = new mongoose.Types.ObjectId(userId);
  const updated = await Message.findByIdAndUpdate(
    messageId,
    { $pull: { readBy: uid } },
    { new: true }
  );
  return updated;
}

export async function deleteMessage(messageId) {
  const deleted = await Message.findByIdAndDelete(messageId);
  return deleted;
}

export async function deleteConversation(userId1, userId2) {
  const sId = new mongoose.Types.ObjectId(userId1);
  const rId = new mongoose.Types.ObjectId(userId2);

  const conv = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [sId, rId] },
  });

  if (!conv) return;

  await Message.deleteMany({ conversationId: conv._id });
  await Conversation.findByIdAndDelete(conv._id);
}
