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

export const fetchTimedQuestions = async (subject: Subject): Promise<TimedQuizQuestionsResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/timed/questions?subject=${subject}`);

    if (!response.ok) {
      console.error('Failed to fetch timed questions');
      throw new Error('Failed to fetch timed questions');
    }

    return (await response.json()) as TimedQuizQuestionsResponse;
  } catch (error) {
    console.error('Error fetching timed questions:', error);
    return undefined;
  }
};

export const fetchMemoryCards = async (): Promise<MemoryCardsResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/memory/cards`);

    if (!response.ok) {
      console.error('Failed to fetch memory cards');
      throw new Error('Failed to fetch memory cards');
    }

    return (await response.json()) as MemoryCardsResponse;
  } catch (error) {
    console.error('Error fetching memory cards:', error);
    return undefined;
  }
};

export const fetchDragDropPairs = async (difficulty: string): Promise<DragDropPairsResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/dragdrop/pairs?difficulty=${difficulty}`);
    if (!response.ok) {
      console.error('Failed to fetch drag & drop pairs');
      throw new Error('Failed to fetch drag & drop pairs');
    }

    return (await response.json()) as DragDropPairsResponse;
  } catch (error) {
    console.error('Error fetching drag & drop pairs:', error);
    return undefined;
  }
};

export const fetchDashboardCard = async (): Promise<GameDashboardResponse | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/dashboard`);

    if (!response.ok) {
      console.error('Failed to fetch dashboard card');
      throw new Error('Failed to fetch dashboard card');
    }

    return (await response.json()) as GameDashboardResponse;
  } catch (error) {
    console.error('Error fetching dashboard card:', error);
    return undefined;
  }
};

export const fetchGameStats = async (token: string): Promise<GameStatsResponse> => {
  const response = await fetch(`${API_BASE_URL}/game/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch game stats');
    throw new Error('Failed to fetch game stats');
  }
  return (await response.json()) as GameStatsResponse;
};

export const incrementGameCount = async (token: string, gameType: keyof GameStats): Promise<GameStatsResponse> => {
  const response = await fetch(`${API_BASE_URL}/game/stats/increment`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ gameType } as IncrementGameRequest),
  });

  if (!response.ok) {
    console.error('Failed to increment game count');
    throw new Error('Failed to increment game count');
  }
  return (await response.json()) as GameStatsResponse;
};

export const resetGameStats = async (token: string): Promise<GameStatsResponse> => {
  const response = await fetch(`${API_BASE_URL}/game/stats/reset`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Failed to reset game stats');
    throw new Error('Failed to reset game stats');
  }
  return (await response.json()) as GameStatsResponse;
};
