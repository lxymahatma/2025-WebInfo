// Memory Card Game
export interface CardType {
  text: string;
  id: number;
  matched: boolean;
}
export interface CardProperties {
  card: CardType;
  flipped: boolean;
  handleChoice: (card: CardType) => void;
}
