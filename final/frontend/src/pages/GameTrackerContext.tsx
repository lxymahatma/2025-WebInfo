import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GameStats {
  dragdrop: number;
  timed: number;
  memory: number;
}

interface GameTrackerContextType {
  stats: GameStats;
  incrementGameCount: (gameType: keyof GameStats) => void;
  resetStats: () => void;
}

const GameTrackerContext = createContext<GameTrackerContextType | undefined>(undefined);

export const useGameTracker = () => {
  const context = useContext(GameTrackerContext);
  if (!context) {
    throw new Error('useGameTracker must be used within a GameTrackerProvider');
  }
  return context;
};

interface GameTrackerProviderProps {
  children: ReactNode;
}

export const GameTrackerProvider: React.FC<GameTrackerProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<GameStats>({
    dragdrop: 0,
    timed: 0,
    memory: 0,
  });

  // Load stats from localStorage on component mount
  useEffect(() => {
    const savedStats = localStorage.getItem('gameTrackerStats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
      } catch (error) {
        console.error('Error parsing saved stats:', error);
      }
    }
  }, []);

  // Save stats to localStorage whenever stats change
  useEffect(() => {
    localStorage.setItem('gameTrackerStats', JSON.stringify(stats));
  }, [stats]);

  const incrementGameCount = (gameType: keyof GameStats) => {
    setStats(prevStats => ({
      ...prevStats,
      [gameType]: prevStats[gameType] + 1,
    }));
  };

  const resetStats = () => {
    setStats({
      dragdrop: 0,
      timed: 0,
      memory: 0,
    });
  };

  const value = {
    stats,
    incrementGameCount,
    resetStats,
  };

  return <GameTrackerContext.Provider value={value}>{children}</GameTrackerContext.Provider>;
};
