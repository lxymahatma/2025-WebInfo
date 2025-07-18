export interface CardType {
  type: string;
  id: number;
  matched: boolean;
}

export interface CardProps {
  card: CardType;
  flipped: boolean;
  handleChoice: (card: CardType) => void;
  disabled: boolean;
}

export interface MemoryCardsResponse {
  cards?: string[];
}
