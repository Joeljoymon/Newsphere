const User = require("../models/User");

// @desc Get logged in user
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

// @desc Update preferences
exports.updatePreferences = async (req, res) => {
  const { categories } = req.body;
  if (!Array.isArray(categories)) return res.status(400).json({ message: "Categories must be array" });

  req.user.categories = categories;
  await req.user.save();

  res.json({ categories: req.user.categories });
};

// @desc Change password
exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return res.status(400).json({ message: "Missing fields" });

  const isMatch = await req.user.matchPassword(oldPassword);
  if (!isMatch) return res.status(401).json({ message: "Old password incorrect" });

  req.user.password = newPassword; // hashed by pre-save hook
  await req.user.save();

  res.json({ message: "Password updated successfully" });
};

// @desc Upload avatar
exports.uploadAvatar = async (req, res) => {
  req.user.avatar = `/uploads/${req.file.filename}`;
  await req.user.save();
  res.json({ avatar: req.user.avatar });
};
