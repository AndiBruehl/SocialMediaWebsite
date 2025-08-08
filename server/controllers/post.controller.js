// controllers/post.controller.js
import fs from "fs";
import {
  addCommentToPost,
  deleteCommentFromPost,
  createPost,
  deletePost,
  getTimelinePosts,
  likeReply,
  updatePost,
  replyToComment,
  deleteReplyFromComment,
  getPostsByUserId,
} from "../services/post.service.js";
import { uploadToCloudinary } from "../middleware/upload.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

// =====================================
// Create Post (Body.img ODER req.file)
// =====================================
export const createPostController = async (req, res) => {
  try {
    const { userId, desc = "", img } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    let imageUrl = (img || "").trim();
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path, "post_images");
        imageUrl = result.secure_url;
      } finally {
        try {
          fs.unlinkSync(req.file.path);
        } catch {}
      }
    }

    const newPost = await createPost({
      userId,
      desc,
      img: imageUrl,
      createdAt: Date.now(),
    });

    res.status(201).json({ message: "Post created successfully", newPost });
  } catch (err) {
    console.error("createPost:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =====================================
// Update Post (Body.img ODER req.file)
// =====================================
export const updatePostController = async (req, res) => {
  try {
    const { desc, img, userId } = req.body;
    const updateData = { updatedAt: Date.now() };
    if (typeof desc === "string") updateData.desc = desc;
    if (typeof img === "string" && img.trim()) updateData.img = img.trim();

    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path, "post_images");
        updateData.img = result.secure_url;
      } finally {
        try {
          fs.unlinkSync(req.file.path);
        } catch {}
      }
    }

    const updatedPost = await updatePost(req.params, { ...updateData, userId });
    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (err) {
    console.error("updatePost:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =====================================
// Delete Post
// =====================================
export const deletePostController = async (req, res) => {
  try {
    const deletedPost = await deletePost(req.params.id);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post deleted successfully", deletedPost });
  } catch (err) {
    console.error("deletePost:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =====================================
// Like / Dislike Post (+ Notification)
// PUT /post/like/:id  { userId }
// =====================================
export const likeDislikeController = async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const actor = String(userId);
    const owner = String(post.userId);
    const already = post.likes.some((l) => String(l) === actor);

    post.likes = already
      ? post.likes.filter((l) => String(l) !== actor)
      : [...post.likes, actor];

    await post.save();

    if (!already && owner !== actor) {
      // try/catch schlucken – Notifications sollen Likes nicht blockieren
      try {
        await Notification.create({
          userId: owner,
          actorId: actor,
          postId: post._id,
          type: "like",
        });
      } catch {}
    }

    res.status(200).json({ likes: post.likes });
  } catch (err) {
    console.error("likeDislike:", err);
    res.status(500).json({ error: "Fehler beim Like/Dislike" });
  }
};

// =====================================
// Get Post by ID (mit populate)
// GET /post/get/:id
// =====================================
export const getPostController = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("userId", "username profilePicture")
      .populate("comments.userId", "username profilePicture")
      .populate("comments.replies.userId", "username profilePicture");

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json({ message: "Post fetched successfully", post });
  } catch (err) {
    console.error("getPost:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =====================================
// Timeline Posts (falls Following-Logik genutzt)
// =====================================
export const getTimelinePostController = async (req, res) => {
  try {
    const timelinePosts = await getTimelinePosts(req.params);
    res
      .status(200)
      .json({ message: "Timeline Posts fetched successfully", timelinePosts });
  } catch (err) {
    console.error("getTimelinePosts:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =====================================
// Add Comment (+ Notification)
// POST /post/comment/:postId  { userId, desc }
// Antwort: post.comments (populated)
// =====================================
export const addCommentToPostController = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, desc } = req.body;

    await addCommentToPost({ postId, userId, desc });

    // sofort populated zurückgeben
    const populated = await Post.findById(postId).populate(
      "comments.userId",
      "username profilePicture"
    );

    // Notification (wenn nicht eigener Post)
    try {
      const post = await Post.findById(postId);
      const owner = String(post.userId);
      const actor = String(userId);
      if (owner !== actor) {
        await Notification.create({
          userId: owner,
          actorId: actor,
          postId,
          type: "comment",
        });
      }
    } catch {}

    res
      .status(200)
      .json({ message: "Comment added", comments: populated.comments });
  } catch (err) {
    console.error("addComment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =====================================
// Delete Comment (Antwort: neue comments-Liste)
// =====================================
export const deleteCommentFromPostController = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    await deleteCommentFromPost({ postId, commentId });

    const populated = await Post.findById(postId).populate(
      "comments.userId",
      "username profilePicture"
    );

    res
      .status(200)
      .json({ message: "Comment removed", comments: populated.comments });
  } catch (err) {
    console.error("deleteComment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =====================================
// Replies (optional – unverändert bis auf populate)
// =====================================
export const replyToCommentController = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, desc } = req.body;
    await replyToComment(postId, commentId, { userId, desc });

    const populated = await Post.findById(postId)
      .populate("comments.userId", "username profilePicture")
      .populate("comments.replies.userId", "username profilePicture");

    res
      .status(200)
      .json({ message: "Reply added", comments: populated.comments });
  } catch (err) {
    console.error("replyToComment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteReplyFromCommentController = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    await deleteReplyFromComment(postId, commentId, replyId);

    const populated = await Post.findById(postId)
      .populate("comments.userId", "username profilePicture")
      .populate("comments.replies.userId", "username profilePicture");

    res
      .status(200)
      .json({ message: "Reply deleted", comments: populated.comments });
  } catch (err) {
    console.error("deleteReply:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const likeDislikeReplyController = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const { userId } = req.body;
    const likes = await likeReply(postId, commentId, replyId, userId);
    res.status(200).json({ message: "Reply like status updated", likes });
  } catch (err) {
    console.error("likeReply:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =====================================
// Posts eines Users
// =====================================
export const getUserPostsController = async (req, res) => {
  try {
    const posts = await getPostsByUserId(req.params.userId);
    res.status(200).json({ posts });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: err.message });
  }
};

// =====================================
// Optional: Alle Posts (für Newsfeed „alle“)
// =====================================
export const getAllPostsController = async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username profilePicture")
      .sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (err) {
    console.error("getAllPosts:", err);
    res.status(500).json({ message: "Server error" });
  }
};
