import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from 'components';
import type { SignInResponse, ErrorResponse } from 'types';

export const SignUpPage = (): React.JSX.Element => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { signin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      void navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSignUp = async (): Promise<void> => {
    if (!username.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = (await res.json()) as SignInResponse;
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        signin(data.username);
        alert('Sign up success!');
        void navigate('/');
      } else {
        const error = (await res.json()) as ErrorResponse;
        alert(error.message ?? 'Sign up failed');
      }
    } catch {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-600 to-cyan-800 font-sans min-h-screen overflow-auto p-0 m-0 box-border">
      <Link
        to="/"
        className="absolute top-8 left-8 text-white font-semibold text-base no-underline transition-opacity duration-300 hover:opacity-80 md:top-4 md:left-4 md:text-sm"
      >
        ← Back to Home
      </Link>
      <div className="flex items-center justify-center w-full h-full p-8 box-border">
        <div className="backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl flex-shrink-0 max-w-md p-12 md:p-8 relative text-center w-[90%] z-10">
          <h2 className="!text-gray-800 !text-4xl md:!text-3xl !font-bold !mb-8 !drop-shadow-none">Sign Up</h2>
          <form
            className="flex flex-col gap-6"
            onSubmit={e => {
              e.preventDefault();
              void handleSignUp();
            }}
          >
            <div className="text-left">
              <label className="block text-gray-600 text-base font-semibold mb-2">Username</label>
              <input
                className="w-full border-2 border-gray-300 rounded-lg text-base outline-none px-4 py-3 transition-colors duration-300 focus:border-blue-400 focus:shadow-sm focus:shadow-blue-400/10"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="text-left">
              <label className="block text-gray-600 text-base font-semibold mb-2">Password</label>
              <input
                className="w-full border-2 border-gray-300 rounded-lg text-base outline-none px-4 py-3 transition-colors duration-300 focus:border-blue-400 focus:shadow-sm focus:shadow-blue-400/10"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button
              className="!bg-gradient-to-r !from-cyan-600 !to-cyan-800 !border-none !rounded-xl !text-white !cursor-pointer !text-lg !font-semibold !px-8 !py-4 !no-underline !transition-all !duration-300 hover:!bg-gradient-to-r hover:!from-cyan-700 hover:!to-cyan-900 hover:!shadow-lg hover:!shadow-cyan-600/30 hover:!text-white hover:!-translate-y-0.5"
              type="submit"
            >
              Sign Up
            </button>
          </form>
          <div className="border-t border-gray-300 mt-6 pt-6">
            <p className="text-gray-500 text-sm mb-2">Already have an account?</p>
            <Link
              to="/signin"
              className="!text-cyan-600 !font-semibold !no-underline !transition-colors !duration-300 hover:!text-cyan-800 hover:!underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
