import Message from "../models/message.model.js";

// Send message
export const sendMessage = async ({ sender, recipient, text }) => {
  return await Message.create({ sender, recipient, text });
};

// All messages between 2 users
export const getConversation = async (userId1, userId2) => {
  return await Message.find({
    $or: [
      { sender: userId1, recipient: userId2 },
      { sender: userId2, recipient: userId1 },
    ],
  }).sort({ createdAt: 1 });
};

// Unread messages for a user
export const getUnreadMessages = async (userId) => {
  return await Message.find({ recipient: userId, read: false });
};

// Mark a single message as read
export const markAsRead = async (messageId) => {
  return await Message.findByIdAndUpdate(
    messageId,
    { read: true },
    { new: true }
  );
};

// Mark a single message as unread
export const markAsUnread = async (messageId) => {
  return await Message.findByIdAndUpdate(
    messageId,
    { read: false },
    { new: true }
  );
};

// delete a message
export const deleteMessage = async (messageId) => {
  return await Message.findByIdAndDelete(messageId);
};

//delete conversation
export const deleteConversation = async (userId1, userId2) => {
  return await Message.deleteMany({
    $or: [
      { sender: userId1, recipient: userId2 },
      { sender: userId2, recipient: userId1 },
    ],
  });
};
