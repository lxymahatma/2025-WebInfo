import type { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

export interface ErrorResponse {
  message: string;
}
