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

export interface MemoryCardsResponse {
  cards?: string[];
}
