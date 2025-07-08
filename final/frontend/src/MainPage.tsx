// MainPage.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const styles = {
  container: {
    fontFamily: "system-ui, sans-serif",
    textAlign: "center",
    padding: "3rem",
  },
  title: { fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" },
  link: {
    display: "inline-block",
    margin: "1rem",
    padding: "0.8rem 1.6rem",
    backgroundColor: "#4f46e5",
    color: "#fff",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 500,
  },
  logoutBtn: {
    background: "#e74c3c",
    border: "none",
    padding: "0.5rem 1.2rem",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },
};

export default function MainPage() {
  const { user, logout } = useAuth();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎮 Game Platform</h1>
      {user ? (
        <>
          <p>Welcome, <strong>{user}</strong>!</p>
          <Link to="/dragdrop" style={styles.link}>Play Drag & Drop</Link>
          <Link to="/timed" style={styles.link}>Play Timed Quiz</Link>
          <br />
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/signup" style={styles.link}>Sign Up</Link>
          <Link to="/signin" style={styles.link}>Sign In</Link>
        </>
      )}
    </div>
  );
}
