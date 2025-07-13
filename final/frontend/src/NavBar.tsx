import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Button } from 'antd';
import { useAuth } from './AuthContext';

const navItems = [
  { key: '/', label: '🏠 Home' },
  { key: '/dragdrop', label: '🎯 Drag & Drop' },
  { key: '/timed', label: '⏰ Timed Quiz' },
  { key: '/memory', label: '🧠 Memory' },
  { key: '/tracker', label: '🎮 Tracker' },
  { key: '/profile', label: '👤 Profile' },
];

export default function NavBar() {
  const location = useLocation();
  const { signout, user } = useAuth();

  return (
    <nav
      className="nav-bar"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem',
        minHeight: '50px',
      }}
    >
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        style={{
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          display: 'flex',
          gap: '2rem',
          flex: 1,
          lineHeight: '48px',
        }}
        items={navItems.map(item => ({
          key: item.key,
          label: (
            <NavLink to={item.key} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {item.label}
            </NavLink>
          ),
        }))}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>
          Welcome, <strong>{user}</strong>!
        </span>
        <Button type="primary" danger onClick={signout}>
          Signout
        </Button>
      </div>
    </nav>
  );
}
