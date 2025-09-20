import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ALL_CATS = ["sports", "finance", "politics", "entertainment", "technology"];

export default function PreferencesPage() {
  const { user, setUser } = useAuth();
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 🚀 If user already has preferences → skip page
    if (user?.categories && user.categories.length > 0) {
      navigate("/");
    }
  }, [user, navigate]);

  const toggle = (c) => {
    setSelected((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const submit = async () => {
    const res = await fetch("http://localhost:5000/api/user/preferences", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories: selected }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Error saving preferences");
      return;
    }

    const data = await res.json();

  // ✅ Update frontend user state with new categories
  setUser({ ...user, categories: data.categories });

  // 🚀 Redirect to home
  navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-lg">
        <h2 className="text-xl font-bold text-sky-600 mb-4">
          Choose your interests
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {ALL_CATS.map((c) => (
            <button
              key={c}
              onClick={() => toggle(c)}
              className={`p-3 rounded ${
                selected.includes(c)
                  ? "bg-sky-500 text-white"
                  : "border bg-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={submit}
            disabled={selected.length === 0}
            className="bg-sky-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
