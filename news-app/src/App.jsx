import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NewsPage from "./pages/NewsPage.jsx";
import PreferencesPage from "./pages/PreferencesPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TrendingPage from "./pages/TrendingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useAuth } from "./context/AuthContext";
function App() {
   const { user, setUser, logout } = useAuth();
  useEffect(() => {
    console.log("✅ checking session...");
    fetch("http://localhost:5000/api/user/me", { credentials: "include" })
      .then((res) => {
        console.log("📡 /api/user/me status:", res.status);
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        console.log("✅ /api/user/me data:", data);
        setUser(data.user);
      })
      .catch((err) => {
        console.error("❌ /api/user/me fetch error:", err);
        setUser(null);
      });
  }, []);
  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };
  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-4xl text-white">
        {" "}
        LOADING...{" "}
      </div>
    );
  }
  return (
    <Router>
      {" "}
      <Routes>
        {" "}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage onLogin={setUser} />}
        />{" "}
        <Route
          path="/register"
          element={
            user ? <Navigate to="/" /> : <RegisterPage onRegister={setUser} />
          }
        />{" "}
        <Route
          path="/preferences"
          element={
            user ? (
              user.categories?.length === 0 ? (
                <PreferencesPage user={user} setUser={setUser} /> // ✅ pass setUser
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            user ? (
              user.categories?.length === 0 ? (
                <Navigate to="/preferences" />
              ) : (
                <HomePage user={user} onLogout={handleLogout} />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/news/:id"
          element={user ? <NewsPage /> : <Navigate to="/login" />}
        />{" "}
        <Route
          path="/trending"
          element={user ? <TrendingPage /> : <Navigate to="/login" />}
        />{" "}
        <Route
          path="/profile"
          element={
            user ? <ProfilePage user={user} /> : <Navigate to="/login" />
          }
        />{" "}
      </Routes>{" "}
    </Router>
  );
}
export default App;
