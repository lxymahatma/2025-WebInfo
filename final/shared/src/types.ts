// 认证相关类型
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  username?: string;
}

// 用户相关类型
export interface User {
  username: string;
  stats: GameStats;
}

export interface GameStats {
  dragdrop: number;
  timed: number;
  memory: number;
}

export interface UserStatsResponse {
  stats: GameStats;
}

// 通用响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// 游戏相关类型
export interface CardType {
  type: string;
  id: number;
  matched: boolean;
}

export interface MemoryCardsResponse {
  cards: string[];
}

export interface DragDropItem {
  id: string;
  content: string;
  correctAnswer: string;
}

export interface DragDropResponse {
  items: DragDropItem[];
}

export interface TimedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface TimedQuestionResponse {
  question: TimedQuestion;
}

export interface GameResult {
  gameType: "memory" | "dragdrop" | "timed";
  score?: number;
  completed: boolean;
  timeSpent?: number;
}

export interface GameResultRequest {
  result: GameResult;
}

// 语言相关类型
export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface Translation {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  translation: Translation;
}

export interface LanguagesResponse {
  languages: Language[];
}
