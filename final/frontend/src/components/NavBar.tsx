import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { useAuth } from './auth';

const navItems = [
  { key: '/home', label: '🏠 Home' },
  { key: '/dragdrop', label: '🎯 Drag & Drop' },
  { key: '/timed', label: '⏰ Timed Quiz' },
  { key: '/memory', label: '🧠 Memory' },
  { key: '/tracker', label: '🎮 Tracker' },
  { key: '/profile', label: '👤 Profile' },
];

export const NavBar = () => {
  const location = useLocation();
  const { signOut, userName } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (event.clientY <= 80) {
        setIsVisible(true);
      } else if (event.clientY > 150) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Show navigation hint on non-homepage when navbar is hidden */}
      {!isHomePage && !isVisible && (
        <div className="pointer-events-none fixed top-0 left-1/2 z-[999] -translate-x-1/2 transform">
          <div className="animate-pulse rounded-b-lg bg-cyan-600/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
            Move cursor to top for navigation
          </div>
        </div>
      )}

      <nav
        className={`fixed top-0 right-0 left-0 z-[1000] flex items-center justify-between bg-cyan-600 px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg font-semibold text-white shadow-sm transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="grid grid-cols-6 gap-1 sm:gap-2 flex-1 mr-2 sm:mr-4">
          {navItems.map(item => (
            <NavLink
              key={item.key}
              to={item.key}
              className={({ isActive }) =>
                `flex items-center justify-center overflow-hidden rounded-lg border-none bg-white px-1 sm:px-2 lg:px-4 py-2 sm:py-2.5 lg:py-3 text-center font-bold text-xs sm:text-sm lg:text-base whitespace-nowrap text-cyan-700 no-underline transition-colors duration-200 outline-none hover:bg-yellow-300 hover:text-cyan-700 focus:outline-none ${
                  isActive ? 'bg-yellow-300 text-cyan-700 shadow-lg shadow-yellow-200' : ''
                }`
              }
            >
              <span className="truncate w-full text-center">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
          <span className="hidden sm:inline text-xs sm:text-sm lg:text-base">
            Welcome, <strong className="truncate max-w-[80px] sm:max-w-none">{userName}</strong>!
          </span>
          <span className="sm:hidden text-xs">
            <strong className="truncate max-w-[60px]">{userName}</strong>
          </span>
          <Button 
            type="primary" 
            danger 
            onClick={() => signOut()}
            size="small"
            className="text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Signout</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </div>
      </nav>
    </>
  );
};
