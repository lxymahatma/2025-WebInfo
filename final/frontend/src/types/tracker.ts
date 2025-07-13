import { ReactNode } from 'react';

export interface GameStats {
  dragdrop: number;
  timed: number;
  memory: number;
}

export interface GameTrackerProviderProps {
  children: ReactNode;
}
