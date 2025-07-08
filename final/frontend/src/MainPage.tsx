import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function MainPage(): JSX.Element {
  const { user, logout } = useAuth();

  return (
    <div className="main-page-container">
      <h1 className="main-page-title">🎮 Game Platform</h1>
      {user ? (
        <>
          <p>
            Welcome, <strong>{user}</strong>!
          </p>

          <Link to="/dragdrop" className="main-page-link">
            Play Drag & Drop
          </Link>
          <Link to="/timed" className="main-page-link">
            Play Timed Quiz
          </Link>

          <br />

          <button className="main-page-logout-btn" onClick={logout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/signup" className="main-page-link">
            Sign Up
          </Link>
          <Link to="/signin" className="main-page-link">
            Sign In
          </Link>
        </>
      )}
    </div>
  );
}
