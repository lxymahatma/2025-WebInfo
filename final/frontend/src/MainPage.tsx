import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function MainPage(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <div className="main-page-container">
      <h1 className="main-page-title">🎮 Game Platform</h1>
      {user ? (
        <>
          <p>
            Welcome, <strong>{user}</strong>!
          </p>
          <p>Choose a game to play:</p>

          <div className="game-links">
            <Link to="/dragdrop" className="main-page-link">
              🎯 Play Drag & Drop
            </Link>
            <Link to="/timed" className="main-page-link">
              ⏰ Play Timed Quiz
            </Link>
            <Link to="/memory" className="main-page-link">
              🧠 Play Memory Card Game
            </Link>
            <Link to="/profile" className="main-page-link">
              👤 View Profile
            </Link>
          </div>
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
