import type { AuthResponse } from '@eduplayground/shared/types/auth';
import type { ReactNode } from 'react';

export interface AuthContextType {
  userName: string;
  token: string;
  signIn: (auth: AuthResponse) => void;
  signOut: () => void;
}

export interface AuthProviderProperties {
  children: ReactNode;
}
