import { message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthProviderProperties } from 'types/auth';
import { signOutRequest } from 'utils/api/auth';

import { AuthContext } from './auth-context';

function getToken() {
  return localStorage.getItem('token');
}

function getUsername() {
  return localStorage.getItem('username');
}

export function AuthProvider({ children }: AuthProviderProperties) {
  const [user, setUser] = useState<string>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const storeToken = getToken();
    const storedUsername = getUsername();
    if (storeToken && storedUsername) {
      setUser(storedUsername);
      setToken(storeToken);
    }
  }, []);

  const signIn = useCallback((username: string, token: string) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    setUser(username);
    setToken(token);
  }, []);

  const signOut = useCallback(async () => {
    if (!token) {
      return;
    }

    await signOutRequest(token);

    setUser(undefined);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    message.success('Successfully signed out');
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      signIn,
      signOut,
    }),
    [user, token, signIn, signOut]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
