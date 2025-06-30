import React from "react";
import { NavLink } from "react-router-dom";

const navStyles = {
  nav: {
    background: "#0080a8",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    padding: "1rem 0",
    marginBottom: "2rem",
    fontWeight: 600,
    fontSize: "1.1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  link: (isActive) => ({
    background: isActive ? "#ffd700" : "#fff",
    color: "#0080a8",
    border: "none",
    borderRadius: "8px",
    padding: "0.5rem 1.2rem",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: isActive ? "0 2px 8px #ffe066" : "none",
    textDecoration: "none",
    transition: "background 0.2s, color 0.2s",
    outline: "none",
  }),
};

export default function NavBar() {
  return (
    <nav style={navStyles.nav}>
      <NavLink to="/dragdrop" style={({ isActive }) => navStyles.link(isActive)}>
        Drag & Drop Game
      </NavLink>
      <NavLink to="/timed" style={({ isActive }) => navStyles.link(isActive)}>
        Timed Question Game
      </NavLink>
    </nav>
  );
}
