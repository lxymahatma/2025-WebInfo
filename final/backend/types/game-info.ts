import type { DragDropPair } from "./drag-drop";
import type { MemoryCard } from "./memory-card";
import type { TimedQuestion } from "./timed-question";

export interface GameInfo {
  name: string;
  icon: string;
  description: string;
  color: string;
  tailwindColor: string;
  path: string;
}

export interface GameInfoResponse {
  dragdrop: GameInfo;
  timed: GameInfo;
  memory: GameInfo;
}

export interface GamesDB {
  gameInfo: GameInfoResponse;
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
