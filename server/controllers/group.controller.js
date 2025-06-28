import * as GroupService from "../services/group.service.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body; // members: [userId1, userId2, ...]
    const group = await GroupService.createGroup(name, members);
    res.status(201).json(group);
  } catch (error) {
    console.error("❌ Error creating group:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await GroupService.joinGroup(groupId, userId);
    res.status(200).json(group);
  } catch (error) {
    console.error("❌ Error joining group:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const group = await GroupService.leaveGroup(groupId, userId);
    res.status(200).json(group);
  } catch (error) {
    console.error("❌ Error leaving group:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { senderId, text } = req.body;
    const updatedGroup = await GroupService.sendMessageToGroup(
      conversationId,
      senderId,
      text
    );
    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("❌ Error sending message:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await GroupService.getGroupMessages(conversationId);
    res.status(200).json(messages);
  } catch (error) {
    console.error("❌ Error retrieving messages:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await GroupService.getUserGroups(userId);
    res.status(200).json(groups);
  } catch (error) {
    console.error("❌ Error retrieving groups:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
