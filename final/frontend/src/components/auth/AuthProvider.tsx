import { useState, useEffect, useMemo, useCallback } from 'react';
import { message } from 'antd';

import type { AuthProviderProps } from 'types';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setUser(storedUsername);
    }
  }, []);

  const signin = useCallback((username: string) => {
    setUser(username);
  }, []);

  const signout = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await fetch('http://localhost:3001/signout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          message.success('Successfully signed out');
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }, []);

  const value = useMemo(
    () => ({
      user,
      signin,
      signout,
    }),
    [user, signin, signout]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
