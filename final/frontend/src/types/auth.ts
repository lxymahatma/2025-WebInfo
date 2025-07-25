import type { ReactNode } from 'react';

export interface AuthContextType {
  user: string | undefined;
  token: string | undefined;
  signIn: (username: string, token: string) => void;
  signOut: () => void;
}

export interface AuthProviderProperties {
  children: ReactNode;
}
