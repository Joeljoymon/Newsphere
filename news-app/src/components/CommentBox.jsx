import { useState } from "react";

export default function CommentBox({ newsId, comments, setComments }) {
  const [text, setText] = useState("");

  const postComment = async () => {
    const res = await fetch(`http://localhost:5000/api/news/${newsId}/comment`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setComments(data);
    setText("");
  };

  return (
    <div className="mt-4">
      <h3 className="font-bold">Comments</h3>
      <div className="space-y-2">
        {comments.map((c, idx) => (
          <div key={idx} className="p-2 border rounded bg-gray-50">
            <p>{c.text}</p>
            <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Write a comment..." className="flex-1 border p-2 rounded"/>
        <button onClick={postComment} className="bg-sky-500 text-white px-3 rounded">Send</button>
      </div>
    </div>
  );
}
