import React, { useState, useEffect } from 'react';

import { useGameTracker } from 'components';
import type { CardType, CardProps } from 'types';

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

async function fetchRandomCards(): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:3001/memory/cards');
    const data = await response.json();

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
    initializeGame();
  }, []);

  // Check for win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      // Wait before showing the win message
      setTimeout(() => {
        setGameWon(true);
        if (!gameCompleted) {
          setGameCompleted(true);
          incrementGameCount('memory');
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
      { className: 'min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center' },
      React.createElement(
        'h1',
        {
          className:
            'text-4xl font-extrabold mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent drop-shadow-sm',
        },
        'Loading...'
      ),
      React.createElement('p', { className: 'text-gray-600 text-xl font-medium mb-10' }, 'Getting your cards ready!')
    );
  }

  if (gameWon) {
    return React.createElement(
      'div',
      { className: 'min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center' },
      React.createElement(
        'h1',
        {
          className:
            'text-4xl font-extrabold mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent drop-shadow-sm animate-bounce',
        },
        'Congratulations! 🎉'
      ),
      React.createElement('p', { className: 'text-gray-600 text-xl font-medium mb-10' }, 'You found all the matches!'),
      React.createElement(
        'button',
        {
          type: 'button',
          className:
            'bg-gradient-to-r from-cyan-600 to-cyan-800 border-none rounded-xl shadow-lg shadow-cyan-600/40 text-white cursor-pointer text-lg font-semibold mt-6 px-8 py-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5',
          onClick: initializeGame,
        },
        'Start New Game'
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center pt-20' },
    React.createElement(
      'h1',
      {
        className:
          'text-4xl font-extrabold mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent drop-shadow-sm',
      },
      'Memory Card Game'
    ),
    React.createElement('p', { className: 'text-gray-600 text-xl font-medium mb-10' }, 'Flip & match the cards!'),
    React.createElement(
      'div',
      { className: 'grid grid-cols-3 md:grid-cols-4 gap-5 justify-center mx-auto my-8 perspective-1000' },
      ...grid
    )
  );
};

function Card({ card, flipped, handleChoice, disabled }: CardProps) {
  function onClick() {
    if (!flipped && !disabled) handleChoice(card);
  }
  const innerCls = flipped ? 'transform rotate-y-180' : '';
  const matchedCls = card.matched ? 'animate-pulse' : '';

  return React.createElement(
    'div',
    {
      className: `cursor-pointer perspective-1000 transition-transform duration-200 hover:scale-105 ${matchedCls}`,
      onClick,
    },
    React.createElement(
      'div',
      {
        className: `h-32 md:h-40 w-24 md:w-30 relative transform-gpu transition-transform duration-600 cubic-bezier-0.4-0-0.2-1 preserve-3d ${innerCls}`,
      },
      // FRONT SIDE (default): show the placeholder
      React.createElement(
        'div',
        {
          className:
            'absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-600 to-cyan-800 text-white font-semibold rounded-2xl shadow-lg shadow-black/15 backface-hidden transition-all duration-300 text-3xl md:text-4xl hover:shadow-xl hover:shadow-cyan-600/30',
        },
        '?'
      ),
      // BACK SIDE (when flipped): show the animal name
      React.createElement(
        'div',
        {
          className:
            'absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-800 font-semibold rounded-2xl shadow-lg shadow-black/15 backface-hidden transform rotate-y-180 transition-all duration-300 text-lg md:text-xl',
        },
        card.type
      )
    )
  );
}
