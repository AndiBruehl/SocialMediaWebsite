// routes/conversation.route.js
import express from "express";
import {
  startOrGetDM,
  listForUser,
} from "../controllers/conversation.controller.js";

const router = express.Router();

// 1:1 starten/holen
router.post("/start", startOrGetDM);

// alle Konversationen eines Users
router.get("/user/:userId", listForUser);

export default router;
