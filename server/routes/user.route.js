import express from "express";
import {
  getAllUsersController,
  getUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// 📂 Upload-Ordner sicherstellen
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};
ensureDir("uploads/tmp");

// 📸 Multer: temporär speichern, bevor Cloudinary übernimmt
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/tmp");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});
const upload = multer({ storage });

// ⚠️ Reihenfolge: erst "/" dann "/:id"
router.get("/", getAllUsersController);
router.get("/:id", getUserController);

// Update (Profil & Cover möglich)
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  updateUserController
);

// Delete
router.delete("/:id", verifyToken, deleteUserController);

export default router;
