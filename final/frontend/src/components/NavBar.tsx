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
        className={`fixed top-0 right-0 left-0 z-[1000] flex items-center justify-between bg-cyan-600 px-8 py-5 text-lg font-semibold text-white shadow-sm transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex w-full flex-1 items-center justify-evenly gap-2">
          {navItems.map(item => (
            <NavLink
              key={item.key}
              to={item.key}
              className={({ isActive }) =>
                `flex max-w-[180px] min-w-[140px] flex-1 items-center justify-center overflow-hidden rounded-lg border-none bg-white px-4 py-3 text-center font-bold whitespace-nowrap text-cyan-700 no-underline transition-colors duration-200 outline-none hover:bg-yellow-300 hover:text-cyan-700 focus:outline-none ${
                  isActive ? 'bg-yellow-300 text-cyan-700 shadow-lg shadow-yellow-200' : ''
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
          <Button type="primary" danger onClick={() => signOut()}>
            Signout
          </Button>
        </div>
      </nav>
    </>
  );
};
