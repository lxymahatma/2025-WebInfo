import { Request, Response, NextFunction } from "express";

// Requests, Responses
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
    password: string;
  };
}

interface GameStatsResponse {
  stats: GameStats;
}

interface UpdateGameStatsRequest {
  gameType: "dragdrop" | "timed" | "memory";
}

// User types
interface GameStats {
  dragdrop: number;
  timed: number;
  memory: number;
}

interface User {
  username: string;
  password: string;
  gameStats: GameStats;
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

// Timed Question types
interface TimedQuestion {
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface TimedQuestionDB {
  questions: TimedQuestion[];
}

export {
  User,
  UserDB,
  GameStats,
  GameStatsResponse,
  UpdateGameStatsRequest,
  MemoryCard,
  MemoryDB,
  MemoryGameScore,
  DragDropPair,
  DragDropGameScore,
  DragDropDB,
  TimedQuestion,
  TimedQuestionDB,
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
