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
  incrementGameCount: (gameType: keyof GameStats) => Promise<void>;
  resetStats: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

export interface GameStatsResponse {
  stats: GameStats;
}

export interface IncrementGameRequest {
  gameType: keyof GameStats;
}
