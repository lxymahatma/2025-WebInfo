import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

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
  const { signOut, user } = useAuth();
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
        className={`fixed top-0 right-0 left-0 z-[1000] flex items-center justify-between bg-cyan-600 px-4 py-3 text-lg font-semibold text-white shadow-sm transition-transform duration-300 ease-in-out sm:px-6 sm:py-4 md:px-8 md:py-5 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex w-full flex-1 items-center justify-evenly gap-0.5 sm:gap-1 md:gap-2">
          {navItems.map(item => (
            <NavLink
              key={item.key}
              to={item.key}
              className={({ isActive }) =>
                `flex flex-1 items-center justify-center overflow-hidden rounded-lg border-none bg-white px-1 py-2 text-center font-bold text-cyan-700 no-underline transition-colors duration-200 outline-none hover:bg-yellow-300 hover:text-cyan-700 focus:outline-none sm:px-2 sm:py-2 md:px-3 md:py-3 lg:px-4 lg:py-3 text-[8px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg min-w-0 whitespace-nowrap ${
                  isActive ? 'bg-yellow-300 text-cyan-700 shadow-lg shadow-yellow-200' : ''
                }`
              }
            >
              <span className="block w-full text-center overflow-hidden text-ellipsis">{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <span className="text-sm sm:text-base md:text-lg">
            Welcome, <strong>{user}</strong>!
          </span>
          <Button type="primary" danger onClick={() => signOut()} size="small" className="sm:size-default">
            Signout
          </Button>
        </div>
      </nav>
    </>
  );
};
