import { createContext } from 'react';
import type { GameTrackerContextType } from 'types';

export const GameTrackerContext = createContext<GameTrackerContextType | undefined>(undefined);
