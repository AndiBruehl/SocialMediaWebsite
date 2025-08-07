import { registerUser, loginUser } from "../services/auth.service.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

//Register

export const register = async (req, res) => {
  try {
    const newUser = await registerUser(req.body);

    const { password, ...userData } = newUser._doc;
    res
      .status(201)
      .json({ user: userData, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Login

export const login = async (req, res) => {
  try {
    const user = await loginUser(req.body);

    console.log("👤 user._id:", user._id); // <-- Hinzufügen!

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    if (error.message === "Invalid password") {
      return res.status(401).json({ message: "Invalid password" });
    }
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
