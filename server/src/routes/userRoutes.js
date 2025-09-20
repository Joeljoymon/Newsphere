const express = require("express");
const { protect } = require("../middlewares/auth");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // simple local storage

// Get profile
router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user });
});

// Update preferences
router.post("/preferences", protect, async (req, res) => {
  const { categories } = req.body;
  if (!Array.isArray(categories)) return res.status(400).json({ message: "Categories must be array" });
  req.user.categories = categories;
  await req.user.save();
  res.json({ categories: req.user.categories });
});

// Change password
router.post("/change-password", protect, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ message: "Missing fields" });

  const isMatch = await req.user.matchPassword(oldPassword);
  if (!isMatch) return res.status(401).json({ message: "Old password incorrect" });

  req.user.password = newPassword; // pre-save hook re-hashes
  await req.user.save();
  res.json({ message: "Password updated successfully" });
});

// Upload avatar (basic version — later move to cloud storage)

router.post("/upload-avatar", protect, upload.single("avatar"), async (req, res) => {
  const avatarUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  req.user.avatar = avatarUrl;
  await req.user.save();
  res.json({ avatar: avatarUrl });
});

module.exports = router;
