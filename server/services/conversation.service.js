// services/conversation.service.js
import Conversation from "../models/conversation.model.js";

export async function findOrCreateDirect(a, b) {
  const ids = [a, b].map(String).sort();
  let conv = await Conversation.findOne({
    isGroup: false,
    participants: { $all: ids, $size: 2 },
  });
  if (!conv) {
    conv = await Conversation.create({ isGroup: false, participants: ids });
  }
  return conv;
}

export async function createGroup({ name, admin, members }) {
  const participants = Array.from(new Set([admin, ...members]));
  return Conversation.create({ isGroup: true, name, admin, participants });
}

export function listForUser(userId) {
  return Conversation.find({ participants: userId })
    .populate("participants", "username profilePicture")
    .populate({
      path: "lastMessage",
      populate: { path: "sender", select: "username profilePicture" },
    })
    .sort({ updatedAt: -1 });
}
