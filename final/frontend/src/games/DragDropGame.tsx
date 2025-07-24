import { Button, Space, Spin,Typography } from 'antd';
import { useGameTracker } from 'components';
import React, { useEffect,useRef, useState } from 'react';
import type { GamePair } from 'types';

const { Title, Paragraph } = Typography;

const DIFFICULTY_LEVELS = {
  easy: { name: 'Easy' },
  medium: { name: 'Medium' },
  hard: { name: 'Hard' },
} as const;

type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

const fetchPairs = async (difficulty: DifficultyLevel): Promise<GamePair[]> => {
  try {
    const response = await fetch(`http://localhost:3001/game/dragdrop/pairs?difficulty=${difficulty}`);
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
  const dragItemReference = useRef<string>('');

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

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, id: string): void => {
    dragItemReference.current = id;
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, zoneLabel: string): void => {
    event.preventDefault();
    const draggedId = dragItemReference.current;
    const draggedItem = currentPairs.find((p: GamePair) => p.id === draggedId);

    if (!draggedItem || !draggedId) return;

    const target = event.currentTarget as HTMLElement;
    const origBg = target.style.backgroundColor;

    if (draggedItem.match === zoneLabel) {
      setSolved(previous => ({ ...previous, [draggedId]: true }));
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
    dragItemReference.current = '';
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
  const zoneLabels = [...new Set(currentPairs.map((p: GamePair) => p.match))];

  // Don't render anything until pairs are loaded
  if (loading || currentPairs.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center font-sans">
        <Spin size="large" />
        <Paragraph>Loading...</Paragraph>
      </div>
    );
  }

  // Win screen with restart option
  if (allSolved) {
    return (
      <div className="mx-auto flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center font-sans">
        <Title
          level={2}
          className="mb-2 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-3xl font-extrabold text-transparent drop-shadow-sm md:text-4xl"
        >
          Congratulations! 🎉
        </Title>
        <Paragraph className="mb-4 text-center text-lg font-medium text-gray-600">
          You matched all the items correctly!
        </Paragraph>
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="mr-2 font-semibold text-gray-700">Difficulty: </span>
          <Space>
            {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
              <Button
                key={key}
                type={difficulty === key ? 'primary' : 'default'}
                onClick={() => changeDifficulty(key as DifficultyLevel)}
                className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-px hover:border-cyan-600 ${
                  difficulty === key
                    ? '-translate-y-px border-cyan-600 bg-gradient-to-br from-cyan-600 to-cyan-800 text-white shadow-lg shadow-cyan-600/30'
                    : 'border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
                }`}
              >
                {level.name}
              </Button>
            ))}
          </Space>
        </div>
        <Button
          type="primary"
          size="large"
          onClick={() => void restartGame()}
          className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          Start New Game
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full flex-col items-center gap-6 bg-gradient-to-br from-slate-100 to-slate-300 p-4 pt-20 text-center font-sans md:p-8">
      <Title
        level={2}
        className="mb-2 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-3xl font-extrabold text-transparent drop-shadow-sm md:text-4xl"
      >
        Drag & Drop Match Game
      </Title>
      <Paragraph className="mb-4 text-center text-lg font-medium text-gray-600">
        Drag each emoji token into the correct category.
      </Paragraph>

      <div className="mb-6 flex items-center justify-center gap-3">
        <span className="mr-2 font-semibold text-gray-700">Difficulty: </span>
        <Space>
          {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
            <Button
              key={key}
              type={difficulty === key ? 'primary' : 'default'}
              onClick={() => changeDifficulty(key as DifficultyLevel)}
              className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-px hover:border-cyan-600 ${
                difficulty === key
                  ? '-translate-y-px border-cyan-600 bg-gradient-to-br from-cyan-600 to-cyan-800 text-white shadow-lg shadow-cyan-600/30'
                  : 'border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700'
              }`}
            >
              {level.name}
            </Button>
          ))}
        </Space>
      </div>

      <div className="mx-auto mb-8 w-full max-w-4xl rounded-xl border-2 border-gray-200 bg-white p-5 text-center shadow-lg">
        <h3 className="mb-4 text-center text-xl font-semibold text-gray-700">Available Choices</h3>
        <div className="grid grid-cols-3 justify-items-center gap-4 md:grid-cols-6">
          {currentPairs.map(({ id, label }: GamePair) => {
            // Split the label into emoji and text
            const parts = label.split(' ');
            const emoji = parts[0];
            const text = parts.slice(1).join(' ');

            return (
              <div
                key={id}
                draggable={!solved[id]}
                onDragStart={event => handleDragStart(event, id)}
                className={`flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl text-center font-semibold transition-all duration-300 md:h-20 md:w-25 ${
                  solved[id]
                    ? 'scale-95 cursor-default bg-gradient-to-br from-gray-400 to-gray-600 opacity-60 shadow-md'
                    : 'cursor-grab bg-gradient-to-br from-cyan-600 to-cyan-800 text-white shadow-lg shadow-cyan-600/30 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl active:scale-95 active:cursor-grabbing'
                }`}
              >
                <div className="text-xl leading-none md:text-2xl">{emoji}</div>
                <div className="text-xs leading-tight font-medium md:text-sm">{text}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid w-full max-w-md grid-cols-1 justify-center gap-5 md:grid-cols-2">
        {zoneLabels.map((zoneLabel: string) => (
          <div
            key={zoneLabel}
            onDragOver={handleDragOver}
            onDrop={event => handleDrop(event, zoneLabel)}
            className="flex min-h-20 items-center justify-center rounded-2xl border-3 border-dashed border-cyan-600 bg-white text-xl font-semibold text-cyan-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-800 hover:bg-blue-50 hover:shadow-xl"
          >
            {zoneLabel}
          </div>
        ))}
      </div>
    </div>
  );
};
