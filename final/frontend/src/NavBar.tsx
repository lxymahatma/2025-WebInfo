import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar(): React.JSX.Element {
  return (
    <nav className="nav-bar">
      <NavLink to="/dragdrop" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        Drag & Drop Game
      </NavLink>
      <NavLink to="/timed" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        Timed Question Game
      </NavLink>
    </nav>
  );
}
