export default function NewsCard({ news }) {
  return (
    <div className="border rounded-lg p-4 shadow bg-white">
      <h3 className="text-lg font-bold">{news.title}</h3>
      <p className="text-sm text-gray-600">{news.category}</p>
      <p className="mt-2 text-gray-700">{news.content.slice(0, 100)}...</p>
      <a href={`/news/${news._id}`} className="text-sky-600 font-bold mt-2 inline-block">
        Read More →
      </a>
      <div className="flex gap-3 text-gray-500 text-sm mt-2">
        <span>👍 {news.likes?.length || 0}</span>
        <span>👎 {news.dislikes?.length || 0}</span>
      </div>
    </div>
  );
}
