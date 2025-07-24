import { createContext } from 'react';
import type { GameTrackerContextType } from 'types/game';

export const GameTrackerContext = createContext<GameTrackerContextType | undefined>(undefined);
