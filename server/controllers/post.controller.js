import {
  createPost,
  deletePost,
  getPost,
  getTimelinePosts,
  likeDislikePost,
  updatePost,
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
    const timelinePosts = await getTimelinePosts(req.body);

    res.status(200).json({
      message: "Timeline Posts fetched successfully",
      timelinePosts,
    });
  } catch (error) {
    console.error("Error retrieving posts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
