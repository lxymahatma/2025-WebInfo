import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from 'antd';

import { useAuth } from './auth';

const navItems = [
  { key: '/', label: '🏠 Home' },
  { key: '/dragdrop', label: '🎯 Drag & Drop' },
  { key: '/timed', label: '⏰ Timed Quiz' },
  { key: '/memory', label: '🧠 Memory' },
  { key: '/tracker', label: '🎮 Tracker' },
  { key: '/profile', label: '👤 Profile' },
];

export const NavBar = () => {
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
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-[999] pointer-events-none">
          <div className="bg-cyan-600/90 text-white text-sm font-medium px-4 py-2 rounded-b-lg shadow-lg animate-pulse">
            Move cursor to top for navigation
          </div>
        </div>
      )}

      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-8 py-5 bg-cyan-600 text-white text-lg font-semibold shadow-sm transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center flex-1 gap-2 justify-evenly w-full">
          {navItems.map(item => (
            <NavLink
              key={item.key}
              to={item.key}
              className={({ isActive }) =>
                `inline-block flex-1 min-w-[100px] max-w-[150px] px-3 py-3 text-center bg-white text-cyan-600 font-bold rounded-lg no-underline whitespace-nowrap transition-all duration-200 hover:bg-yellow-400 hover:text-cyan-600 focus:outline-none ${
                  isActive ? 'bg-yellow-400 text-cyan-600 shadow-lg shadow-yellow-200' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-4">
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
};
