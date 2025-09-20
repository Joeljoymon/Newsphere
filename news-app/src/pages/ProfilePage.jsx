import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const updatePassword = async () => {
    const res = await fetch("http://localhost:5000/api/user/change-password", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const data = await res.json();
    alert(data.message || "Error");
    setOldPassword("");
    setNewPassword("");
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("http://localhost:5000/api/user/upload-avatar", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await res.json();
    setUser({ ...user, avatar: data.avatar });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-3xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b pb-6">
          <div className="relative">
            <img
              src={user.avatar || "https://via.placeholder.com/100"}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-sky-500"
            />
            <label className="absolute bottom-0 right-0 bg-sky-500 text-white text-xs px-2 py-1 rounded cursor-pointer">
              Change
              <input
                type="file"
                onChange={uploadAvatar}
                className="hidden"
              />
            </label>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-sky-600">{user.username}</h2>
            <p className="text-gray-600">{user.email}</p>
            <div className="mt-3">
              <span className="text-sm font-semibold text-gray-700">Preferences:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.categories?.length > 0 ? (
                  user.categories.map((c, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm"
                    >
                      {c}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No preferences set</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mt-6">
          <h3 className="text-lg font-bold text-sky-600 mb-3">Change Password</h3>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              onClick={updatePassword}
              className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600 transition"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
