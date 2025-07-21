import express from "express";

const router = express.Router();

import {
  addCommentToPostController,
  createPostController,
  deleteCommentFromPostController,
  deletePostController,
  deleteReplyFromCommentController,
  getPostController,
  getUserPostsController,
  getTimelinePostController,
  likeDislikeController,
  likeDislikeReplyController,
  replyToCommentController,
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
router.get("/timeline/:userId", getTimelinePostController);

// Add a comment to a post
router.post("/comment/:postId", addCommentToPostController);

//Delete a comment from a post
router.delete("/comment/:postId/:commentId", deleteCommentFromPostController);

// Add a comment to a comment
router.post("/comment/:postId/:commentId/replies", replyToCommentController);

// Delete a comment from a comment
router.delete(
  "/comment/:postId/:commentId/replies/:replyId",
  deleteReplyFromCommentController
);

// Like or dislike a reply to a comment
router.put(
  "/comment/:postId/:commentId/replies/:replyId/like",
  likeDislikeReplyController
);

// get posts by userId

router.get("/user/:userId", getUserPostsController);

export default router;
