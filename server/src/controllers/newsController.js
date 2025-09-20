const News = require("../models/News");

// Like news
exports.likeNews = async (req, res) => {
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
};

// Dislike news
exports.dislikeNews = async (req, res) => {
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
};

// Comment on news
exports.commentNews = async (req, res) => {
  const news = await News.findById(req.params.id);
  if (!news) return res.status(404).json({ message: "News not found" });

  news.comments.push({ user: req.user._id, text: req.body.text });
  await news.save();

  res.json(news.comments);
};
