import {
  deleteUser,
  followUser,
  getUser,
  unfollowUser,
  updateUser,
  getAllUsers,
} from "../services/user.service.js";

//updateUserController

export const updateUserController = async (req, res) => {
  const targetUserId = req.params.id;
  const senderUserId = req.body.userId;
  const senderIsAdmin = req.body.isAdmin;

  if (String(senderUserId) === String(targetUserId) || senderIsAdmin === true) {
    try {
      const updateData = { ...req.body };
      delete updateData.userId;
      delete updateData.isAdmin;

      const updatedUser = await updateUser(targetUserId, updateData);

      res.status(200).json({
        user: updatedUser,
        message: "User updated successfully",
      });
    } catch (error) {
      console.error("Error updating user:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  } else {
    res.status(403).json({
      message: "You are only allowed to update your own account.",
    });
  }
};

// deleteUserController

export const deleteUserController = async (req, res) => {
  const userId = req.params.id;

  if (req.user.id === req.params.id || req.user.isAdmin) {
    // Allow deletion if the user is deleting their own profile or is an admin
    try {
      const deletedUser = await deleteUser(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  } else {
    return res.status(403).json({
      message: "You can only delete your own Account.",
    });
  }
};

// getUserController

export const getUserController = async (req, res) => {
  try {
    const user = await getUser(req.params.id);

    res.status(200).json({
      userInfo: user,
      message: "User fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// getAllUsersController
export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// followUserController

export const followUserController = async (req, res) => {
  try {
    const followerId = req.body.userId;
    const targetId = req.params.id;

    const data = await followUser(followerId, targetId);

    res.status(200).json({
      message: "User followed successfully",
      data,
    });
  } catch (error) {
    console.error("Error following user:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// unfollowUserController

export const unfollowUserController = async (req, res) => {
  try {
    const followerId = req.body.userId;
    const targetId = req.params.id;

    const data = await unfollowUser(followerId, targetId);

    res.status(200).json({
      message: "User unfollowed successfully",
      data,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
