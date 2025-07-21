import { useState, useEffect, useMemo, useCallback } from 'react';
import { message } from 'antd';

import type { AuthProviderProps } from 'types';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<string | null>(null);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    const storeToken = getToken();
    const storedUsername = localStorage.getItem('username');
    if (storeToken && storedUsername) {
      setUser(storedUsername);
    }
  }, []);

  const signin = useCallback((username: string) => {
    setUser(username);
  }, []);

  const signout = useCallback(async () => {
    const token = getToken();
    if (token) {
      try {
        const response = await fetch('http://localhost:3001/signout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          message.success('Successfully signed out');
        }
      } catch (error) {
        console.error('Sign out error:', error);
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
