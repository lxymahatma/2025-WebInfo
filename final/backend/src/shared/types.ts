import type { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

export interface ErrorResponse {
  message: string;
}

export interface GameStats {
  dragdrop: number;
  timed: number;
  memory: number;
}
