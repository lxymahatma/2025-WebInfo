import React from "react";
import { Link, useNavigate } from "react-router-dom";

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#4f46e5",
    color: "#fff",
    fontFamily: "system-ui, sans-serif",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: 700,
    textDecoration: "none",
    color: "#fff",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: 500,
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  navLinkHover: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  userInfo: {
    fontSize: "0.9rem",
    color: "#e0e7ff",
  },
  signOutButton: {
    backgroundColor: "transparent",
    border: "1px solid #fff",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 500,
    transition: "background-color 0.2s",
  },
  signOutButtonHover: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
};

export default function NavBar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleSignOut = () => {
    // Clear all stored user data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    
    // Redirect to sign in page
    navigate("/signin");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.leftSection}>
        <Link to="/" style={styles.logo}>
          Game Hub
        </Link>
        <div style={styles.navLinks}>
          <Link 
            to="/dragdrop" 
            style={styles.navLink}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.navLinkHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            Drag & Drop
          </Link>
          <Link 
            to="/timed" 
            style={styles.navLink}
            onMouseEnter={(e) => e.target.style.backgroundColor = styles.navLinkHover.backgroundColor}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            Timed Quiz
          </Link>
        </div>
      </div>
      
      <div style={styles.rightSection}>
        <span style={styles.userInfo}>
          Welcome, {username || "User"}!
        </span>
        <button 
          style={styles.signOutButton}
          onClick={handleSignOut}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.signOutButtonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}