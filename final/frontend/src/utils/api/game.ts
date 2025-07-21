import type { TimedQuestionsResponse, Subject, MemoryCardsResponse, GamePair } from 'types';
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

    if (data.cards) {
      return data.cards;
    } else {
      return ['Dog', 'Cat', 'Mouse', 'Hamster'];
    }
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
