// controllers/conversation.controller.js
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export async function startOrGetDM(req, res) {
  try {
    const { userId, peerId } = req.body;
    if (!userId || !peerId) {
      return res.status(400).json({ error: "userId and peerId are required" });
    }

    // existiert schon?
    let conv = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [userId, peerId] },
    })
      .populate("participants", "username profilePicture")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username profilePicture" },
      });

    if (!conv) {
      conv = await Conversation.create({
        isGroup: false,
        participants: [userId, peerId],
      });
      conv = await conv
        .populate("participants", "username profilePicture")
        .execPopulate?.(); // bei alten Mongoose-Versionen; falls neu: nochmal findById+populate
      if (!conv.participants?.length) {
        conv = await Conversation.findById(conv._id).populate(
          "participants",
          "username profilePicture"
        );
      }
    }

    return res.json(conv);
  } catch (err) {
    console.error("startOrGetDM error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function listForUser(req, res) {
  try {
    const { userId } = req.params;
    const list = await Conversation.find({
      participants: { $in: [userId] },
    })
      .sort({ updatedAt: -1 })
      .populate("participants", "username profilePicture")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "username profilePicture" },
      });

    return res.json(list);
  } catch (err) {
    console.error("listForUser error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
