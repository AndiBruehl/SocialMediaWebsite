import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";

//Update user

export const updateUser = async (userId, updateData) => {
  try {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    const { password, ...data } = updatedUser._doc;
    return data;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new Error(error.message);
  }
};

//Delete user

export const deleteUser = async (userId) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    return { message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user:", error.message);
    throw new Error(error.message);
  }
};

// Get user by ID

export const getUser = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const { password, ...data } = user._doc;
    return data;
  } catch (error) {
    console.error("Error fetching user:", error.message);
    throw new Error(error.message);
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const users = await UserModel.find();
    const usersWithoutPassword = users.map((user) => {
      const { password, ...data } = user._doc;
      return data;
    });
    return usersWithoutPassword;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw new Error(error.message);
  }
};

// follow user

export const followUser = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) {
    throw new Error("You cannot follow yourself");
  }

  try {
    const targetUser = await UserModel.findById(targetUserId);
    const currentUser = await UserModel.findById(currentUserId);

    if (!targetUser.followers.includes(currentUserId)) {
      await targetUser.updateOne({ $push: { followers: currentUserId } });
      await currentUser.updateOne({ $push: { following: targetUserId } });

      return { message: "User followed successfully" };
    } else {
      throw new Error("You are already following this user");
    }
  } catch (error) {
    console.error("Error following user:", error.message);
    throw new Error(error.message);
  }
};

// unfollow user

export const unfollowUser = async (currentUserId, targetUserId) => {
  if (currentUserId === targetUserId) {
    throw new Error("You cannot unfollow yourself");
  }

  try {
    const targetUser = await UserModel.findById(targetUserId);
    const currentUser = await UserModel.findById(currentUserId);

    if (targetUser.followers.includes(currentUserId)) {
      await targetUser.updateOne({ $pull: { followers: currentUserId } });
      await currentUser.updateOne({ $pull: { following: targetUserId } });

      return { message: "User unfollowed successfully" };
    } else {
      throw new Error("You are not following this user");
    }
  } catch (error) {
    console.error("Error unfollowing user:", error.message);
    throw new Error(error.message);
  }
};

// Get followers of a user
export const getFollowers = async (userId) => {
  try {
    const user = await User;
    Model.findById(userId).populate("followers", "-password");
    if (!user) {
      throw new Error("User not found");
    }
    return user.followers;
  } catch (error) {
    console.error("Error fetching followers:", error.message);
    throw new Error(error.message);
  }
};

// Get following of a user
export const getFollowing = async (userId) => {
  try {
    const user = await UserModel.findById(userId).populate(
      "following",
      "-password"
    );
    if (!user) {
      throw new Error("User not found");
    }
    return user.following;
  } catch (error) {
    console.error("Error fetching following:", error.message);
    throw new Error(error.message);
  }
};
