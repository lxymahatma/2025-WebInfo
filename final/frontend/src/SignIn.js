import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const styles = {
  container: {
    fontFamily: "system-ui, sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f4ff",
  },
  card: {
    background: "#fff",
    padding: "2.5rem",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  heading: {
    fontSize: "1.75rem",
    fontWeight: 700,
    marginBottom: "1.5rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    margin: "0.5rem 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    marginTop: "1rem",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  link: {
    display: "block",
    marginTop: "1rem",
    fontSize: "0.95rem",
    color: "#4f46e5",
    textDecoration: "none",
  },
  error: {
    color: "#ef4444",
    fontSize: "0.875rem",
    marginTop: "0.5rem",
  },
};

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        
        // Redirect to main page or dashboard
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Sign In</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div style={styles.error}>{error}</div>}
        <button 
          style={styles.button} 
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <Link to="/signup" style={styles.link}>
          Don't have an account? Sign Up
        </Link>
      </div>
    </div>
  );
}