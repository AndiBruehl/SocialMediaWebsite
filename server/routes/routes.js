import express from "express";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";
import postRoutes from "./post.route.js";
import messageRoutes from "./message.route.js";

const router = express.Router();

const baseUrl = "api/v1";

router.use(`/${baseUrl}/users`, userRoutes);
router.use(`/${baseUrl}/auth`, authRoutes);
router.use(`/${baseUrl}/post`, postRoutes);
router.use(`/${baseUrl}/messages`, messageRoutes);

// Add any additional routes here

export default router;
