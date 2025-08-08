// server/routes/message.route.js
import express from "express";
import * as MessageController from "../controllers/message.controller.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

const router = express.Router();

router.post("/send", MessageController.sendMessage);
router.get(
  "/conversation/:userId1/:userId2",
  MessageController.getConversation
);
router.get("/unread/:userId", MessageController.getUnreadMessages);
router.put("/read/:messageId", MessageController.markAsRead);
router.put("/unread/:messageId", MessageController.markAsUnread);
router.delete("/delete/:messageId", MessageController.deleteMessage);
router.delete(
  "/conversation/:userId1/:userId2",
  MessageController.deleteConversation
);

// ✅ NEW: all conversations (direct + groups) for a user
router.get("/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Direct (isGroup: false)
    const directs = await Conversation.find({
      isGroup: false,
      participants: userId,
    })
      .populate("participants", "username profilePicture")
      .sort({ updatedAt: -1 });

    const directThreads = await Promise.all(
      directs.map(async (c) => {
        const peer = (c.participants || []).find(
          (p) => String(p._id) !== String(userId)
        );
        const last = await Message.findOne({ conversationId: c._id })
          .sort({ createdAt: -1 })
          .lean();
        return {
          _id: c._id,
          isGroup: false,
          peer,
          lastMessage: last
            ? { text: last.text, createdAt: last.createdAt }
            : null,
        };
      })
    );

    // Groups (isGroup: true)
    const groups = await Conversation.find({
      isGroup: true,
      participants: userId,
    })
      .populate("participants", "username profilePicture")
      .sort({ updatedAt: -1 });

    const groupThreads = await Promise.all(
      groups.map(async (g) => {
        const last = await Message.findOne({ conversationId: g._id })
          .sort({ createdAt: -1 })
          .lean();
        return {
          _id: g._id,
          isGroup: true,
          name: g.name || "Gruppe",
          lastMessage: last
            ? { text: last.text, createdAt: last.createdAt }
            : null,
        };
      })
    );

    res.json({ conversations: [...directThreads, ...groupThreads] });
  } catch (e) {
    console.error("conversations failed:", e);
    res.status(500).json({ error: "Failed to load conversations" });
  }
});

export default router;
