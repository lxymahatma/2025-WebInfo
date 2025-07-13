import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { useAuth } from './AuthContext';

import './NavBar.css';

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
  const [isVisible, setIsVisible] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Show navbar when mouse is in the top 80px of the screen
      if (e.clientY <= 80) {
        setIsVisible(true);
      } else if (e.clientY > 150) {
        // Only hide when mouse is below 150px to prevent flickering
        setIsVisible(false);
      }
    };

    // Add event listener to the document
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Show navigation hint on non-homepage when navbar is hidden */}
      {!isHomePage && !isVisible && (
        <div className="nav-hint">
          <div className="nav-hint-content">Move cursor to top for navigation</div>
        </div>
      )}

      <nav className={`nav-bar ${isVisible ? 'nav-visible' : 'nav-hidden'}`}>
        <div className="nav-menu">
          {navItems.map(item => (
            <NavLink key={item.key} to={item.key} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="nav-user-section">
          <span>
            Welcome, <strong>{user}</strong>!
          </span>
          <Button type="primary" danger onClick={signout}>
            Signout
          </Button>
        </div>
      </nav>
    </>
  );
}
