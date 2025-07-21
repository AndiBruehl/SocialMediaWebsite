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
} from "../services/post.service.js";

//createPost

export const createPostController = async (req, res) => {
  try {
    const newPost = await createPost(req.body);

    res.status(201).json({
      message: "Post created successfully",
      newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// updatePost

export const updatePostController = async (req, res) => {
  try {
    const updatedPost = await updatePost(req.params, req.body);

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post updated successfully",
      updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// deletePost

export const deletePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await deletePost(id, req.body);

    if (!deletedPost) {
      return res.status(404).json({ deletePost, message: "Post not found" });
    }

    res.status(200).json({
      message: "Post deleted successfully",
      deletedPost,
    });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// likePost and dislikePost

export const likeDislikeController = async (req, res) => {
  try {
    const post = await likeDislikePost(req.params, req.body);
    res.status(200).json({
      message: "Post liked/disliked successfully",
      post,
    });
  } catch (error) {
    console.error("Error liking/disliking post:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//getPost

export const getPostController = async (req, res) => {
  try {
    const post = await getPost(req.params, req.body);

    res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.error("Error retrieving post:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//getTimelinePost

export const getTimelinePostController = async (req, res) => {
  try {
    const timelinePosts = await getTimelinePosts(req.params);

    res.status(200).json({
      message: "Timeline Posts fetched successfully",
      timelinePosts,
    });
  } catch (error) {
    console.error("Error retrieving posts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//addCommentToPost

export const addCommentToPostController = async (req, res) => {
  try {
    const comments = await addCommentToPost({
      postId: req.params.postId,
      userId: req.body.userId,
      desc: req.body.desc,
    });

    res.status(200).json({ message: "Comment added", comments });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// deleteCommentFromPost

export const deleteCommentFromPostController = async (req, res) => {
  try {
    const comments = await deleteCommentFromPost({
      postId: req.params.postId,
      commentId: req.params.commentId,
    });

    res.status(200).json({ message: "Comment removed", comments });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// replyToComment

export const replyToCommentController = async (req, res) => {
  const { postId, commentId } = req.params;
  const { userId, desc } = req.body;

  try {
    const replies = await replyToComment(postId, commentId, { userId, desc });
    res.status(200).json(replies);
  } catch (err) {
    console.error("💥 Error adding reply:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// deleteReplyFromComment

export const deleteReplyFromCommentController = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    console.log("🔻 Deleting reply", { postId, commentId, replyId });

    const updatedReplies = await deleteReplyFromComment(
      postId,
      commentId,
      replyId
    );
    res.status(200).json({
      message: "Reply deleted successfully",
      replies: updatedReplies,
    });
  } catch (error) {
    console.error("💥 Error deleting reply:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//likeDislikeReply

export const likeDislikeReplyController = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.params;
    const { userId } = req.body;

    const likes = await likeReply(postId, commentId, replyId, userId);
    res.status(200).json({ message: "Reply like status updated", likes });
  } catch (error) {
    console.error("💥 Fehler beim Liken der Reply:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//getPostsByUserId

import { getPostsByUserId } from "../services/post.service.js";

export const getUserPostsController = async (req, res) => {
  try {
    const posts = await getPostsByUserId(req.params.userId);
    res.status(200).json({ posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};
