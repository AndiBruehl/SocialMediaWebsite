import postModel from "../models/post.model.js";
import userModel from "../models/user.model.js";

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

export const getTimelinePosts = async (body) => {
  try {
    const currentUser = await userModel.findById(body.userId);
    const userPosts = await postModel.find({ userId: currentUser._id });
    const timelinePosts = await Promise.all(
      currentUser.followers.map((friendId) => {
        return postModel.find({ userId: friendId });
      })
    );
    return userPosts.concat({ ...timelinePosts });
  } catch (error) {
    console.error("Error fetching posts:", error.message);
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
