import * as MessageService from "../services/message.service.js";

export async function sendMessage(req, res) {
  try {
    const { sender, recipient, text, mediaUrl, mediaPublicId } = req.body;
    const msg = await MessageService.sendMessage({
      sender,
      recipient,
      text,
      mediaUrl,
      mediaPublicId,
    });
    res.status(201).json(msg);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: err.message });
  }
}

export async function getConversation(req, res) {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await MessageService.getConversation(userId1, userId2);
    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch conversation", error: err.message });
  }
}

export async function getUnreadMessages(req, res) {
  try {
    const { userId } = req.params;
    const messages = await MessageService.getUnreadMessages(userId);
    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch unread messages", error: err.message });
  }
}

export async function markAsRead(req, res) {
  try {
    const { messageId } = req.params;
    const { userId } = req.body; // pass current user id
    const updated = await MessageService.markAsRead(messageId, userId);
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to mark message as read", error: err.message });
  }
}

export async function markAsUnread(req, res) {
  try {
    const { messageId } = req.params;
    const { userId } = req.body; // pass current user id
    const updated = await MessageService.markAsUnread(messageId, userId);
    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Failed to mark message as unread",
      error: err.message,
    });
  }
}

export async function deleteMessage(req, res) {
  try {
    const { messageId } = req.params;
    const deleted = await MessageService.deleteMessage(messageId);
    if (!deleted) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete message", error: err.message });
  }
}

export async function deleteConversation(req, res) {
  try {
    const { userId1, userId2 } = req.params;
    await MessageService.deleteConversation(userId1, userId2);
    res.json({ message: "Conversation deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete conversation", error: err.message });
  }
}
