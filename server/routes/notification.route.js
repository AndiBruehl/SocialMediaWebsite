// server/routes/notification.route.js
import express from "express";
import {
  getUnreadForUser,
  markOneRead,
  markAllRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Ungelesene Benachrichtigungen des Users
router.get("/unread/:userId", getUnreadForUser);

// Eine Benachrichtigung als gelesen markieren
router.put("/:id/read", markOneRead);

// Alle Benachrichtigungen als gelesen markieren
router.put("/read-all/:userId", markAllRead);

export default router;
