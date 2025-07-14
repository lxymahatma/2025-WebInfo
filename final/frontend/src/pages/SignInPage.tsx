import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

import './SignInPage.css';

export const SignInPage = (): React.JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { signin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSignIn = async (): Promise<void> => {
    try {
      const res = await fetch('http://localhost:3001/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        signin(data.username);
        alert('Login success!');
        navigate('/');
      } else {
        const error = await res.json();
        alert(error.message || 'Invalid credentials');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Sign In</h2>
          <form
            className="auth-form"
            onSubmit={e => {
              e.preventDefault();
              handleSignIn();
            }}
          >
            <div className="auth-input-group">
              <label className="auth-label">Username</label>
              <input
                className="auth-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="auth-input-group">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className="auth-submit-btn" type="submit">
              Sign In
            </button>
          </form>
          <div className="auth-link-section">
            <p className="auth-link-text">Don't have an account?</p>
            <Link to="/signup" className="auth-link">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
