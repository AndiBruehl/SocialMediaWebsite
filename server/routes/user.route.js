import express from "express";

import {
  createUserController,
  deleteUserController,
  followUserController,
  getAllUsersController,
  getUserController,
  unfollowUserController,
  updateUserController,
} from "../controllers/user.controller.js";

const router = express.Router();

// Create User

router.post("/", createUserController);

// Update user

router.put("/:id", updateUserController);

// delete user

router.delete("/:id", deleteUserController);

// get a user

router.get("/:id", getUserController);

// get all users

router.get("/", getAllUsersController);

// Follow user

router.put("/follow/:id", followUserController);

// Unfollow user

router.put("/unfollow/:id", unfollowUserController);

export default router;
