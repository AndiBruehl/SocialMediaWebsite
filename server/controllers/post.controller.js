// server/controllers/post.controller.js
import {
  addCommentToPost,
  deleteCommentFromPost,
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  likeReply,
  updatePost,
  replyToComment,
  deleteReplyFromComment,
  getPostsByUserId,
} from "../services/post.service.js";

import { uploadToCloudinary } from "../middleware/upload.js";
import fs from "fs";

import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

/**
 * POST /post/create
 * Body: { userId, desc?, img?, location? }
 * Optional: req.file (multer) → Cloudinary
 */
export const createPostController = async (req, res) => {
  try {
    const { userId, desc = "", img, location = "" } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    let imageUrl = (img || "").trim();

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path, "post_images");
        imageUrl = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({ message: "Image upload failed" });
      } finally {
        try {
          fs.unlinkSync(req.file.path);
        } catch {}
      }
    }

    const postData = {
      userId,
      desc,
      img: imageUrl,
      location,
      createdAt: Date.now(),
    };

    const newPost = await createPost(postData);
    return res
      .status(201)
      .json({ message: "Post created successfully", newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * PUT /post/update/:id
 * Body: { desc?, img?, userId? } | optional req.file
 */
export const updatePostController = async (req, res) => {
  try {
    const { desc, img, userId, location } = req.body;
    const updateData = { updatedAt: Date.now() };

    if (typeof desc === "string") updateData.desc = desc;
    if (typeof img === "string" && img.trim()) updateData.img = img.trim();
    if (typeof location === "string") updateData.location = location.trim();

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path, "post_images");
        updateData.img = result.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
        return res.status(500).json({ message: "Image upload failed" });
      } finally {
        try {
          fs.unlinkSync(req.file.path);
        } catch {}
      }
    }

    const updatedPost = await updatePost(req.params, { ...updateData, userId });
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });

    return res
      .status(200)
      .json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    console.error("❌ Error updating post:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * DELETE /post/delete/:id
 */
export const deletePostController = async (req, res) => {
  try {
    const deletedPost = await deletePost(req.params.id);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });

    return res
      .status(200)
      .json({ message: "Post deleted successfully", deletedPost });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * PUT /post/like/:id
 * Body: { userId }
 * Returns: { likes: string[] }
 * Creates notification on like (not on unlike, and not for self-like)
 */
export const likeDislikeController = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const actor = String(userId);
    const owner = String(post.userId);
    const alreadyLiked = post.likes.some((l) => String(l) === actor);

    if (alreadyLiked) {
      post.likes = post.likes.filter((l) => String(l) !== actor);
    } else {
      post.likes.push(actor);
    }

    await post.save();

    if (!alreadyLiked && owner !== actor) {
      try {
        await Notification.create({
          userId: owner, // recipient
          actorId: actor, // who liked
          postId: post._id,
          type: "like",
        });
      } catch (e) {
        console.warn("⚠️ Notification (like) create failed:", e.message);
      }
    }

    return res.status(200).json({ likes: post.likes });
  } catch (error) {
    console.error("Like/Dislike Fehler:", error);
    return res.status(500).json({ error: "Fehler beim Like/Dislike" });
  }
};

/**
 * GET /post/get/:id
 * Returns: { post }
 * Note: post.userId ist in deinem Schema ein String → nicht populatable
 *       Wir populaten Kommentar-Autoren.
 */
export const getPostController = async (req, res) => {
  try {
    // Service getPost() macht kein populate → hier direkt mit Model:
    const post = await Post.findById(req.params.id).populate({
      path: "comments.userId",
      select: "username profilePicture",
    });

    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.status(200).json({ message: "Post fetched successfully", post });
  } catch (error) {
    console.error("❌ Error retrieving post:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * GET /post/timeline/:userId
 */
export const getTimelinePostController = async (req, res) => {
  try {
    const timelinePosts = await getTimelinePosts(req.params);
    return res
      .status(200)
      .json({ message: "Timeline Posts fetched successfully", timelinePosts });
  } catch (error) {
    console.error("❌ Error retrieving posts:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * POST /post/comment/:postId
 * Body: { userId, desc, img? }  // img = Cloudinary URL (Client lädt hoch)
 * Returns: { comments }         // populated comment authors
 */
export const addCommentToPostController = async (req, res) => {
  try {
    const { userId, desc = "", img = "" } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!desc.trim() && !img.trim()) {
      return res
        .status(400)
        .json({ message: "Either text or image is required" });
    }

    await addCommentToPost({
      postId: req.params.postId,
      userId,
      desc: desc.trim(),
      img: img.trim(),
    });

    const post = await Post.findById(req.params.postId).populate({
      path: "comments.userId",
      select: "username profilePicture",
    });

    return res
      .status(200)
      .json({ message: "Comment added", comments: post?.comments || [] });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * DELETE /post/comment/:postId/:commentId
 */
export const deleteCommentFromPostController = async (req, res) => {
  try {
    await deleteCommentFromPost({
      postId: req.params.postId,
      commentId: req.params.commentId,
    });

    // aktualisierte Comments (populated) zurück
    const post = await Post.findById(req.params.postId).populate({
      path: "comments.userId",
      select: "username profilePicture",
    });

    return res
      .status(200)
      .json({ message: "Comment removed", comments: post?.comments || [] });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * POST /post/comment/:postId/:commentId/replies
 * Body: { userId, desc }
 */
export const replyToCommentController = async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId, desc } = req.body;

  try {
    const replies = await replyToComment(postId, commentId, { userId, desc });
    return res.status(200).json(replies);
  } catch (err) {
    console.error("❌ Error adding reply:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

/**
 * DELETE /post/comment/:postId/:commentId/replies/:replyId
 */
export const deleteReplyFromCommentController = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const updatedReplies = await deleteReplyFromComment(
      postId,
      commentId,
      replyId
    );

    return res
      .status(200)
      .json({ message: "Reply deleted successfully", replies: updatedReplies });
  } catch (error) {
    console.error("❌ Error deleting reply:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * PUT /post/comment/:postId/:commentId/replies/:replyId/like
 * Body: { userId }
 */
export const likeDislikeReplyController = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const { userId } = req.body;

    const likes = await likeReply(postId, commentId, replyId, userId);
    return res
      .status(200)
      .json({ message: "Reply like status updated", likes });
  } catch (error) {
    console.error("❌ Fehler beim Liken der Reply:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

/**
 * GET /post/user/:userId
 */
export const getUserPostsController = async (req, res) => {
  try {
    const posts = await getPostsByUserId(req.params.userId);
    return res.status(200).json({ posts });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

/**
 * (Optional) GET /post/all
 */
export const getAllPostsController = async (_req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json({ posts });
  } catch (err) {
    console.error("❌ Error fetching all posts:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
