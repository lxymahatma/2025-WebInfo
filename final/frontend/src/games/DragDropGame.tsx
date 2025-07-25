import type { DragDropPair } from '@eduplayground/shared/game';
import { Button, Space, Spin, Typography } from 'antd';
import { useAuth } from 'components/auth';
import { shuffle } from 'es-toolkit';
import type { DragEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import { fetchDragDropPairsRequest, incrementGameCountRequest } from 'utils/api/game';

const { Title, Paragraph } = Typography;

const DIFFICULTY_LEVELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
} as const;

type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

export const DragDropGame = (): React.JSX.Element => {
  const { token } = useAuth();
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [pairs, setPairs] = useState<DragDropPair[]>([]);
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const dragReference = useRef<string>('');

  const loadPairs = async (level: DifficultyLevel) => {
    setLoading(true);
    const data = await fetchDragDropPairsRequest(level);
    if (data) {
      setPairs(data.pairs);
      setCategories(shuffle([...new Set(data.pairs.map(p => p.category))]));
    } else {
      console.error('Failed to load pairs');
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadPairs(difficulty);
  }, [difficulty]);

  useEffect(() => {
    const allSolved = Object.keys(solved).length === pairs.length && pairs.length > 0;
    if (allSolved && !completed) {
      setCompleted(true);
      if (!token) {
        return;
      }
      void incrementGameCountRequest(token, 'dragdrop');
    }
  }, [token, solved, pairs, completed]);

  const onDragStart = (event: DragEvent<HTMLDivElement>, id: string) => {
    dragReference.current = id;
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: DragEvent<HTMLDivElement>, category: string) => {
    event.preventDefault();
    const id = dragReference.current;
    const item = pairs.find(p => p.id === id);
    if (!item) return;

    const target = event.currentTarget as HTMLElement;
    const originalColor = target.style.backgroundColor;

    target.style.backgroundColor = item.category === category ? '#e0ffe0' : '#ffe0e0';
    if (item.category === category) setSolved(previous => ({ ...previous, [id]: true }));

    setTimeout(() => {
      target.style.backgroundColor = originalColor;
    }, 500);

    dragReference.current = '';
  };

  const restart = () => {
    setSolved({});
    setCompleted(false);
    void loadPairs(difficulty);
  };

  const changeDifficulty = (level: DifficultyLevel) => {
    setDifficulty(level);
    setSolved({});
    setCompleted(false);
  };

  const isSolvedAll = Object.keys(solved).length === pairs.length;

  const renderDifficultyButtons = () => (
    <div className="mb-6 flex items-center justify-center gap-3">
      <span className="mr-2 font-semibold text-gray-700">Difficulty: </span>
      <Space>
        {Object.entries(DIFFICULTY_LEVELS).map(([key, label]) => (
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
            {label}
          </Button>
        ))}
      </Space>
    </div>
  );

  if (loading || pairs.length === 0) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center">
        <Spin size="large" />
        <Paragraph>Loading...</Paragraph>
      </div>
    );
  }

  if (isSolvedAll) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center">
        <Title
          level={2}
          className="bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl"
        >
          Congratulations! 🎉
        </Title>
        <Paragraph className="text-lg font-medium text-gray-600">You matched all the items correctly!</Paragraph>
        {renderDifficultyButtons()}
        <Button
          type="primary"
          size="large"
          onClick={restart}
          className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          Start New Game
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-6 bg-gradient-to-br from-slate-100 to-slate-300 p-4 pt-20 md:p-8">
      <Title
        level={2}
        className="bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl"
      >
        Drag & Drop Match Game
      </Title>
      <Paragraph className="text-lg font-medium text-gray-600">
        Drag each emoji token into the correct category.
      </Paragraph>

      {renderDifficultyButtons()}

      <div className="w-full max-w-4xl rounded-xl border-2 border-gray-200 bg-white p-5 text-center shadow-lg">
        <h3 className="mb-4 text-xl font-semibold text-gray-700">Available Choices</h3>
        <div className="grid grid-cols-3 justify-items-center gap-4 md:grid-cols-6">
          {pairs.map(({ id, label }) => {
            const [emoji, ...textParts] = label.split(' ');
            return (
              <div
                key={id}
                draggable={!solved[id]}
                onDragStart={event => onDragStart(event, id)}
                className={`flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl text-center font-semibold transition-all duration-300 md:w-25 ${
                  solved[id]
                    ? 'scale-95 cursor-default bg-gradient-to-br from-gray-400 to-gray-600 opacity-60 shadow-md'
                    : 'cursor-grab bg-gradient-to-br from-cyan-600 to-cyan-800 text-white shadow-lg shadow-cyan-600/30 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl active:scale-95 active:cursor-grabbing'
                }`}
              >
                <div className="text-xl leading-none md:text-2xl">{emoji}</div>
                <div className="text-xs leading-tight font-medium md:text-sm">{textParts.join(' ')}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid w-full max-w-md grid-cols-1 gap-5 md:grid-cols-2">
        {categories.map(category => (
          <div
            key={category}
            onDragOver={onDragOver}
            onDrop={event => onDrop(event, category)}
            className="flex min-h-20 items-center justify-center rounded-2xl border-3 border-dashed border-cyan-600 bg-white text-xl font-semibold text-cyan-600 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-800 hover:bg-blue-50 hover:shadow-xl"
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};
