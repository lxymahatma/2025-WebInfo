import type { ReactNode } from 'react';

export interface AuthContextType {
  user: string | undefined;
  token: string | undefined;
  signin: (username: string) => void;
  signout: () => void;
}

export interface AuthProviderProperties {
  children: ReactNode;
}
