import React, { useState, useEffect } from 'react';

import { useGameTracker } from 'components';
import type { CardType, CardProps, MemoryCardsResponse } from 'types';

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

async function fetchRandomCards(): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:3001/memory/cards');
    const data = (await response.json()) as MemoryCardsResponse;

    if (data.cards) {
      return data.cards;
    } else {
      return ['Dog', 'Cat', 'Mouse', 'Hamster'];
    }
  } catch (error) {
    console.error('Error fetching cards from backend:', error);
    return ['Dog', 'Cat', 'Mouse', 'Hamster'];
  }
}

export const MemoryCardGame = (): React.JSX.Element => {
  const { incrementGameCount } = useGameTracker();
  const [cards, setCards] = useState<CardType[]>([]);
  const [firstChoice, setFirstChoice] = useState<CardType | null>(null);
  const [secondChoice, setSecondChoice] = useState<CardType | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize/reset game
  const initializeGame = async () => {
    setLoading(true);
    try {
      const fetchedCardTypes = await fetchRandomCards();

      const doubled = fetchedCardTypes.flatMap((type, idx) => [
        { type, id: idx * 2, matched: false },
        { type, id: idx * 2 + 1, matched: false },
      ]);
      setCards(shuffleArray(doubled));
      setFirstChoice(null);
      setSecondChoice(null);
      setDisabled(false);
      setGameWon(false);
      setGameCompleted(false);
    } catch (error) {
      console.error('Error initializing game:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void initializeGame();
  }, []);

  // Check for win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      // Wait before showing the win message
      setTimeout(() => {
        setGameWon(true);
        if (!gameCompleted) {
          setGameCompleted(true);
          void incrementGameCount('memory');
        }
      }, 500);
    }
  }, [cards, gameCompleted, incrementGameCount]);

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.type === secondChoice.type) {
        setCards(prev => prev.map(c => (c.type === firstChoice.type ? { ...c, matched: true } : c)));
        resetTurn();
      } else {
        setTimeout(resetTurn, 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  function handleChoice(card: CardType) {
    if (disabled || gameWon) return;
    // Prevent selecting the same card twice
    if (card === firstChoice) return;

    if (firstChoice) {
      setSecondChoice(card);
    } else {
      setFirstChoice(card);
    }
  }

  function resetTurn() {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  }

  const grid = cards.map(card =>
    React.createElement(Card, {
      key: card.id,
      card,
      flipped: card === firstChoice || card === secondChoice || card.matched,
      handleChoice,
      disabled: disabled || gameWon,
    })
  );

  if (loading) {
    return React.createElement(
      'div',
      { className: 'bg-gradient-to-br from-slate-50 to-slate-300 min-h-screen p-8 text-center' },
      React.createElement(
        'h1',
        {
          className:
            'bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent text-[2.5rem] font-extrabold mb-4 drop-shadow-sm',
        },
        'Loading...'
      ),
      React.createElement('p', { className: 'text-gray-600 text-xl font-medium mb-10' }, 'Getting your cards ready!')
    );
  }

  if (gameWon) {
    return React.createElement(
      'div',
      { className: 'bg-gradient-to-br from-slate-50 to-slate-300 min-h-screen p-8 text-center' },
      React.createElement(
        'h1',
        {
          className:
            'bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent text-[2.5rem] font-extrabold mb-4 drop-shadow-sm animate-celebration-bounce',
        },
        'Congratulations! 🎉'
      ),
      React.createElement('p', { className: 'text-gray-600 text-xl font-medium mb-10' }, 'You found all the matches!'),
      React.createElement(
        'button',
        {
          type: 'button',
          className:
            'bg-gradient-to-r from-cyan-600 to-cyan-800 border-none rounded-xl shadow-lg shadow-cyan-600/40 text-white cursor-pointer text-[1.1rem] font-semibold mt-6 px-[30px] py-3 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-600/60 hover:-translate-y-0.5',
          onClick: initializeGame,
        },
        'Start New Game'
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'bg-gradient-to-br from-slate-50 to-slate-300 min-h-screen p-8 text-center' },
    React.createElement(
      'h1',
      {
        className:
          'bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent text-[2.5rem] font-extrabold mb-4 drop-shadow-sm',
      },
      'Memory Card Game'
    ),
    React.createElement('p', { className: 'text-gray-600 text-xl font-medium mb-10' }, 'Flip & match the cards!'),
    React.createElement(
      'div',
      {
        className:
          'grid [grid-template-columns:repeat(4,120px)] gap-[1.2rem] justify-center mx-auto my-8 [perspective:1000px]',
      },
      ...grid
    ),
    React.createElement(
      'button',
      {
        type: 'button',
        className:
          'bg-gradient-to-r from-cyan-600 to-cyan-800 border-none rounded-xl shadow-lg shadow-cyan-600/40 text-white cursor-pointer text-[1.1rem] font-semibold mt-6 px-[30px] py-3 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-600/60 hover:-translate-y-0.5',
        onClick: initializeGame,
      },
      'Start New Game'
    )
  );
};

function Card({ card, flipped, handleChoice, disabled }: CardProps) {
  function onClick() {
    if (!flipped && !disabled) handleChoice(card);
  }
  const innerCls = flipped ? '[transform:rotateY(180deg)]' : '';
  const matchedCls = card.matched ? 'animate-match-pulse' : '';

  return React.createElement(
    'div',
    {
      className: `cursor-pointer [perspective:1000px] transition-transform duration-200 hover:scale-105 ${matchedCls}`,
      onClick,
    },
    React.createElement(
      'div',
      {
        className: `h-[160px] w-[120px] relative [transform-style:preserve-3d] transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${innerCls}`,
      },
      // FRONT SIDE (default): show the placeholder
      React.createElement(
        'div',
        {
          className:
            'absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-600 to-cyan-800 text-white font-semibold rounded-2xl shadow-lg shadow-black/15 [backface-visibility:hidden] transition-all duration-300 text-[2rem] hover:shadow-xl hover:shadow-cyan-600/30',
        },
        '?'
      ),
      // BACK SIDE (when flipped): show the animal name
      React.createElement(
        'div',
        {
          className:
            'absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-800 font-semibold rounded-2xl shadow-lg shadow-black/15 [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all duration-300 text-[1.4rem]',
        },
        card.type
      )
    )
  );
}
