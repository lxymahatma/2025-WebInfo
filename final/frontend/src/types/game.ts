import type { ReactNode } from 'react';

export interface GameCard {
  name: string;
  icon: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  path: string;
}

export interface GameInfoResponse {
  dragdrop: GameCard;
  timed: GameCard;
  memory: GameCard;
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

export interface GameTrackerProviderProperties {
  children: ReactNode;
}

export interface GameTrackerContextType {
  stats: GameStats;
  incrementGameCount: (gameType: keyof GameStats) => Promise<void>;
  resetStats: () => Promise<void>;
  fetchStats: () => Promise<void>;
}
