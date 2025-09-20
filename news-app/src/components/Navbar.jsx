import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-sky-600 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/" className="font-bold">NewsSphere</Link>
        <Link to="/trending">Trending</Link>
      </div>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/profile">{user.username}</Link>
            <button
              onClick={onLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
