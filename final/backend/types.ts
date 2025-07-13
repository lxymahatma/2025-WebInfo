import { Request, Response, NextFunction } from "express";

// Auth types
interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

interface SignupRequestBody {
  username: string;
  password: string;
}

interface SigninRequestBody {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  username: string;
}

interface ErrorResponse {
  message: string;
}

interface ProfileResponse {
  user: {
    username: string;
  };
}

// User types
interface User {
  username: string;
  password: string;
}

interface UserDB {
  users: User[];
}

// Memory Card types
interface MemoryCard {
  type: string;
}

interface MemoryDB {
  cards: MemoryCard[];
}

interface MemoryGameScore {
  id: number;
  userId: number;
  score: number;
  turns: number;
  timeCompleted: number;
  date: string;
}

// Drag Drop types
interface DragDropPair {
  id: string;
  label: string;
  match: string;
}

interface DragDropGameScore {
  id: number;
  userId: number;
  score: number;
  timeCompleted: number;
  date: string;
}

interface DragDropDB {
  pairs: DragDropPair[];
  scores: DragDropGameScore[];
}

export {
  User,
  UserDB,
  MemoryCard,
  MemoryDB,
  MemoryGameScore,
  DragDropPair,
  DragDropGameScore,
  DragDropDB,
  AuthRequest,
  SignupRequestBody,
  SigninRequestBody,
  AuthResponse,
  ErrorResponse,
  ProfileResponse,
  Request,
  Response,
  NextFunction,
};
