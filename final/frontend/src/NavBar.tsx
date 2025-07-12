import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu } from "antd";

const navItems = [
  { key: "/dragdrop", label: "Drag & Drop Game" },
  { key: "/timed", label: "Timed Question Game" },
  { key: "/memory", label: "Memory Card Game" },
  { key: "/profile", label: "Profile" }
];

export default function NavBar() {
  const location = useLocation();

  return (
    <nav className="nav-bar">
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{
          background: "transparent",
          border: "none",
          boxShadow: "none",
          display: "flex",
          gap: "2rem"
        }}
        items={navItems.map(item => ({
          key: item.key,
          label: (
            <NavLink
              to={item.key}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {item.label}
            </NavLink>
          ),
        }))}
      />
    </nav>
  );
}