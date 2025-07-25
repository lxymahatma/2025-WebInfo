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
import { err, ok, type Result } from 'neverthrow';

export const fetchTimedQuizQuestionsRequest = async (
  subject: Subject
): Promise<Result<TimedQuizQuestionsResponse, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/timed/questions?subject=${subject}`);

    if (!response.ok) {
      return err(`Failed to fetch timed questions: ${response.status}, ${response.statusText}`);
    }

    return ok((await response.json()) as TimedQuizQuestionsResponse);
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Error fetching timed questions');
  }
};

export const fetchMemoryCardsRequest = async (): Promise<Result<MemoryCardsResponse, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/memory/cards`);

    if (!response.ok) {
      return err(`Failed to fetch memory cards: ${response.status}, ${response.statusText}`);
    }

    return ok((await response.json()) as MemoryCardsResponse);
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Error fetching memory cards');
  }
};

export const fetchDragDropPairsRequest = async (difficulty: string): Promise<Result<DragDropPairsResponse, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/dragdrop/pairs?difficulty=${difficulty}`);

    if (!response.ok) {
      return err(`Failed to fetch drag & drop pairs: ${response.status}, ${response.statusText}`);
    }

    return ok((await response.json()) as DragDropPairsResponse);
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Error fetching drag & drop pairs');
  }
};

export const fetchDashboardRequest = async (token: string): Promise<Result<GameDashboardResponse, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return err(`Failed to fetch dashboard: ${response.status}, ${response.statusText}`);
    }

    return ok((await response.json()) as GameDashboardResponse);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return err(error instanceof Error ? error.message : 'Error fetching dashboard');
  }
};

export const fetchGameStatsRequest = async (token: string): Promise<Result<GameStatsResponse, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return err(`Failed to fetch game stats: ${response.status}, ${response.statusText}`);
    }

    return ok((await response.json()) as GameStatsResponse);
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Error fetching game stats');
  }
};

export const incrementGameCountRequest = async (
  token: string,
  gameType: keyof GameStats
): Promise<Result<GameStatsResponse, string>> => {
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
      return err(`Failed to increment game count: ${response.status}, ${response.statusText}`);
    }

    return ok((await response.json()) as GameStatsResponse);
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Error fetching game stats');
  }
};

export const resetGameStatsRequest = async (token: string): Promise<Result<GameStatsResponse, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/stats/reset`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return err(`Failed to reset game stats: ${response.status}, ${response.statusText}`);
    }
    return ok((await response.json()) as GameStatsResponse);
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Error resetting game stats');
  }
};
