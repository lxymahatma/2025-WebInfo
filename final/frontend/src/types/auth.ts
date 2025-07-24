import type { ReactNode } from 'react';

export interface AuthContextType {
  user: string | undefined;
  signin: (username: string) => void;
  signout: () => void;
}

export interface AuthProviderProperties {
  children: ReactNode;
}
