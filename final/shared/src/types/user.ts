import type { GameStats } from "./game";

export interface User {
  username: string;
  password: string;
  gameStats: GameStats;
  language: string;
}

export interface ProfileResponse {
  user: User;
}

export interface UpdateProfileRequestBody {
  username?: string;
  password?: string;
}
