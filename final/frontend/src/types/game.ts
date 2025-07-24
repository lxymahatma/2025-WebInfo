import type { GameStats } from '@eduplayground/shared/game';
import type { ReactNode } from 'react';

export interface GameTrackerContextType {
  stats: GameStats;
  incrementGameCount: (gameType: keyof GameStats) => Promise<void>;
  resetStats: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

export interface GameTrackerProviderProperties {
  children: ReactNode;
}

// Memory Card Game
export interface CardType {
  type: string;
  id: number;
  matched: boolean;
}

export interface CardProperties {
  card: CardType;
  flipped: boolean;
  handleChoice: (card: CardType) => void;
  disabled: boolean;
}
