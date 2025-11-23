// routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import RefreshToken from "../models/RefreshToken.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const ACCESS_SECRET = process.env.ACT_SECRET;
  const REFRESH_SECRET = process.env.REF_SECRET;

  const { refresh_token } = req.body;
  if (!refresh_token)
    return res.status(400).json({ message: "No refresh token" });

  try {
    // Verify JWT structure + signature
    const payload = jwt.verify(refresh_token, REFRESH_SECRET);
    console.log("Payload:", payload);

    // Check in database if token exists and not expired
    const storedToken = await RefreshToken.findOne({
      token: refresh_token,
      userId: payload.id,
    });

    if (!storedToken)
      return res.status(401).json({ message: "Refresh token not recognized" });

    if (new Date() > storedToken.expiresAt)
      return res.status(401).json({ message: "Refresh token expired" });

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { id: payload.id, email: payload.email },
      ACCESS_SECRET,
      {
        expiresIn: "2m",
      }
    );

    const newRefreshToken = jwt.sign(
      { id: payload.id, email: payload.email },
      REFRESH_SECRET,
      {
        expiresIn: "30d",
      }
    );

    // Update DB with new token
    storedToken.token = newRefreshToken;
    storedToken.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await storedToken.save();

    return res.json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

export default router;
