import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function SignUp(): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = (): void => {
    if (username.trim() && email.trim() && password.trim()) {
      // In a real app, this would send to backend
      login(username);
      navigate('/');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-heading">Sign Up</h2>
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
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
        <button className="auth-button" onClick={handleSignUp}>
          Sign Up
        </button>
        <Link to="/signin" className="auth-link">
          Already have an account? Sign In
        </Link>
      </div>
    </div>
  );
}
