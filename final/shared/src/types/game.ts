// Game Dashboard Types
export interface GameDashboardCard {
  id: string;
  name: string;
  icon: string;
  description: string;
  backgroundColor: string;
  textColor: string;
}

export interface GameDashboardResponse {
  dashboard: {
    cards: {
      dragdrop: GameDashboardCard;
      timed: GameDashboardCard;
      memory: GameDashboardCard;
    };
  };
  userStats: GameStats;
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

export interface UpdateGameStatsRequest {
  gameType: "dragdrop" | "timed" | "memory";
}

// Drag & Drop Game Types
export interface DragDropPair {
  id: string;
  label: string;
  category: string;
}

export interface DragDropPairsResponse {
  pairs: DragDropPair[];
}

// Memory Game Types
export interface MemoryCard {
  text: string;
}

export interface MemoryCardsResponse {
  cards: MemoryCard[];
}

// Timed Quiz Types
export type Subject = "math" | "english" | "knowledge";

export interface TimedQuizQuestion {
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TimedQuizQuestionsResponse {
  questions: TimedQuizQuestion[];
}
