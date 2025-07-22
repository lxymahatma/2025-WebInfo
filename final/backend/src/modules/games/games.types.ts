// Request/Response interfaces
export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

export interface GameStatsResponse {
  stats: {
    dragdrop: number;
    timed: number;
    memory: number;
  };
}

export interface ErrorResponse {
  message: string;
}

export interface UpdateGameStatsRequest {
  gameType: "dragdrop" | "timed" | "memory";
}

// Game data interfaces
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
    questions: TimedQuestion[];
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

export interface DragDropDB {
  pairs: DragDropPair[];
  scores: DragDropGameScore[];
}

// Memory Game Types
export interface MemoryCard {
  type: string;
}

export interface MemoryDB {
  cards: MemoryCard[];
}

// Timed Quiz Types
export interface MemoryGameScore {
  id: number;
  userId: number;
  score: number;
  turns: number;
  timeCompleted: number;
  date: string;
}

export interface TimedQuestion {
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TimedQuestionDB {
  questions: TimedQuestion[];
}
