import type { ReactNode } from 'react';

export interface GameInfo {
  name: string;
  icon: string;
  description: string;
  color: string;
  tailwindColor: string;
  path: string;
}

export interface GameInfoResponse {
  dragdrop: GameInfo;
  timed: GameInfo;
  memory: GameInfo;
}

export interface GameStats {
  dragdrop: number;
  timed: number;
  memory: number;
}

export interface GameStatsResponse {
  stats: GameStats;
}

export interface IncrementGameRequest {
  gameType: keyof GameStats;
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
