import type { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

export interface ErrorResponse {
  message: string;
}

// Game Statistics Types
export interface GameStats {
  dragdrop: number;
  timed: number;
  memory: number;
}

export interface GameStatsResponse {
  stats: GameStats;
}

export interface UpdateGameStatsRequest {
  gameType: "dragdrop" | "timed" | "memory";
}
