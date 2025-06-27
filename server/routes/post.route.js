import express from "express";

const router = express.Router();

import {
  createPostController,
  deletePostController,
  getPostController,
  getTimelinePostController,
  likeDislikeController,
  updatePostController,
} from "../controllers/post.controller.js";

// Create a post
router.post("/create", createPostController);

// Update a post
router.put("/update/:id", updatePostController);

// Delete a post
router.delete("/delete/:id", deletePostController);

//like and dislike a post
router.put("/like/:id", likeDislikeController);

// Get a post by ID
router.get("/get/:id", getPostController);

// Get timeline posts
router.get("/timeline", getTimelinePostController);
export default router;
