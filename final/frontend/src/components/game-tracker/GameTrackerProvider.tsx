import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { useAuth } from 'components';
import type { GameStats, GameTrackerProviderProperties, GameStatsResponse, IncrementGameRequest } from 'types';
import { GameTrackerContext } from './GameTrackerContext';

function getToken() {
  return localStorage.getItem('token');
}

export const GameTrackerProvider: React.FC<GameTrackerProviderProperties> = ({ children }) => {
  const [stats, setStats] = useState<GameStats>({
    dragdrop: 0,
    timed: 0,
    memory: 0,
  });
  const { user } = useAuth();

  const fetchStats = useCallback(async () => {
    const token = getToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/game/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = (await response.json()) as GameStatsResponse;
        setStats(data.stats);
      } else {
        console.error('Failed to fetch game stats');
      }
    } catch (error) {
      console.error('Error fetching game stats:', error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      void fetchStats();
    } else {
      setStats({
        dragdrop: 0,
        timed: 0,
        memory: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const incrementGameCount = useCallback(async (gameType: keyof GameStats) => {
    const token = getToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/game/stats/increment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameType } as IncrementGameRequest),
      });

      if (response.ok) {
        const data = (await response.json()) as GameStatsResponse;
        setStats(data.stats);
      } else {
        console.error('Failed to increment game count');
      }
    } catch (error) {
      console.error('Error incrementing game count:', error);
    }
  }, []);

  const resetStats = useCallback(async () => {
    const token = getToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/game/stats/reset`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = (await response.json()) as GameStatsResponse;
        setStats(data.stats);
      } else {
        console.error('Failed to reset game stats');
      }
    } catch (error) {
      console.error('Error resetting game stats:', error);
    }
  }, []);

  const value = useMemo(
    () => ({
      stats,
      incrementGameCount,
      resetStats,
      fetchStats,
    }),
    [stats, incrementGameCount, resetStats, fetchStats]
  );

  return <GameTrackerContext value={value}>{children}</GameTrackerContext>;
};
