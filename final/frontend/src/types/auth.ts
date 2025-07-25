import type { AuthResponse } from '@eduplayground/shared/auth';
import type { ReactNode } from 'react';

export interface AuthContextType {
  user: string;
  token: string;
  signIn: (auth: AuthResponse) => void;
  signOut: () => void;
}

export interface AuthProviderProperties {
  children: ReactNode;
}
