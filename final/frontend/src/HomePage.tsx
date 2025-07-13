import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

export default function HomePage(): React.JSX.Element {
  const { user, logout } = useAuth();

  return (
    <div className="homepage-container">
      {user && (
        <div className="homepage-header">
          <div className="homepage-user-info">
            <span>Welcome back, <strong>{user}</strong>!</span>
          </div>
          <Button 
            type="primary" 
            danger 
            onClick={logout}
            className="homepage-logout-btn"
          >
            Logout
          </Button>
        </div>
      )}
      
      <div className="homepage-content">
        <div className="homepage-hero">
          <Title level={1} className="homepage-title">🎮 Game Platform</Title>
          <Paragraph className="homepage-subtitle">
            Challenge yourself with our collection of exciting brain games
          </Paragraph>
        </div>
        
        {user ? (
          <>
            <div className="homepage-games-section">
              <Title level={2} className="section-title">Choose Your Game</Title>
              
              <div className="homepage-game-grid">
                <Link to="/dragdrop" className="homepage-game-card">
                  <div className="game-card-icon">🎯</div>
                  <div className="game-card-content">
                    <h3>Drag & Drop</h3>
                    <p>Test your coordination skills with interactive drag and drop challenges</p>
                  </div>
                </Link>
                
                <Link to="/timed" className="homepage-game-card">
                  <div className="game-card-icon">⏰</div>
                  <div className="game-card-content">
                    <h3>Timed Quiz</h3>
                    <p>Challenge your knowledge under pressure with time-based questions</p>
                  </div>
                </Link>
                
                <Link to="/memory" className="homepage-game-card">
                  <div className="game-card-icon">🧠</div>
                  <div className="game-card-content">
                    <h3>Memory Cards</h3>
                    <p>Train your memory with our classic card matching game</p>
                  </div>
                </Link>
                
                <Link to="/tracker" className="homepage-game-card">
                  <div className="game-card-icon">🎮</div>
                  <div className="game-card-content">
                    <h3>Game Tracker</h3>
                    <p>View your game statistics and track your progress</p>
                  </div>
                </Link>
                
                <Link to="/profile" className="homepage-game-card">
                  <div className="game-card-icon">👤</div>
                  <div className="game-card-content">
                    <h3>Profile</h3>
                    <p>Manage your account settings and view your achievements</p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="homepage-welcome-section">
              <Title level={2} className="section-title">Welcome to Game Platform!</Title>
              <Paragraph className="welcome-description">
                Discover our amazing collection of brain-training games designed to challenge and entertain you.
              </Paragraph>
              
              <div className="homepage-features">
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <h4>Drag & Drop Game</h4>
                  <p>Test your coordination skills</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">⏰</span>
                  <h4>Timed Quiz</h4>
                  <p>Challenge your knowledge under pressure</p>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🧠</span>
                  <h4>Memory Card Game</h4>
                  <p>Train your memory</p>
                </div>
              </div>
            </div>
            
            <div className="homepage-auth-section">
              <Title level={3} className="auth-title">Ready to Play?</Title>
              <div className="homepage-auth-buttons">
                <Link to="/signin">
                  <Button className="auth-button signin-button" size="large">
                    🔑 Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="auth-button signup-button" size="large">
                    📝 Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
