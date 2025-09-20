import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Get profile after login
      const profile = await fetch("http://localhost:5000/api/user/me", {
        credentials: "include",
      }).then((r) => r.json());

      onLogin && onLogin(profile.user);
      navigate("/"); // redirect to home
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow">
        <h2 className="text-2xl font-bold text-sky-600 mb-4">Login</h2>
        <form onSubmit={submit} className="space-y-3">
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* New User Redirect */}
        <p className="text-center mt-4 text-sm text-gray-600">
          New user?{" "}
          <Link to="/register" className="text-sky-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
