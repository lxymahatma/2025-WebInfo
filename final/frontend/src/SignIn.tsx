import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function SignIn(): React.JSX.Element {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = (): void => {
    if (username.trim()) {
      login(username);
      navigate('/');
    } else {
      alert('Please enter a username');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-heading">Sign In</h2>
        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="auth-button" onClick={handleSignIn}>
          Sign In
        </button>
        <Link to="/signup" className="auth-link">
          Don't have an account? Sign Up
        </Link>
      </div>
    </div>
  );
}
