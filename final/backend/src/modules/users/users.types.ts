import type { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

export interface GameStats {
  dragdrop: number;
  timed: number;
  memory: number;
}

export interface User {
  username: string;
  password: string;
  gameStats: GameStats;
  language: string;
}

export interface UserDB {
  users: User[];
}

export interface ProfileResponse {
  user: {
    username: string;
    password: string;
  };
}

export interface UpdateProfileRequestBody {
  username?: string;
  password?: string;
}

export interface GameStatsResponse {
  stats: GameStats;
}

export interface UpdateGameStatsRequest {
  gameType: "dragdrop" | "timed" | "memory";
}

export interface ErrorResponse {
  message: string;
}
