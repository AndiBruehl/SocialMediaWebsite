import express from "express";
import * as MessageController from "../controllers/message.controller.js";

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

export default router;
