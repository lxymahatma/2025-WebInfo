import type { MemoryCard } from '@eduplayground/shared/types/game';

// Memory Card Game
export interface CardType {
  card: MemoryCard;
  id: number;
  matched: boolean;
}

export interface CardProperties {
  card: CardType;
  flipped: boolean;
  handleChoice: (card: CardType) => void;
  disabled: boolean;
}

export interface CardComponentProperties {
  card: CardType;
  flipped: boolean;
  handleChoice: (card: CardType) => void;
  disabled: boolean;
}
