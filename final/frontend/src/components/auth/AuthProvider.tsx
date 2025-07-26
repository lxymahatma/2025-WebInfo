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
  const [userName, setUserName] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storeToken = getToken();
    const storedUsername = getUsername();
    if (storeToken && storedUsername) {
      setUserName(storedUsername);
      setToken(storeToken);
    }
    setIsReady(true);
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

    setUserName('');
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    message.success('Successfully signed out');
  }, [token]);

  const value = useMemo(
    () => ({
      userName,
      token,
      signIn,
      signOut,
    }),
    [userName, token, signIn, signOut]
  );

  if (!isReady) return;

  return <AuthContext value={value}>{children}</AuthContext>;
}
