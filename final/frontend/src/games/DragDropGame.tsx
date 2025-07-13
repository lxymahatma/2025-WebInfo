import React, { useState, useRef, useEffect } from 'react';
import { GamePair } from '../types/drag-drop';
import { useGameTracker } from '../pages/GameTrackerContext';

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
    return await response.json();
  } catch (error) {
    console.error('Error fetching pairs:', error);
    return [];
  }
};

export default function DragDropGame(): React.JSX.Element {
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
    loadPairs();
  }, [difficulty]);

  // Track game completion
  useEffect(() => {
    const allSolved = Object.keys(solved).length === currentPairs.length && currentPairs.length > 0;
    if (allSolved && !gameCompleted) {
      setGameCompleted(true);
      incrementGameCount('dragdrop');
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

    if (draggedItem.match === zoneLabel) {
      setSolved(prev => ({ ...prev, [draggedId]: true }));
    } else {
      const target = e.currentTarget as HTMLElement;
      const origBg = target.style.backgroundColor;
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
    return <div className="drag-drop-root">Loading...</div>;
  }

  // Win screen with restart option
  if (allSolved) {
    return (
      <div className="drag-drop-root">
        <h2 className="drag-drop-heading">Congratulations! 🎉</h2>
        <p className="drag-drop-instructions">You matched all the items correctly!</p>
        <div className="difficulty-selector">
          <label>Difficulty: </label>
          {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
            <button
              key={key}
              onClick={() => changeDifficulty(key as DifficultyLevel)}
              className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
            >
              {level.name}
            </button>
          ))}
        </div>
        <button className="new-game-button" onClick={restartGame}>
          Start New Game
        </button>
      </div>
    );
  }

  return (
    <div className="drag-drop-root">
      <h2 className="drag-drop-heading">Drag & Drop Match Game</h2>
      <p className="drag-drop-instructions">Drag each emoji token into the correct category.</p>

      <div className="difficulty-selector">
        <label>Difficulty: </label>
        {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
          <button
            key={key}
            onClick={() => changeDifficulty(key as DifficultyLevel)}
            className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
          >
            {level.name}
          </button>
        ))}
      </div>

      <div className="drag-drop-choices-card">
        <h3 className="drag-drop-choices-title">Available Choices</h3>
        <div className="drag-drop-token-row">
          {currentPairs.map(({ id, label }: GamePair) => (
            <div
              key={id}
              draggable={!solved[id]}
              onDragStart={e => handleDragStart(e, id)}
              className={`drag-drop-token ${solved[id] ? 'inactive' : ''}`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      <div className="drag-drop-zone-grid">
        {zoneLabels.map((zoneLabel: string) => (
          <div
            key={zoneLabel}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, zoneLabel)}
            className="drag-drop-zone"
          >
            {zoneLabel}
          </div>
        ))}
      </div>
    </div>
  );
}
