import React, { useState, useEffect } from 'react';

import { useGameTracker } from '../pages';
import type { CardType, CardProps } from '../types';

import './MemoryCardGame.css';

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

    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
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
      { className: 'memory-game-container' },
      React.createElement('h1', { className: 'memory-game-title' }, 'Loading...'),
      React.createElement('p', { className: 'memory-game-instructions' }, 'Getting your cards ready!')
    );
  }

  if (gameWon) {
    return React.createElement(
      'div',
      { className: 'memory-game-container' },
      React.createElement('h1', { className: 'memory-game-title' }, 'Congratulations! 🎉'),
      React.createElement('p', { className: 'memory-game-instructions' }, 'You found all the matches!'),
      React.createElement(
        'button',
        {
          className: 'new-game-button',
          onClick: initializeGame,
        },
        'Start New Game'
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'memory-game-container' },
    React.createElement('h1', { className: 'memory-game-title' }, 'Memory Card Game'),
    React.createElement('p', { className: 'memory-game-instructions' }, 'Flip & match the cards!'),
    React.createElement('div', { className: 'card-grid' }, ...grid)
  );
};

function Card({ card, flipped, handleChoice, disabled }: CardProps) {
  function onClick() {
    if (!flipped && !disabled) handleChoice(card);
  }
  const innerCls = flipped ? 'flipped' : '';
  const cardTypeCls = `card-${card.type.toLowerCase()}`;

  return React.createElement(
    'div',
    { className: `card ${card.matched ? 'matched' : ''}`, onClick },
    React.createElement(
      'div',
      { className: innerCls },
      // FRONT SIDE (default): show the placeholder
      React.createElement('div', { className: 'card-front-text' }, '?'),
      // BACK SIDE (when flipped): show the animal name
      React.createElement('div', { className: `card-back-text ${cardTypeCls}` }, card.type)
    )
  );
}
