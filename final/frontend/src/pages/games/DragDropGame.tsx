import React, { useState, useRef, useEffect } from 'react';
import { GamePair } from '../../types/drag-drop';
import { useGameTracker } from '../GameTrackerContext';

const ALL_PAIRS: GamePair[] = [
  // Fruits
  { id: 'apple', label: '🍎 Apple', match: 'Fruit' },
  { id: 'banana', label: '🍌 Banana', match: 'Fruit' },
  { id: 'orange', label: '🍊 Orange', match: 'Fruit' },
  { id: 'grape', label: '🍇 Grape', match: 'Fruit' },
  { id: 'strawberry', label: '🍓 Strawberry', match: 'Fruit' },

  // Animals
  { id: 'dog', label: '🐶 Dog', match: 'Animal' },
  { id: 'cat', label: '🐱 Cat', match: 'Animal' },
  { id: 'elephant', label: '🐘 Elephant', match: 'Animal' },
  { id: 'lion', label: '🦁 Lion', match: 'Animal' },
  { id: 'rabbit', label: '🐇 Rabbit', match: 'Animal' },

  // Vehicles
  { id: 'car', label: '🚗 Car', match: 'Vehicle' },
  { id: 'bike', label: '🚲 Bike', match: 'Vehicle' },
  { id: 'airplane', label: '✈️ Airplane', match: 'Vehicle' },
  { id: 'train', label: '🚂 Train', match: 'Vehicle' },
  { id: 'boat', label: '🚤 Boat', match: 'Vehicle' },

  // Flowers
  { id: 'rose', label: '🌹 Rose', match: 'Flower' },
  { id: 'sunflower', label: '🌻 Sunflower', match: 'Flower' },
  { id: 'tulip', label: '🌷 Tulip', match: 'Flower' },
  { id: 'daisy', label: '🌼 Daisy', match: 'Flower' },
  { id: 'cherry_blossom', label: '🌸 Cherry Blossom', match: 'Flower' },

  // Food
  { id: 'pizza', label: '🍕 Pizza', match: 'Food' },
  { id: 'burger', label: '🍔 Burger', match: 'Food' },
  { id: 'cake', label: '🎂 Cake', match: 'Food' },
  { id: 'ice_cream', label: '🍦 Ice Cream', match: 'Food' },
  { id: 'donut', label: '🍩 Donut', match: 'Food' },

  // Sports
  { id: 'soccer', label: '⚽ Soccer Ball', match: 'Sport' },
  { id: 'basketball', label: '🏀 Basketball', match: 'Sport' },
  { id: 'tennis', label: '🎾 Tennis Ball', match: 'Sport' },
  { id: 'baseball', label: '⚾ Baseball', match: 'Sport' },
  { id: 'football', label: '🏈 Football', match: 'Sport' },
];

// Difficulty levels
const DIFFICULTY_LEVELS = {
  easy: { pairs: 6, name: 'Easy' },
  medium: { pairs: 8, name: 'Medium' },
  hard: { pairs: 12, name: 'Hard' },
} as const;

type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

// Function to get random pairs ensuring we have items from different categories
const getRandomPairs = (count: number = 8): GamePair[] => {
  const categories = Array.from(new Set(ALL_PAIRS.map(p => p.match)));
  const selectedPairs: GamePair[] = [];

  // Ensure we have at least one item from each category (up to the count limit)
  const itemsPerCategory = Math.max(1, Math.floor(count / categories.length));

  for (const category of categories) {
    const categoryPairs = ALL_PAIRS.filter(p => p.match === category);
    const shuffled = categoryPairs.sort(() => Math.random() - 0.5);
    selectedPairs.push(...shuffled.slice(0, itemsPerCategory));
  }

  // If we need more pairs to reach the count, add random ones
  if (selectedPairs.length < count) {
    const remaining = ALL_PAIRS.filter(p => !selectedPairs.find(sp => sp.id === p.id));
    const shuffledRemaining = remaining.sort(() => Math.random() - 0.5);
    selectedPairs.push(...shuffledRemaining.slice(0, count - selectedPairs.length));
  }

  // Shuffle the final selection
  return selectedPairs.sort(() => Math.random() - 0.5).slice(0, count);
};

export default function DragDropGame(): React.JSX.Element {
  const { incrementGameCount } = useGameTracker();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [currentPairs, setCurrentPairs] = useState<GamePair[]>([]);
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const dragItemRef = useRef<string | null>(null);

  // Initialize game with random pairs
  useEffect(() => {
    setCurrentPairs(getRandomPairs(DIFFICULTY_LEVELS[difficulty].pairs));
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

  const restartGame = (): void => {
    setSolved({});
    setGameCompleted(false);
    setCurrentPairs(getRandomPairs(DIFFICULTY_LEVELS[difficulty].pairs)); // Get new random pairs
  };

  const changeDifficulty = (newDifficulty: DifficultyLevel): void => {
    setDifficulty(newDifficulty);
    setSolved({});
    setGameCompleted(false);
  };

  const allSolved = Object.keys(solved).length === currentPairs.length;
  const zoneLabels = Array.from(new Set(currentPairs.map((p: GamePair) => p.match)));

  // Don't render anything until pairs are loaded
  if (currentPairs.length === 0) {
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
            {level.name} ({level.pairs} items)
          </button>
        ))}
      </div>

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
