import express from "express";
import userRoutes from "./user.route.js";
import postRoutes from "./post.route.js";
import messageRoutes from "./message.route.js";
import groupRoutes from "./group.route.js"; // falls genutzt
import authRoutes from "./auth.route.js"; // falls vorhanden
import notificationRoutes from "./notification.route.js"; // falls vorhanden

const router = express.Router();

router.use("/api/v1/users", userRoutes);
router.use("/api/v1/post", postRoutes);
router.use("/api/v1/messages", messageRoutes);
router.use("/api/v1/groups", groupRoutes);
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/notifications", notificationRoutes);

export default router;
