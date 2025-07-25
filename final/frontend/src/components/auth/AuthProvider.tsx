import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthProviderProperties } from 'types/auth';

import { AuthContext } from './auth-context';

function getToken() {
  return localStorage.getItem('token');
}

export function AuthProvider({ children }: AuthProviderProperties) {
  const [user, setUser] = useState<string>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const storeToken = getToken();
    const storedUsername = localStorage.getItem('username');
    if (storeToken && storedUsername) {
      setUser(storedUsername);
      setToken(storeToken);
    }
  }, []);

  const signin = useCallback((username: string) => {
    setUser(username);
    setToken(getToken()!);
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

    setUser(undefined);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      signin,
      signout,
    }),
    [user, token, signin, signout]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
