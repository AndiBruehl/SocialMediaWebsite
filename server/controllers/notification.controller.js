// server/controllers/notification.controller.js
import Notification from "../models/notification.model.js";

export const getUnreadForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Notification.find({ userId, read: false })
      .populate("actorId", "username profilePicture")
      .populate("postId", "_id")
      .sort({ createdAt: -1 });
    res.status(200).json({ notifications: items });
  } catch (err) {
    console.error("❌ getUnreadForUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const markOneRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ markOneRead:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany({ userId, read: false }, { read: true });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("❌ markAllRead:", err);
    res.status(500).json({ message: "Server error" });
  }
};
