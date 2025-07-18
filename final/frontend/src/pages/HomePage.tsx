import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button } from 'antd';

import { useAuth } from 'components';

const { Title, Paragraph } = Typography;

export const HomePage = (): React.JSX.Element => {
  const { user, signout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-cyan-800 font-sans">
      {user && (
        <div className="flex items-center justify-between px-8 py-6 backdrop-blur-sm bg-white/10 border-b border-white/20">
          <div>
            <span className="text-white text-lg font-medium">
              Welcome back, <strong>{user}</strong>!
            </span>
          </div>
          <Button
            type="primary"
            danger
            onClick={signout}
            className="bg-red-500/90 border-none rounded-lg transition-all duration-300 hover:bg-red-500 hover:-translate-y-px"
          >
            Logout
          </Button>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="text-center mb-12">
          <img src="/logo.png" alt="Game Platform Logo" className="block mx-auto mb-8 w-full max-w-sm h-auto" />
          <Title level={1} className="!text-white !text-6xl !font-extrabold !mb-4 drop-shadow-lg">
            🎮 Game Platform
          </Title>
          <Paragraph className="!text-white/90 !text-xl !font-normal !mb-0">
            Challenge yourself with our collection of exciting brain games
          </Paragraph>
        </div>

        {user ? (
          <>
            <div className="mb-12">
              <Title level={2} className="!text-white !text-3xl !font-semibold !mb-8 !text-center drop-shadow-md">
                Choose Your Game
              </Title>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                <Link
                  to="/dragdrop"
                  className="flex flex-col items-center bg-white/95 rounded-2xl p-8 text-center no-underline border-2 border-transparent transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4">🎯</div>
                  <div>
                    <h3 className="text-slate-800 text-xl font-bold mb-2">Drag & Drop</h3>
                    <p className="text-gray-600 text-base leading-relaxed m-0">
                      Test your coordination skills with interactive drag and drop challenges
                    </p>
                  </div>
                </Link>

                <Link
                  to="/timed"
                  className="flex flex-col items-center bg-white/95 rounded-2xl p-8 text-center no-underline border-2 border-transparent transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4">⏰</div>
                  <div>
                    <h3 className="text-slate-800 text-xl font-bold mb-2">Timed Quiz</h3>
                    <p className="text-gray-600 text-base leading-relaxed m-0">
                      Challenge your knowledge under pressure with time-based questions
                    </p>
                  </div>
                </Link>

                <Link
                  to="/memory"
                  className="flex flex-col items-center bg-white/95 rounded-2xl p-8 text-center no-underline border-2 border-transparent transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4">🧠</div>
                  <div>
                    <h3 className="text-slate-800 text-xl font-bold mb-2">Memory Cards</h3>
                    <p className="text-gray-600 text-base leading-relaxed m-0">
                      Train your memory with our classic card matching game
                    </p>
                  </div>
                </Link>

                <Link
                  to="/tracker"
                  className="flex flex-col items-center bg-white/95 rounded-2xl p-8 text-center no-underline border-2 border-transparent transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4">🎮</div>
                  <div>
                    <h3 className="text-slate-800 text-xl font-bold mb-2">Game Tracker</h3>
                    <p className="text-gray-600 text-base leading-relaxed m-0">
                      View your game statistics and track your progress
                    </p>
                  </div>
                </Link>

                <Link
                  to="/profile"
                  className="flex flex-col items-center bg-white/95 rounded-2xl p-8 text-center no-underline border-2 border-transparent transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="text-5xl mb-4">👤</div>
                  <div>
                    <h3 className="text-slate-800 text-xl font-bold mb-2">Profile</h3>
                    <p className="text-gray-600 text-base leading-relaxed m-0">
                      Manage your account settings and view your achievements
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-12">
              <Title level={2} className="!text-white !text-3xl !font-semibold !mb-8 drop-shadow-md">
                Welcome to Game Platform!
              </Title>
              <Paragraph className="!text-white/90 !text-xl !leading-relaxed !mx-auto !mb-12 !max-w-2xl">
                Discover our amazing collection of brain-training games designed to challenge and entertain you.
              </Paragraph>
            </div>

            <div className="text-center my-8">
              <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-3xl shadow-2xl mx-auto max-w-2xl px-8 py-12">
                <Title level={3} className="!text-white !text-3xl !font-semibold !mb-8">
                  Ready to Play?
                </Title>
                <div className="flex flex-wrap gap-8 justify-center mb-0">
                  <Link to="/signin">
                    <Button
                      className="!inline-flex !items-center !justify-center !bg-white/90 !border-none !rounded-2xl !text-slate-800 !text-xl !font-bold !text-center !no-underline !transition-all !duration-300 !min-w-40 !px-12 !py-7 hover:!bg-gradient-to-r hover:!from-blue-500 hover:!to-blue-600 hover:!text-white hover:!shadow-xl hover:!-translate-y-1"
                      size="large"
                    >
                      🔑 Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button
                      className="!inline-flex !items-center !justify-center !bg-white/90 !border-none !rounded-2xl !text-slate-800 !text-xl !font-bold !text-center !no-underline !transition-all !duration-300 !min-w-40 !px-12 !py-7 hover:!bg-gradient-to-r hover:!from-green-500 hover:!to-green-600 hover:!text-white hover:!shadow-xl hover:!-translate-y-1"
                      size="large"
                    >
                      📝 Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto max-w-4xl">
                <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-6 text-center">
                  <span className="block text-3xl mb-3">🎯</span>
                  <h4 className="text-white text-lg font-semibold mb-2">Drag & Drop Game</h4>
                  <p className="text-white/80 text-sm m-0">Test your coordination skills</p>
                </div>
                <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-6 text-center">
                  <span className="block text-3xl mb-3">⏰</span>
                  <h4 className="text-white text-lg font-semibold mb-2">Timed Quiz</h4>
                  <p className="text-white/80 text-sm m-0">Challenge your knowledge under pressure</p>
                </div>
                <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-6 text-center">
                  <span className="block text-3xl mb-3">🧠</span>
                  <h4 className="text-white text-lg font-semibold mb-2">Memory Card Game</h4>
                  <p className="text-white/80 text-sm m-0">Train your memory</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
