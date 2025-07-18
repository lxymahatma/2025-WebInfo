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
    <div className="fixed inset-0 m-0 box-border flex min-h-screen items-center justify-center overflow-auto bg-gradient-to-br from-cyan-600 to-cyan-800 p-0 font-sans">
      <Link
        to="/"
        className="absolute top-8 left-8 text-base font-semibold text-white no-underline transition-opacity duration-300 hover:opacity-80 md:top-4 md:left-4 md:text-sm"
      >
        ← Back to Home
      </Link>
      <div className="box-border flex h-full w-full items-center justify-center p-8">
        <div className="relative z-10 w-[90%] max-w-md flex-shrink-0 rounded-2xl bg-white/95 p-12 text-center shadow-2xl backdrop-blur-sm md:p-8">
          <h2 className="!mb-8 !text-4xl !font-bold !text-gray-800 !drop-shadow-none md:!text-3xl">Sign Up</h2>
          <form
            className="flex flex-col gap-6"
            onSubmit={e => {
              e.preventDefault();
              void handleSignUp();
            }}
          >
            <div className="text-left">
              <label className="mb-2 block text-base font-semibold text-gray-600">Username</label>
              <input
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition-colors duration-300 outline-none focus:border-blue-400 focus:shadow-sm focus:shadow-blue-400/10"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="text-left">
              <label className="mb-2 block text-base font-semibold text-gray-600">Password</label>
              <input
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition-colors duration-300 outline-none focus:border-blue-400 focus:shadow-sm focus:shadow-blue-400/10"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button
              className="!cursor-pointer !rounded-xl !border-none !bg-gradient-to-r !from-cyan-600 !to-cyan-800 !px-8 !py-4 !text-lg !font-semibold !text-white !no-underline !transition-all !duration-300 hover:!-translate-y-0.5 hover:!bg-gradient-to-r hover:!from-cyan-700 hover:!to-cyan-900 hover:!text-white hover:!shadow-lg hover:!shadow-cyan-600/30"
              type="submit"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-6 border-t border-gray-300 pt-6">
            <p className="mb-2 text-sm text-gray-500">Already have an account?</p>
            <Link
              to="/signin"
              className="!font-semibold !text-cyan-600 !no-underline !transition-colors !duration-300 hover:!text-cyan-800 hover:!underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
