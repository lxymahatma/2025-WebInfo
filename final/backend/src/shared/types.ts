import type { Request } from "express";
import type { GameStats } from "@eduplayground/shared";

export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

// Re-export shared types for backwards compatibility
export type { GameStats, ErrorResponse, ApiResponse } from "@eduplayground/shared";
