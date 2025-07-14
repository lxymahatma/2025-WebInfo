import React, { createContext, useContext, useState, useEffect } from 'react';

import { useAuth } from 'components';
import { GameStats, GameTrackerProviderProps, GameTrackerContextType } from 'types';

const GameTrackerContext = createContext<GameTrackerContextType | undefined>(undefined);

export const useGameTracker = () => {
  const context = useContext(GameTrackerContext);
  if (!context) {
    throw new Error('useGameTracker must be used within a GameTrackerProvider');
  }
  return context;
};

export const GameTrackerProvider: React.FC<GameTrackerProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<GameStats>({
    dragdrop: 0,
    timed: 0,
    memory: 0,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const fetchStats = async () => {
    const token = getToken();
    if (!token) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/game-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        console.error('Failed to fetch game stats');
      }
    } catch (error) {
      console.error('Error fetching game stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    } else {
      setStats({
        dragdrop: 0,
        timed: 0,
        memory: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const incrementGameCount = async (gameType: keyof GameStats) => {
    const token = getToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/game-stats/increment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameType }),
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        console.error('Failed to increment game count');
      }
    } catch (error) {
      console.error('Error incrementing game count:', error);
    }
  };

  const resetStats = async () => {
    const token = getToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/game-stats/reset`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        console.error('Failed to reset game stats');
      }
    } catch (error) {
      console.error('Error resetting game stats:', error);
    }
  };

  const value = {
    stats,
    loading,
    incrementGameCount,
    resetStats,
    fetchStats,
  };

  return <GameTrackerContext.Provider value={value}>{children}</GameTrackerContext.Provider>;
};
