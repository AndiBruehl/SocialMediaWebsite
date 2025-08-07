// routes/user.routes.js
import express from "express";
import {
  updateUserController,
  deleteUserController,
  getUserController,
  getAllUsersController,
  followUserController,
  unfollowUserController,
  createUserController,
  updateProfilePic,
  updateCoverPic,
} from "../controllers/user.controller.js";

import {
  upload,
  uploadProfilePic,
  uploadCoverPic,
} from "../middleware/upload.js";

import User from "../models/user.model.js";

const router = express.Router();

// 🔁 Vorab aktuellen User laden, damit Multer Zugriff hat
router.param("id", async (req, res, next, id) => {
  try {
    const currentUser = await User.findById(id);
    if (!currentUser)
      return res.status(404).json({ message: "User not found" });
    req.currentUser = currentUser;
    next();
  } catch (err) {
    console.error("User laden fehlgeschlagen:", err);
    res.status(500).json({ message: "Serverfehler" });
  }
});

// 🔄 Beide Bilder gleichzeitig updaten
router.put(
  "/:id",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  updateUserController
);

// Nur Profilbild
router.put(
  "/profile-pic/:id",
  uploadProfilePic.single("profilePicture"),
  updateProfilePic
);

// Nur Coverbild
router.put(
  "/cover-pic/:id",
  uploadCoverPic.single("coverPicture"),
  updateCoverPic
);

router.delete("/:id", deleteUserController);
router.get("/:id", getUserController);
router.get("/", getAllUsersController);
router.put("/:id/follow", followUserController);
router.put("/:id/unfollow", unfollowUserController);
router.post("/", createUserController);

export default router;
