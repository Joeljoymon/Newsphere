import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage({ onRegister }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Register failed");

      // ✅ get fresh profile
      const profile = await fetch("http://localhost:5000/api/user/me", {
        credentials: "include",
      }).then((r) => r.json());

      onRegister && onRegister({ ...profile.user, isNew: true });
      navigate("/preferences", { replace: true });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow">
        <h2 className="text-2xl font-bold text-sky-600 mb-4">Create account</h2>
        <form onSubmit={submit} className="space-y-3">
          <input
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
            className="w-full p-2 border rounded"
          />
          <input
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            type="email"
            className="w-full p-2 border rounded"
          />
          <input
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            type="password"
            className="w-full p-2 border rounded"
          />
          <button
            disabled={loading}
            className="w-full bg-sky-500 text-white py-2 rounded"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
