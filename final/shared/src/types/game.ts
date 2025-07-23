export interface GameDashboardCard {
  name: string;
  icon: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  path: string;
}

export interface GameDashboardResponse {
  dashboard: {
    cards: {
      dragdrop: GameDashboardCard;
      timed: GameDashboardCard;
      memory: GameDashboardCard;
    };
  };
  userStats: GameStats;
}

export interface GameStats {
  dragdrop: number;
  timed: number;
  memory: number;
}

export interface GameStatsResponse {
  stats: GameStats;
}

export interface IncrementGameRequest {
  gameType: keyof GameStats;
}

export interface UpdateGameStatsRequest {
  gameType: "dragdrop" | "timed" | "memory";
}
