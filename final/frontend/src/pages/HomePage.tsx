import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Modal } from 'antd';

import { useAuth } from 'components';

const { Title, Paragraph } = Typography;

export const HomePage = (): React.JSX.Element => {
  const { user, signout } = useAuth();

  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Yes, Logout',
      cancelText: 'Cancel',
      onOk: () => {
        signout();
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-cyan-800 font-sans">
      {user && (
        <div className="flex items-center justify-between border-b border-white/20 bg-white/10 px-8 py-6 backdrop-blur-sm">
          <div>
            <span className="text-lg font-medium text-white">
              Welcome back, <strong>{user}</strong>!
            </span>
          </div>
          <Button
            type="primary"
            danger
            onClick={handleLogout}
            className="rounded-lg border-none bg-red-500/90 transition-all duration-300 hover:-translate-y-px hover:bg-red-500"
          >
            Logout
          </Button>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-8 py-8">
        <div className="mb-12 text-center">
          <img src="/logo.png" alt="Game Platform Logo" className="mx-auto mb-8 block h-auto w-full max-w-sm" />
          <Title level={1} className="!mb-4 !text-6xl !font-extrabold !text-white drop-shadow-lg">
            🎮 Game Platform
          </Title>
          <Paragraph className="!mb-0 !text-xl !font-normal !text-white/90">
            Challenge yourself with our collection of exciting brain games
          </Paragraph>
        </div>

        {user ? (
          <>
            <div className="mb-12">
              <Title level={2} className="!mb-8 !text-center !text-3xl !font-semibold !text-white drop-shadow-md">
                Choose Your Game
              </Title>

              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Link
                  to="/dragdrop"
                  className="flex flex-col items-center rounded-2xl border-2 border-transparent bg-white/95 p-8 text-center no-underline transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:shadow-2xl"
                >
                  <div className="mb-4 text-5xl">🎯</div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">Drag & Drop</h3>
                    <p className="m-0 text-base leading-relaxed text-gray-600">
                      Test your coordination skills with interactive drag and drop challenges
                    </p>
                  </div>
                </Link>

                <Link
                  to="/timed"
                  className="flex flex-col items-center rounded-2xl border-2 border-transparent bg-white/95 p-8 text-center no-underline transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:shadow-2xl"
                >
                  <div className="mb-4 text-5xl">⏰</div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">Timed Quiz</h3>
                    <p className="m-0 text-base leading-relaxed text-gray-600">
                      Challenge your knowledge under pressure with time-based questions
                    </p>
                  </div>
                </Link>

                <Link
                  to="/memory"
                  className="flex flex-col items-center rounded-2xl border-2 border-transparent bg-white/95 p-8 text-center no-underline transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:shadow-2xl"
                >
                  <div className="mb-4 text-5xl">🧠</div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">Memory Cards</h3>
                    <p className="m-0 text-base leading-relaxed text-gray-600">
                      Train your memory with our classic card matching game
                    </p>
                  </div>
                </Link>

                <Link
                  to="/tracker"
                  className="flex flex-col items-center rounded-2xl border-2 border-transparent bg-white/95 p-8 text-center no-underline transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:shadow-2xl"
                >
                  <div className="mb-4 text-5xl">🎮</div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">Game Tracker</h3>
                    <p className="m-0 text-base leading-relaxed text-gray-600">
                      View your game statistics and track your progress
                    </p>
                  </div>
                </Link>

                <Link
                  to="/profile"
                  className="flex flex-col items-center rounded-2xl border-2 border-transparent bg-white/95 p-8 text-center no-underline transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:shadow-2xl"
                >
                  <div className="mb-4 text-5xl">👤</div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">Profile</h3>
                    <p className="m-0 text-base leading-relaxed text-gray-600">
                      Manage your account settings and view your achievements
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-12 text-center">
              <Title level={2} className="!mb-8 !text-3xl !font-semibold !text-white drop-shadow-md">
                Welcome to Game Platform!
              </Title>
              <Paragraph className="!mx-auto !mb-12 !max-w-2xl !text-xl !leading-relaxed !text-white/90">
                Discover our amazing collection of brain-training games designed to challenge and entertain you.
              </Paragraph>
            </div>

            <div className="my-8 text-center">
              <div className="mx-auto max-w-2xl rounded-3xl border border-white/20 bg-white/10 px-8 py-12 shadow-2xl backdrop-blur-sm">
                <Title level={3} className="!mb-8 !text-3xl !font-semibold !text-white">
                  Ready to Play?
                </Title>
                <div className="mb-0 flex flex-wrap justify-center gap-8">
                  <Link to="/signin">
                    <Button
                      className="!inline-flex !min-w-40 !items-center !justify-center !rounded-2xl !border-none !bg-white/90 !px-12 !py-7 !text-center !text-xl !font-bold !text-slate-800 !no-underline !transition-all !duration-300 hover:!-translate-y-1 hover:!bg-gradient-to-r hover:!from-blue-500 hover:!to-blue-600 hover:!text-white hover:!shadow-xl"
                      size="large"
                    >
                      🔑 Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      className="!inline-flex !min-w-40 !items-center !justify-center !rounded-2xl !border-none !bg-white/90 !px-12 !py-7 !text-center !text-xl !font-bold !text-slate-800 !no-underline !transition-all !duration-300 hover:!-translate-y-1 hover:!bg-gradient-to-r hover:!from-green-500 hover:!to-green-600 hover:!text-white hover:!shadow-xl"
                      size="large"
                    >
                      📝 Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm">
                  <span className="mb-3 block text-3xl">🎯</span>
                  <h4 className="mb-2 text-lg font-semibold text-white">Drag & Drop Game</h4>
                  <p className="m-0 text-sm text-white/80">Test your coordination skills</p>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm">
                  <span className="mb-3 block text-3xl">⏰</span>
                  <h4 className="mb-2 text-lg font-semibold text-white">Timed Quiz</h4>
                  <p className="m-0 text-sm text-white/80">Challenge your knowledge under pressure</p>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm">
                  <span className="mb-3 block text-3xl">🧠</span>
                  <h4 className="mb-2 text-lg font-semibold text-white">Memory Card Game</h4>
                  <p className="m-0 text-sm text-white/80">Train your memory</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
