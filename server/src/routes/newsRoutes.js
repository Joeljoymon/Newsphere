const express = require("express");
const { protect } = require("../middlewares/auth");
const News = require("../models/News");

const router = express.Router();

// Like news
router.post("/:id/like", protect, async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return res.status(404).json({ message: "News not found" });

  news.dislikes = news.dislikes.filter(u => u.toString() !== req.user._id.toString());

  if (news.likes.includes(req.user._id)) {
    news.likes = news.likes.filter(u => u.toString() !== req.user._id.toString());
  } else {
    news.likes.push(req.user._id);
  }

  await news.save();
  res.json({ likes: news.likes.length, dislikes: news.dislikes.length });
});

// Dislike news
router.post("/:id/dislike", protect, async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return res.status(404).json({ message: "News not found" });

  news.likes = news.likes.filter(u => u.toString() !== req.user._id.toString());

  if (news.dislikes.includes(req.user._id)) {
    news.dislikes = news.dislikes.filter(u => u.toString() !== req.user._id.toString());
  } else {
    news.dislikes.push(req.user._id);
  }

  await news.save();
  res.json({ likes: news.likes.length, dislikes: news.dislikes.length });
});

// Comment on news
router.post("/:id/comment", protect, async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return res.status(404).json({ message: "News not found" });

  news.comments.push({ user: req.user._id, text: req.body.text });
  await news.save();

  res.json(news.comments);
});

router.get("/", async (req, res) => {
  const news = await News.find().sort({ createdAt: -1 });
  res.json(news);
});

router.get("/:id", async (req, res) => {
  const news = await News.findById(req.params.id).populate("comments.user", "username");
  if (!news) return res.status(404).json({ message: "Not found" });
  res.json(news);
});


module.exports = router;
