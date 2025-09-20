import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import NewsCard from "../components/NewsCard";
import api from "../utils/api"; // ✅ centralized API helper

export default function HomePage() {
  const [news, setNews] = useState([]);
  const { user, logout } = useAuth();

 useEffect(() => {
  api.get("/news")
    .then((data) => {
      console.log("Fetched news:", data); // ✅ add debug
      setNews(data);
    })
    .catch((err) => {
      console.error("Error fetching news:", err);
      setNews([]);
    });
}, []);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={logout} />

      <main className="p-4 md:p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {news.length === 0 ? (
          <p className="text-gray-500">No news available.</p>
        ) : (
          news.map((n) => <NewsCard key={n._id} news={n} />)
        )}
      </main>
    </div>
  );
}
