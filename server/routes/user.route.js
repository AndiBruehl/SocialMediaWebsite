import express from "express";
import {
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

// 📸 Multer-Konfiguration (temporäre Speicherung, bevor Cloudinary übernimmt)
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

// 🔹 GET User
router.get("/:id", getUserController);

// 🔹 UPDATE User (Profil- & Coverbild gleichzeitig möglich)
router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  updateUserController
);

// 🔹 DELETE User
router.delete("/:id", verifyToken, deleteUserController);

export default router;
