import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

export default function MainPage(): React.JSX.Element {
  const { user } = useAuth();

  return (
    <div className="main-page-container">
      <Title level={1} className="main-page-title">🎮 Game Platform</Title>
      
      {user ? (
        <>
          <div className="main-page-user-welcome">
            <Paragraph>
              Welcome back, <strong>{user}</strong>!
            </Paragraph>
            <Paragraph>Choose a game to play:</Paragraph>
          </div>

          <div className="game-links">
            <Link to="/dragdrop">
              <Button className="main-page-link" type="default" size="large">
                🎯 Play Drag & Drop
              </Button>
            </Link>
            <Link to="/timed">
              <Button className="main-page-link" type="default" size="large">
                ⏰ Play Timed Quiz
              </Button>
            </Link>
            <Link to="/memory">
              <Button className="main-page-link" type="default" size="large">
                🧠 Play Memory Card Game
              </Button>
            </Link>
            <Link to="/profile">
              <Button className="main-page-link" type="default" size="large">
                👤 View Profile
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="welcome-section">
            <Paragraph>Welcome to our amazing Game Platform!</Paragraph>
            <Paragraph>
              Please sign in or create an account to access our exciting games:
            </Paragraph>
            <ul>
              <li>🎯 Drag & Drop Game - Test your coordination skills</li>
              <li>⏰ Timed Quiz - Challenge your knowledge under pressure</li>
              <li>🧠 Memory Card Game - Train your memory</li>
            </ul>
          </div>
          
          <div className="auth-links">
            <Link to="/signin">
              <Button className="main-page-link" type="default" size="large">
                🔑 Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="main-page-link" type="default" size="large">
                📝 Sign Up
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
