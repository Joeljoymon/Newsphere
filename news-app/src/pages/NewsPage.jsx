import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import CommentBox from "../components/CommentBox";

export default function NewsPage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await api.get(`/news/${id}`);
        setNews(data);
        setComments(data.comments || []);
      } catch (err) {
        console.error("Error fetching news:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [id]);

  const handleLike = async () => {
    try {
      const data = await api.post(`/news/${id}/like`);
      setNews({ ...news, likes: Array(data.likes).fill(""), dislikes: Array(data.dislikes).fill("") });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDislike = async () => {
    try {
      const data = await api.post(`/news/${id}/dislike`);
      setNews({ ...news, likes: Array(data.likes).fill(""), dislikes: Array(data.dislikes).fill("") });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  if (loading) {
    return <div className="p-6 text-sky-600">Loading article...</div>;
  }

  if (!news) {
    return <div className="p-6 text-red-600">News not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-sky-700">{news.title}</h1>
      <p className="text-gray-500 text-sm">{news.category}</p>
      <p className="mt-4 text-gray-700">{news.content}</p>

      {/* Like / Dislike / Share */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleLike}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          👍 {news.likes?.length || 0}
        </button>
        <button
          onClick={handleDislike}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          👎 {news.dislikes?.length || 0}
        </button>
        <button
          onClick={handleShare}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          🔗 Share
        </button>
      </div>

      {/* Comments */}
      <CommentBox
        newsId={id}
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
}
