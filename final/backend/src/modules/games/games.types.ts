import type {
  MemoryCard,
  GameDashboardCard,
  DragDropPair,
  TimedQuizQuestion,
} from "@eduplayground/shared/game";

export interface GamesDB {
  dashboard: {
    cards: {
      dragdrop: GameDashboardCard;
      timed: GameDashboardCard;
      memory: GameDashboardCard;
    };
  };
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
export interface DragDropGameScore {
  id: number;
  userId: number;
  score: number;
  timeCompleted: number;
  date: string;
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
