import React, { useState, useEffect } from 'react';
import { CardType, CardProps } from './types/memory-card';

const cardTypes = ['Elephant', 'Lion', 'Cat', 'Car'];

// Add proper typing to shuffleArray function
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function MemoryCardGame() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [firstChoice, setFirstChoice] = useState<CardType | null>(null);
  const [secondChoice, setSecondChoice] = useState<CardType | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Initialize/reset game
  const initializeGame = () => {
    const doubled = cardTypes.flatMap((type, idx) => [
      { type, id: idx * 2, matched: false },
      { type, id: idx * 2 + 1, matched: false },
    ]);
    setCards(shuffleArray(doubled));
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
    setGameWon(false);
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
      }, 500);
    }
  }, [cards]);

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
          onClick: initializeGame
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
}

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
