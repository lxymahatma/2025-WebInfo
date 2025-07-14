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

export interface GameStatsResponse {
  stats: GameStats;
}

export interface UpdateGameStatsRequest {
  gameType: "dragdrop" | "timed" | "memory";
}
