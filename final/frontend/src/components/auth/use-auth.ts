import { use } from 'react';
import type { AuthContextType } from 'types/auth';

import { AuthContext } from './auth-context';

export function useAuth(): AuthContextType {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
