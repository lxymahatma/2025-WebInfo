import { Button, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export const WelcomePage = (): React.JSX.Element => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-600 to-cyan-800 font-sans">
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
      </div>
    </div>
  );
};
