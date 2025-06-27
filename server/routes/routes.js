import express from "express";
import userRoutes from "./user.route.js";
import authRoutes from "./auth.route.js";
import postRoutes from "./post.route.js";

const router = express.Router();

const baseUrl = "api/v1";

router.use(`/${baseUrl}/users`, userRoutes);
router.use(`/${baseUrl}/auth`, authRoutes);
router.use(`/${baseUrl}/post`, postRoutes);

// Add any additional routes here

export default router;
