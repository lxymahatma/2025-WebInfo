import { Button, Modal } from 'antd';
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
  const { signOut, userName } = useAuth();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  const isHomePage = location.pathname === '/home';

  const handleSignOut = () => {
    Modal.confirm({
      title: 'Confirm Sign Out',
      content: 'Are you sure you want to sign out?',
      okText: 'Yes, Sign Out',
      cancelText: 'Cancel',
      onOk: () => {
        signOut();
      },
    });
  };

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
        className={`fixed top-0 right-0 left-0 z-[1000] flex items-center justify-between bg-cyan-600 px-2 py-3 text-sm font-semibold text-white shadow-sm transition-transform duration-300 ease-in-out sm:px-4 sm:py-4 sm:text-base lg:px-8 lg:py-5 lg:text-lg ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="mr-2 grid flex-1 grid-cols-6 gap-1 sm:mr-4 sm:gap-2">
          {navItems.map(item => (
            <NavLink
              key={item.key}
              to={item.key}
              className={({ isActive }) =>
                `flex items-center justify-center overflow-hidden rounded-lg border-none bg-white px-1 py-2 text-center text-xs font-bold whitespace-nowrap text-cyan-700 no-underline transition-colors duration-200 outline-none hover:bg-yellow-300 hover:text-cyan-700 focus:outline-none sm:px-2 sm:py-2.5 sm:text-sm lg:px-4 lg:py-3 lg:text-base ${
                  isActive ? 'bg-yellow-300 text-cyan-700 shadow-lg shadow-yellow-200' : ''
                }`
              }
            >
              <span className="w-full truncate text-center">{item.label}</span>
            </NavLink>
          ))}
        </div>
        <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2 lg:gap-4">
          <span className="hidden text-xs sm:inline sm:text-sm lg:text-base">
            Welcome, <strong className="max-w-[80px] truncate sm:max-w-none">{userName}</strong>!
          </span>
          <span className="text-xs sm:hidden">
            <strong className="max-w-[60px] truncate">{userName}</strong>
          </span>
          <Button type="primary" danger onClick={handleSignOut} size="small" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Signout</span>
            <span className="sm:hidden">Out</span>
          </Button>
        </div>
      </nav>
    </>
  );
};
