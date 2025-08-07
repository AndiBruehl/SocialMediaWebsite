import {
  deleteUser,
  followUser,
  getUser,
  unfollowUser,
  updateUser,
  getAllUsers,
  newUser,
} from "../services/user.service.js";

import User from "../models/user.model.js";

export const updateUserController = async (req, res) => {
  try {
    const userId = req.params.id;

    const updateData = {
      username: req.body.username,
      desc: req.body.desc,
      location: req.body.location,
      from: req.body.from,
      relationship: req.body.relationship,
      updatedAt: Date.now(),
    };

    if (req.files?.profilePicture?.[0]) {
      const profileFile = req.files.profilePicture[0];
      updateData.profilePicture = `/images/profile/${profileFile.filename}`;
    }

    if (req.files?.coverPicture?.[0]) {
      const coverFile = req.files.coverPicture[0];
      updateData.coverPicture = `/images/cover/${coverFile.filename}`;
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") delete updateData[key];
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profil erfolgreich aktualisiert",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update-Fehler:", err);
    res.status(500).json({ message: "Fehler beim Update" });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.params.id;
    const filename = req.file.filename;
    const newPath = `/images/profile/${filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: newPath },
      { new: true }
    );

    res.status(200).json({
      message: "Profile picture updated",
      path: newPath,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile picture", error });
  }
};

export const updateCoverPic = async (req, res) => {
  try {
    const userId = req.params.id;
    const filename = req.file.filename;
    const newPath = `/images/cover/${filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { coverPicture: newPath },
      { new: true }
    );

    res.status(200).json({
      message: "Cover picture updated",
      path: newPath,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating cover picture", error });
  }
};

// ✅ Benutzer löschen
export const deleteUserController = async (req, res) => {
  const userId = req.params.id;

  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await deleteUser(userId);
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

// ✅ Benutzer abrufen
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

// ✅ Alle Benutzer abrufen
export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Benutzer folgen
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

// ✅ Benutzer entfolgen
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

// ✅ Neuen Benutzer erstellen
export const createUserController = async (req, res) => {
  try {
    const created = await newUser(req.body);

    res.status(201).json({
      message: "User created successfully",
      newUser: created,
    });
  } catch (error) {
    console.error("Error creating User:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
