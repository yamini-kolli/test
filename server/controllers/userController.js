import userModel from "../models/userModel.js";

import jwt from 'jsonwebtoken';

// 🔑 Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const newUser = await userModel.create({ name, email, password });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log("Register Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 🔐 Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user || user.password !== password) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log("Login Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// 🧾 Get user credits
export const userCredits = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    console.log("Credits Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ⏳ Restore +2 credits after 24 hours
export const restoreCredits = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.lastCreditUsedTime) {
      return res.json({ success: false, message: "Not eligible to restore credits yet" });
    }

    const now = new Date();
    const lastUsed = new Date(user.lastCreditUsedTime);
    const diffHours = (now - lastUsed) / (1000 * 60 * 60);

    if (diffHours >= 24) {
      user.creditBalance += 2;
      user.lastCreditUsedTime = null;
      await user.save();
      return res.json({ success: true, credits: user.creditBalance });
    } else {
      return res.json({
        success: false,
        message: `You can restore credits after ${Math.ceil(24 - diffHours)} hour(s).`
      });
    }
  } catch (error) {
    console.log("Restore Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};
