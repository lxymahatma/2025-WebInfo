import type { GameStats } from "shared/types";
export interface UserDB {
  users: User[];
}

export interface User {
  username: string;
  password: string;
  gameStats: GameStats;
  language: string;
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
