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

const router = express.Router();

// ⬆️ Profil-Update inkl. Bilder
router.put(
  "/:id",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
  ]),
  updateUserController
);

// 🔄 Nur Profilbild ändern
router.put(
  "/profile-pic/:id",
  uploadProfilePic.single("profilePicture"),
  updateProfilePic
);

// 🔄 Nur Coverbild ändern
router.put(
  "/cover-pic/:id",
  uploadCoverPic.single("coverPicture"),
  updateCoverPic
);

// 🔧 Benutzer verwalten
router.delete("/:id", deleteUserController);
router.get("/:id", getUserController);
router.get("/", getAllUsersController);
router.put("/:id/follow", followUserController);
router.put("/:id/unfollow", unfollowUserController);
router.post("/", createUserController);

export default router;
