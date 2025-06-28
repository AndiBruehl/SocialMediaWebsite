import * as MessageService from "../services/message.service.js";

export const sendMessage = async (req, res) => {
  try {
    const { sender, recipient, text } = req.body;
    const msg = await MessageService.sendMessage({ sender, recipient, text });
    res.status(201).json(msg);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: err.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await MessageService.getConversation(userId1, userId2);
    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch conversation", error: err.message });
  }
};

export const getUnreadMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await MessageService.getUnreadMessages(userId);
    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch unread messages", error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const updatedMessage = await MessageService.markAsRead(messageId);
    res.json(updatedMessage);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to mark message as read", error: err.message });
  }
};

export const markAsUnread = async (req, res) => {
  try {
    const message = await MessageService.markAsUnread(
      req.params.messageId,
      { read: false },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await MessageService.deleteMessage(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete message", error: err.message });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    await MessageService.deleteConversation(userId1, userId2);
    res.json({ message: "Conversation deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete conversation", error: err.message });
  }
};
