import type { AuthResponse } from '@eduplayground/shared/auth';
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
  const [userName, setUserName] = useState<string>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const storeToken = getToken();
    const storedUsername = getUsername();
    if (storeToken && storedUsername) {
      setUserName(storedUsername);
      setToken(storeToken);
    }
  }, []);

  const signIn = useCallback((auth: AuthResponse) => {
    localStorage.setItem('username', auth.username);
    localStorage.setItem('token', auth.token);
    setUserName(auth.username);
    setToken(auth.token);
  }, []);

  const signOut = useCallback(async () => {
    if (!token) {
      return;
    }

    await signOutRequest(token);

    setUserName(undefined);
    setToken(undefined);
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    message.success('Successfully signed out');
  }, [token]);

  const value = useMemo(
    () => ({
      user: userName,
      token,
      signIn,
      signOut,
    }),
    [userName, token, signIn, signOut]
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
