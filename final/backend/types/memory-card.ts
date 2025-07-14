export interface MemoryCard {
  type: string;
}

export interface MemoryDB {
  cards: MemoryCard[];
}

export interface MemoryGameScore {
  id: number;
  userId: number;
  score: number;
  turns: number;
  timeCompleted: number;
  date: string;
}
