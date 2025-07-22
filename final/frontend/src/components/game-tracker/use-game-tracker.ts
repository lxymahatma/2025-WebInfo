import { use } from 'react';
import type { GameTrackerContextType } from 'types';
import { GameTrackerContext } from './game-tracker-context';

export const useGameTracker = (): GameTrackerContextType => {
  const context = use(GameTrackerContext);
  if (!context) {
    throw new Error('useGameTracker must be used within a GameTrackerProvider');
  }
  return context;
};
