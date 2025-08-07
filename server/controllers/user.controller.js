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

// 📍 Benutzerprofil aktualisieren (inkl. Bild-Upload)
export const updateUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("📨 PUT /users/:id aufgerufen für:", userId);
    console.log("🧾 req.body:", req.body);
    console.log("🖼️ empfangene Dateien:", req.files);

    const updateData = {
      username: req.body.username,
      desc: req.body.desc,
      location: req.body.location,
      from: req.body.from,
      relationship: req.body.relationship,
      updatedAt: Date.now(),
    };

    // 📷 Bilder korrekt verarbeiten und Pfade setzen
    if (req.files?.profilePicture?.[0]) {
      const profileFile = req.files.profilePicture[0];
      updateData.profilePicture = `/images/profile/${profileFile.filename}`;
      console.log("✅ Profilbild gespeichert als:", updateData.profilePicture);
    }

    if (req.files?.coverPicture?.[0]) {
      const coverFile = req.files.coverPicture[0];
      updateData.coverPicture = `/images/cover/${coverFile.filename}`;
      console.log("✅ Coverbild gespeichert als:", updateData.coverPicture);
    }

    // ❌ Leere Felder entfernen
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") delete updateData[key];
    });

    console.log("🛠️ Update-Daten für User:", updateData);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      console.warn("❌ Kein Benutzer mit ID gefunden:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Benutzer aktualisiert:", updatedUser);

    res.status(200).json({
      message: "Profil erfolgreich aktualisiert",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ Fehler beim Aktualisieren:", err);
    if (err.code === 11000 && err.keyPattern?.username) {
      return res
        .status(400)
        .json({ message: "Der Benutzername ist bereits vergeben." });
    }
    res.status(500).json({ message: "Serverfehler beim Aktualisieren" });
  }
};

// ✅ Nur Profilbild aktualisieren
export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.params.id;
    const filePath = `/images/profile/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { profilePicture: filePath, updatedAt: Date.now() } },
      { new: true }
    );

    res.status(200).json({
      message: "Profilbild erfolgreich aktualisiert",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Profilbilds:", error);
    res.status(500).json({ message: "Fehler beim Upload", error });
  }
};

// ✅ Nur Coverbild aktualisieren
export const updateCoverPic = async (req, res) => {
  try {
    const userId = req.params.id;
    const filePath = `/images/cover/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { coverPicture: filePath, updatedAt: Date.now() } },
      { new: true }
    );

    res.status(200).json({
      message: "Coverbild erfolgreich aktualisiert",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Coverbilds:", error);
    res.status(500).json({ message: "Fehler beim Upload", error });
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
