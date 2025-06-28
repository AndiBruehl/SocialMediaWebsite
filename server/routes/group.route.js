import express from "express";
import * as GroupController from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", GroupController.createGroup);
router.post("/join", GroupController.joinGroup);
router.post("/leave", GroupController.leaveGroup);
router.post("/message/:conversationId", GroupController.sendGroupMessage);
router.get("/message/:conversationId", GroupController.getGroupMessages);
router.get("/conversations/:userId", GroupController.getUserGroups);

export default router;
