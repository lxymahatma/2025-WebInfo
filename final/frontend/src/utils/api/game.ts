import type {
  DragDropPairsResponse,
  GameDashboardResponse,
  GameStats,
  GameStatsResponse,
  IncrementGameRequest,
  MemoryCardsResponse,
  Subject,
  TimedQuizQuestionsResponse,
} from '@eduplayground/shared/game';
import { API_BASE_URL } from 'config/api';

export const fetchTimedQuizQuestionsRequest = async (
  subject: Subject
): Promise<TimedQuizQuestionsResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/timed/questions?subject=${subject}`);

    if (!response.ok) {
      console.error('Failed to fetch timed questions', response.status, response.statusText);
      return undefined;
    }

    return (await response.json()) as TimedQuizQuestionsResponse;
  } catch (error) {
    console.error('Error fetching timed questions:', error);
    return undefined;
  }
};

export const fetchMemoryCardsRequest = async (): Promise<MemoryCardsResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/memory/cards`);

    if (!response.ok) {
      console.error('Failed to fetch memory cards', response.status, response.statusText);
      return undefined;
    }

    return (await response.json()) as MemoryCardsResponse;
  } catch (error) {
    console.error('Error fetching memory cards:', error);
    return undefined;
  }
};

export const fetchDragDropPairsRequest = async (difficulty: string): Promise<DragDropPairsResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/dragdrop/pairs?difficulty=${difficulty}`);

    if (!response.ok) {
      console.error('Failed to fetch drag & drop pairs', response.status, response.statusText);
      return undefined;
    }

    return (await response.json()) as DragDropPairsResponse;
  } catch (error) {
    console.error('Error fetching drag & drop pairs:', error);
    return undefined;
  }
};

export const fetchDashboardRequest = async (token: string): Promise<GameDashboardResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch dashboard', response.status, response.statusText);
      return undefined;
    }

    return (await response.json()) as GameDashboardResponse;
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return undefined;
  }
};

export const fetchGameStatsRequest = async (token: string): Promise<GameStatsResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch game stats', response.status, response.statusText);
      return undefined;
    }
    return (await response.json()) as GameStatsResponse;
  } catch (error) {
    console.error('Error fetching game stats:', error);
    return undefined;
  }
};

export const incrementGameCountRequest = async (
  token: string,
  gameType: keyof GameStats
): Promise<GameStatsResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/stats/increment`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameType } as IncrementGameRequest),
    });

    if (!response.ok) {
      console.error('Failed to increment game count', response.status, response.statusText);
      return undefined;
    }
    return (await response.json()) as GameStatsResponse;
  } catch (error) {
    console.error('Error incrementing game count:', error);
    return undefined;
  }
};

export const resetGameStatsRequest = async (token: string): Promise<GameStatsResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/stats/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to reset game stats', response.status, response.statusText);
      return undefined;
    }
    return (await response.json()) as GameStatsResponse;
  } catch (error) {
    console.error('Error resetting game stats:', error);
    return undefined;
  }
};
