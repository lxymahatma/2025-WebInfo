import React, { useState, useRef } from 'react';
import { GamePair } from './types/drag-drop';

const PAIRS: GamePair[] = [
  { id: 'apple', label: '🍎 Apple', match: 'Fruit' },
  { id: 'dog', label: '🐶 Dog', match: 'Animal' },
  { id: 'car', label: '🚗 Car', match: 'Vehicle' },
  { id: 'rose', label: '🌹 Rose', match: 'Flower' },
];

export default function DragDropGame(): React.JSX.Element {
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const dragItemRef = useRef<string | null>(null);

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
    const draggedItem = PAIRS.find(p => p.id === draggedId);

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
  };

  const allSolved = Object.keys(solved).length === PAIRS.length;
  const zoneLabels = Array.from(new Set(PAIRS.map(p => p.match)));

  // Win screen with restart option
  if (allSolved) {
    return (
      <div className="drag-drop-root">
        <h2 className="drag-drop-heading">Congratulations! 🎉</h2>
        <p className="drag-drop-instructions">You matched all the items correctly!</p>
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
      <div className="drag-drop-token-row">
        {PAIRS.map(({ id, label }) => (
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
        {zoneLabels.map(zoneLabel => (
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