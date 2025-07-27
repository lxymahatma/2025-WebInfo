// Game Dashboard Types
export interface GameDashboardCard {
  id: string;
  name: string;
  icon: string;
  description: string;
  backgroundColor: string;
  textColor: string;
}

export interface GameDashboard {
  cards: {
    dragdrop: GameDashboardCard;
    timed: GameDashboardCard;
    memory: GameDashboardCard;
  };
}

export interface GameOverviewResponse {
  dashboard: GameDashboard;
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

export const DRAGDROP_DIFFICULTY_KEYS = ["easy", "medium", "hard"] as const;

export type DragDropDifficultyLevel = (typeof DRAGDROP_DIFFICULTY_KEYS)[number];

// Memory Game Types
export interface MemoryCard {
  text: string;
}

export interface MemoryCardsResponse {
  cards: MemoryCard[];
}

// Timed Quiz Types
export const SUBJECT_KEYS = ["math", "english", "knowledge"] as const;

export type Subject = (typeof SUBJECT_KEYS)[number];

export interface TimedQuizQuestion {
  subject: Subject;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TimedQuizQuestionsResponse {
  questions: TimedQuizQuestion[];
}
