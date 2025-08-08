// controllers/post.controller.js
import {
  addCommentToPost,
  deleteCommentFromPost,
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  likeDislikePost,
  likeReply,
  updatePost,
  replyToComment,
  deleteReplyFromComment,
  getPostsByUserId,
} from "../services/post.service.js";

import { uploadToCloudinary } from "../middleware/upload.js";
import fs from "fs";
import Post from "../models/post.model.js";

// ✅ Create Post
export const createPostController = async (req, res) => {
  try {
    const { userId, desc = "", img } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    let imageUrl = img?.trim() || "";

    // Wenn Datei vom Multer-Upload kommt → zu Cloudinary hochladen
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.path, "post_images");
        imageUrl = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    // Wenn weder img noch req.file → imageUrl bleibt leer
    const postData = {
      userId,
      desc,
      img: imageUrl, // ✅ hier wird URL sicher eingetragen
      createdAt: Date.now(),
    };

    const newPost = await createPost(postData);

    return res.status(201).json({
      message: "Post created successfully",
      newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Update Post
export const updatePostController = async (req, res) => {
  try {
    const { desc, img, userId } = req.body;
    const updateData = { updatedAt: Date.now() };

    if (typeof desc === "string") updateData.desc = desc;
    if (typeof img === "string" && img.trim()) updateData.img = img;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, "post_images");
      updateData.img = result.secure_url;
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.warn("Konnte temporäre Datei nicht löschen:", err.message);
      }
    }

    const updatedPost = await updatePost(req.params, { ...updateData, userId });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    console.error("❌ Error updating post:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete Post
export const deletePostController = async (req, res) => {
  try {
    const deletedPost = await deletePost(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      deletedPost,
    });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Like / Dislike Post
export const likeDislikeController = async (req, res) => {
  try {
    const post = await likeDislikePost(req.params, req.body);
    return res.status(200).json({
      message: "Post liked/disliked successfully",
      post,
    });
  } catch (error) {
    console.error("❌ Error liking/disliking post:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Post by ID
export const getPostController = async (req, res) => {
  try {
    const post = await getPost(req.params);
    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error("❌ Error retrieving post:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Get Timeline Posts
export const getTimelinePostController = async (req, res) => {
  try {
    const timelinePosts = await getTimelinePosts(req.params);
    return res.status(200).json({
      message: "Timeline Posts fetched successfully",
      timelinePosts,
    });
  } catch (error) {
    console.error("❌ Error retrieving posts:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Add Comment
export const addCommentToPostController = async (req, res) => {
  try {
    const comments = await addCommentToPost({
      postId: req.params.postId,
      userId: req.body.userId,
      desc: req.body.desc,
    });

    return res.status(200).json({ message: "Comment added", comments });
  } catch (error) {
    console.error("❌ Error adding comment:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete Comment
export const deleteCommentFromPostController = async (req, res) => {
  try {
    const comments = await deleteCommentFromPost({
      postId: req.params.postId,
      commentId: req.params.commentId,
    });

    return res.status(200).json({ message: "Comment removed", comments });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Reply to Comment
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

// ✅ Delete Reply from Comment
export const deleteReplyFromCommentController = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const updatedReplies = await deleteReplyFromComment(
      postId,
      commentId,
      replyId
    );

    return res.status(200).json({
      message: "Reply deleted successfully",
      replies: updatedReplies,
    });
  } catch (error) {
    console.error("❌ Error deleting reply:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// ✅ Like/Unlike a Reply
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

// ✅ Posts by userId
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
