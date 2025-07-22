import type {
  TimedQuestionsResponse,
  Subject,
  MemoryCardsResponse,
  GamePair,
  GameInfoResponse,
  GameStatsResponse,
  GameStats,
  IncrementGameRequest,
} from 'types';

import { API_BASE_URL } from 'config/api';

export const fetchTimedQuestions = async (subject: Subject): Promise<TimedQuestionsResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/timed/questions?subject=${subject}`);

    if (response.ok) {
      const data = (await response.json()) as TimedQuestionsResponse;
      return data;
    } else {
      console.error('Failed to fetch questions');
      return null;
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    return null;
  }
};

export const fetchMemoryCards = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/memory/cards`);
    const data = (await response.json()) as MemoryCardsResponse;

    return data.cards ? data.cards : ['Dog', 'Cat', 'Mouse', 'Hamster'];
  } catch (error) {
    console.error('Error fetching cards from backend:', error);
    return ['Dog', 'Cat', 'Mouse', 'Hamster'];
  }
};

export const fetchDragDropPairs = async (difficulty: string): Promise<GamePair[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/dragdrop/pairs?difficulty=${difficulty}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pairs');
    }
    return (await response.json()) as GamePair[];
  } catch (error) {
    console.error('Error fetching pairs:', error);
    return [];
  }
};

export const fetchGameCard = async (): Promise<GameInfoResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/game/dashboard`);

    if (response.ok) {
      const data = (await response.json()) as GameInfoResponse;
      return data;
    } else {
      console.error('Failed to fetch game info');
      return null;
    }
  } catch (error) {
    console.error('Error fetching game info:', error);
    return null;
  }
};

export const fetchGameStats = async (token: string): Promise<GameStatsResponse> => {
  const response = await fetch(`${API_BASE_URL}/game/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return (await response.json()) as GameStatsResponse;
  } else {
    throw new Error('Failed to fetch game stats');
  }
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

  if (response.ok) {
    return (await response.json()) as GameStatsResponse;
  } else {
    throw new Error('Error incrementing game count');
  }
};

export const resetGameStats = async (token: string): Promise<GameStatsResponse> => {
  const response = await fetch(`${API_BASE_URL}/game/stats/reset`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return (await response.json()) as GameStatsResponse;
  } else {
    throw new Error('Error resetting game stats');
  }
};
