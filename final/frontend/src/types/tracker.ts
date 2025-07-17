import type { ReactNode } from 'react';

export interface GameStats {
  dragdrop: number;
  timed: number;
  memory: number;
}

export interface GameTrackerProviderProps {
  children: ReactNode;
}

export interface GameTrackerContextType {
  stats: GameStats;
  loading: boolean;
  incrementGameCount: (gameType: keyof GameStats) => Promise<void>;
  resetStats: () => Promise<void>;
  fetchStats: () => Promise<void>;
}
