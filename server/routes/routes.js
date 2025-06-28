import express from "express";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";
import postRoutes from "./post.route.js";
import messageRoutes from "./message.route.js";
import groupRoutes from "./group.route.js";

const router = express.Router();

const baseUrl = "api/v1";

router.use(`/${baseUrl}/users`, userRoutes);
router.use(`/${baseUrl}/auth`, authRoutes);
router.use(`/${baseUrl}/post`, postRoutes);
router.use(`/${baseUrl}/messages`, messageRoutes);
router.use(`/${baseUrl}/group`, groupRoutes);

// You can add more routes here as needed

// Add any additional routes here

export default router;
