import express from "express";
import {
  getAllUsersController,
  getUserController,
  updateUserController,
  deleteUserController,
  // 👇 these two were missing
  followUserController,
  unfollowUserController,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};
ensureDir("uploads/tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/tmp"),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() + "-" + file.fieldname + path.extname(file.originalname)
    ),
});
const upload = multer({ storage });

// === LIST ALL USERS (needed by Messages page)
router.get("/", getAllUsersController);

// === GET ONE
router.get("/:id", getUserController);

// === FOLLOW / UNFOLLOW  ✅ add these
// If you want to enforce auth, add verifyToken between path and controller.
router.put("/:id/follow", /* verifyToken, */ followUserController);
router.put("/:id/unfollow", /* verifyToken, */ unfollowUserController);

// === UPDATE (profile + cover)
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  updateUserController
);

// === DELETE
router.delete("/:id", verifyToken, deleteUserController);

export default router;
