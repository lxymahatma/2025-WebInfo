// Game Card
export interface GameCard {
  name: string;
  icon: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  path: string;
}

export interface GameCardResponse {
  dragdrop: GameCard;
  timed: GameCard;
  memory: GameCard;
}

export interface GamesDB {
  cards: GameCardResponse;
  dragdrop: {
    pairs: DragDropPair[];
  };
  memory: {
    cards: MemoryCard[];
  };
  timed: {
    questions: TimedQuizQuestion[];
  };
}

// Drag & Drop Game Types
export interface DragDropPair {
  id: string;
  label: string;
  match: string;
}

export interface DragDropGameScore {
  id: number;
  userId: number;
  score: number;
  timeCompleted: number;
  date: string;
}

// Memory Game Types
export interface MemoryCard {
  type: string;
}

// Timed Quiz Types
export interface TimedQuizScore {
  id: number;
  userId: number;
  score: number;
  turns: number;
  timeCompleted: number;
  date: string;
}

export interface TimedQuizQuestion {
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
}
