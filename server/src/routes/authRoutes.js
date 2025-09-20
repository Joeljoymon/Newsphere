const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const createTokenAndSetCookie = (res, user) => {
  const payload = { id: user._id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

  // set cookie (httpOnly). In production set secure: true
  res.cookie("token", token, {
    httpOnly: true,
    secure: false, // set true if https
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password });

    // set token cookie
    createTokenAndSetCookie(res, user);

    // return user basic info (no password)
    res.status(201).json({ user: { id: user._id, username: user.username, email: user.email, categories: user.categories } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    createTokenAndSetCookie(res, user);

    res.json({ user: { id: user._id, username: user.username, email: user.email, categories: user.categories } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// logout — clear cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });
  res.json({ message: "Logged out" });
});

module.exports = router;
