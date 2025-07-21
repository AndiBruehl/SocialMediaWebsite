import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

export const createPost = async (body) => {
  try {
    const newPost = new postModel(body);
    await newPost.save();
    return newPost;
  } catch (error) {
    console.error("Error creating post:", error.message);
    throw error;
  }
};

export const getPost = async (params) => {
  try {
    const post = await postModel.findById(params.id);
    return post;
  } catch (error) {
    console.error("Error fetching post:", error.message);
    throw error;
  }
};

export const getTimelinePosts = async (params) => {
  try {
    const currentUser = await userModel.findById(params.userId); // ← FIX HIER

    const userPosts = await postModel.find({ userId: currentUser._id });

    const timelinePosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return postModel.find({ userId: friendId });
      })
    );

    return userPosts.concat(...timelinePosts); // ← auch FIX: ...spread
  } catch (error) {
    console.error("❌ Error fetching timeline posts:", error.message);
    throw error;
  }
};

export const updatePost = async (params, body) => {
  try {
    const updatedPost = await postModel.findById(params.id);
    if (updatedPost.userId === body.userId) {
      await postModel.updateOne(
        { _id: params.id },
        {
          $set: body,
        },
        {
          new: true,
        }
      );
      return updatedPost;
    } else {
      throw new Error("You can only update your own posts");
    }
  } catch (error) {
    console.error("Error updating post:", error.message);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const deletedPost = await postModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      throw new Error("Post not found");
    }
    return deletedPost;
  } catch (error) {
    console.error("Error deleting post:", error.message);
    throw error;
  }
};

export const likeDislikePost = async (params, body) => {
  try {
    const post = await postModel.findById(params.id);
    if (!post.likes.includes(body.userId)) {
      await post.updateOne({
        $push: { likes: body.userId },
      });
    } else {
      await post.updateOne({
        $pull: { likes: body.userId },
      });
    }

    return post;
  } catch (error) {
    console.error("Error liking/unliking post:", error.message);
    throw error;
  }
};

// Add comment
export const addCommentToPost = async ({ postId, userId, desc }) => {
  const post = await postModel.findById(postId);
  if (!post) throw new Error("Post not found");

  post.comments.unshift({ userId, desc });
  await post.save();
  return post.comments;
};

// Delete comment
export const deleteCommentFromPost = async ({ postId, commentId }) => {
  const post = await postModel.findById(postId);
  if (!post) throw new Error("Post not found");

  post.comments = post.comments.filter(
    (comment) => comment._id.toString() !== commentId
  );
  await post.save();
  return post.comments;
};

// reply to comment
export const replyToComment = async (postId, commentId, { userId, desc }) => {
  const post = await postModel.findById(postId);
  if (!post) {
    console.error("❌ Post nicht gefunden:", postId);
    throw new Error("Post not found");
  }

  const comment = post.comments.find(
    (c) => c._id.toString() === commentId.toString()
  );
  if (!comment) {
    console.error("❌ Kommentar nicht gefunden:", commentId);
    throw new Error("Comment not found");
  }

  comment.replies.push({
    userId,
    desc: desc,
    createdAt: new Date(),
  });

  await post.save();
  return comment.replies;
};

// delete reply from comment
export const deleteReplyFromComment = async (postId, commentId, replyId) => {
  const post = await postModel.findById(postId);
  if (!post) throw new Error("Post not found");

  const comment = post.comments.find((c) => c._id.toString() === commentId);
  if (!comment) throw new Error("Comment not found");

  const replyIndex = comment.replies.findIndex(
    (r) => r._id.toString() === replyId
  );
  if (replyIndex === -1) throw new Error("Reply not found");

  comment.replies.splice(replyIndex, 1);
  await post.save();

  return comment.replies;
};

//like reply

export const likeReply = async (postId, commentId, replyId, userId) => {
  const post = await postModel.findById(postId);
  if (!post) throw new Error("Post not found");

  const comment = post.comments.find((c) => c._id.toString() === commentId);
  if (!comment) throw new Error("Comment not found");

  const reply = comment.replies.find((r) => r._id.toString() === replyId);
  if (!reply) throw new Error("Reply not found");

  const liked = reply.likes.includes(userId);

  if (liked) {
    // Already liked → remove
    reply.likes = reply.likes.filter((id) => id.toString() !== userId);
  } else {
    // Not liked yet → add
    reply.likes.push(userId);
  }

  await post.save();
  return reply.likes;
};

export const getPostsByUserId = async (userId) => {
  try {
    const posts = await postModel.find({ userId });
    return posts;
  } catch (error) {
    console.error("Error fetching user's posts:", error.message);
    throw error;
  }
};
