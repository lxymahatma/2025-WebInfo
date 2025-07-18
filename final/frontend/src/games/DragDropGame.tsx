import React, { useState, useRef, useEffect } from 'react';

import { useGameTracker } from 'components';
import type { GamePair } from 'types';

const DIFFICULTY_LEVELS = {
  easy: { name: 'Easy' },
  medium: { name: 'Medium' },
  hard: { name: 'Hard' },
} as const;

type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

const fetchPairs = async (difficulty: DifficultyLevel): Promise<GamePair[]> => {
  try {
    const response = await fetch(`http://localhost:3001/dragdrop/pairs?difficulty=${difficulty}`);
    if (!response.ok) {
      throw new Error('Failed to fetch pairs');
    }
    return (await response.json()) as GamePair[];
  } catch (error) {
    console.error('Error fetching pairs:', error);
    return [];
  }
};

export const DragDropGame = (): React.JSX.Element => {
  const { incrementGameCount } = useGameTracker();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [currentPairs, setCurrentPairs] = useState<GamePair[]>([]);
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dragItemRef = useRef<string | null>(null);

  useEffect(() => {
    const loadPairs = async () => {
      setLoading(true);
      const pairs = await fetchPairs(difficulty);
      setCurrentPairs(pairs);
      setLoading(false);
    };
    void loadPairs();
  }, [difficulty]);

  // Track game completion
  useEffect(() => {
    const allSolved = Object.keys(solved).length === currentPairs.length && currentPairs.length > 0;
    if (allSolved && !gameCompleted) {
      setGameCompleted(true);
      void incrementGameCount('dragdrop');
    }
  }, [solved, currentPairs, gameCompleted, incrementGameCount]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string): void => {
    dragItemRef.current = id;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, zoneLabel: string): void => {
    e.preventDefault();
    const draggedId = dragItemRef.current;
    const draggedItem = currentPairs.find((p: GamePair) => p.id === draggedId);

    if (!draggedItem || !draggedId) return;

    const target = e.currentTarget as HTMLElement;
    const origBg = target.style.backgroundColor;

    if (draggedItem.match === zoneLabel) {
      setSolved(prev => ({ ...prev, [draggedId]: true }));
      // Green blink for correct drop
      target.style.backgroundColor = '#e0ffe0';
      setTimeout(() => {
        target.style.backgroundColor = origBg;
      }, 500);
    } else {
      // Red blink for incorrect drop
      target.style.backgroundColor = '#ffe0e0';
      setTimeout(() => {
        target.style.backgroundColor = origBg;
      }, 500);
    }
    dragItemRef.current = null;
  };

  const restartGame = async (): Promise<void> => {
    setSolved({});
    setGameCompleted(false);
    setLoading(true);
    const pairs = await fetchPairs(difficulty);
    setCurrentPairs(pairs);
    setLoading(false);
  };

  const changeDifficulty = (newDifficulty: DifficultyLevel): void => {
    setDifficulty(newDifficulty);
    setSolved({});
    setGameCompleted(false);
  };

  const allSolved = Object.keys(solved).length === currentPairs.length;
  const zoneLabels = Array.from(new Set(currentPairs.map((p: GamePair) => p.match)));

  // Don't render anything until pairs are loaded
  if (loading || currentPairs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex flex-col items-center justify-center gap-6 mx-auto p-8 text-center w-full font-sans">
        Loading...
      </div>
    );
  }

  // Win screen with restart option
  if (allSolved) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex flex-col items-center justify-center gap-6 mx-auto p-8 text-center w-full font-sans">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent drop-shadow-sm">
          Congratulations! 🎉
        </h2>
        <p className="text-gray-600 text-lg font-medium mb-4 text-center">You matched all the items correctly!</p>
        <div className="flex items-center gap-3 justify-center mb-6">
          <label className="text-gray-700 font-semibold mr-2">Difficulty: </label>
          {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
            <button
              key={key}
              type="button"
              onClick={() => changeDifficulty(key as DifficultyLevel)}
              className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-300 hover:bg-gray-200 hover:border-cyan-600 hover:-translate-y-px ${
                difficulty === key
                  ? 'bg-gradient-to-br from-cyan-600 to-cyan-800 border-cyan-600 text-white shadow-lg shadow-cyan-600/30 -translate-y-px'
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-700'
              }`}
            >
              {level.name}
            </button>
          ))}
        </div>
        <button
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          type="button"
          onClick={() => void restartGame()}
        >
          Start New Game
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex flex-col items-center gap-6 mx-auto p-4 md:p-8 text-center w-full font-sans pt-20">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent drop-shadow-sm">
        Drag & Drop Match Game
      </h2>
      <p className="text-gray-600 text-lg font-medium mb-4 text-center">
        Drag each emoji token into the correct category.
      </p>

      <div className="flex items-center gap-3 justify-center mb-6">
        <label className="text-gray-700 font-semibold mr-2">Difficulty: </label>
        {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
          <button
            key={key}
            type="button"
            onClick={() => changeDifficulty(key as DifficultyLevel)}
            className={`px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-300 hover:bg-gray-200 hover:border-cyan-600 hover:-translate-y-px ${
              difficulty === key
                ? 'bg-gradient-to-br from-cyan-600 to-cyan-800 border-cyan-600 text-white shadow-lg shadow-cyan-600/30 -translate-y-px'
                : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-700'
            }`}
          >
            {level.name}
          </button>
        ))}
      </div>

      <div className="bg-white border-2 border-gray-200 rounded-xl shadow-lg p-5 mb-8 mx-auto max-w-4xl w-full text-center">
        <h3 className="text-gray-700 text-xl font-semibold mb-4 text-center">Available Choices</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 justify-items-center">
          {currentPairs.map(({ id, label }: GamePair) => {
            // Split the label into emoji and text
            const parts = label.split(' ');
            const emoji = parts[0];
            const text = parts.slice(1).join(' ');

            return (
              <div
                key={id}
                draggable={!solved[id]}
                onDragStart={e => handleDragStart(e, id)}
                className={`flex flex-col items-center justify-center rounded-2xl font-semibold gap-1 h-20 md:h-20 text-center transition-all duration-300 w-20 md:w-25 ${
                  solved[id]
                    ? 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-md cursor-default opacity-60 scale-95'
                    : 'bg-gradient-to-br from-cyan-600 to-cyan-800 shadow-lg shadow-cyan-600/30 text-white cursor-grab hover:shadow-xl hover:-translate-y-0.5 hover:scale-105 active:scale-95 active:cursor-grabbing'
                }`}
              >
                <div className="text-xl md:text-2xl leading-none">{emoji}</div>
                <div className="text-xs md:text-sm font-medium leading-tight">{text}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 justify-center w-full max-w-md">
        {zoneLabels.map((zoneLabel: string) => (
          <div
            key={zoneLabel}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, zoneLabel)}
            className="flex items-center justify-center bg-white border-3 border-dashed border-cyan-600 rounded-2xl shadow-lg text-cyan-600 text-xl font-semibold min-h-20 transition-all duration-300 hover:bg-blue-50 hover:border-cyan-800 hover:shadow-xl hover:-translate-y-0.5"
          >
            {zoneLabel}
          </div>
        ))}
      </div>
    </div>
  );
};
