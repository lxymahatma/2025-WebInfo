import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp(): React.JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignUp = (): void => {
    // In a real app, this would send to backend or localStorage
    alert(`Signed up with:\nEmail: ${email}\nUsername: ${username}`);
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
