// routes/auth.js
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({
      message: "User created",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email }, process.env.ACT_SECRET, {
      expiresIn: "2m",
    });

    // Check in database if token exists and not expired
    const storedToken = await RefreshToken.findOne({
      userId: user._id,
    });
    const newRefToken = jwt.sign(
      { id: user._id, email },
      process.env.REF_SECRET,
      {
        expiresIn: "30d",
      }
    );

    const expirationDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    if (storedToken) {
      storedToken.expiresAt = expirationDate;
      storedToken.token = newRefToken;
      await storedToken.save();
    } else {
      await RefreshToken.create({
        token: newRefToken,
        userId: user._id,
        deviceInfo: req.headers["user-agent"],
        expiresAt: expirationDate,
      });
    }

    res.json({
      access_token: token,
      refresh_token: newRefToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
