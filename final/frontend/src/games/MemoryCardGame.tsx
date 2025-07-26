import { Button, message, Spin, Typography } from 'antd';
import { useAuth } from 'components';
import { shuffle } from 'es-toolkit';
import React, { useEffect, useState } from 'react';
import type { CardComponentProperties, CardType } from 'types/game';
import { fetchMemoryCards, incrementGameCountRequest } from 'utils/api/game';

const { Title, Paragraph } = Typography;

export const MemoryCardGame = (): React.JSX.Element => {
  const { token } = useAuth();
  const [cards, setCards] = useState<CardType[]>([]);
  const [firstChoice, setFirstChoice] = useState<CardType | undefined>();
  const [secondChoice, setSecondChoice] = useState<CardType | undefined>();
  const [disabled, setDisabled] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const initializeGame = async () => {
    setLoading(true);
    try {
      const result = await fetchMemoryCards();

      if (result.isErr()) {
        console.error('Failed to fetch memory cards:', result.error);
        message.error('Failed to load cards. Please try again later.');
        return;
      }

      const doubled = result.value.cards.flatMap((card, index) => [
        { card, id: index * 2, matched: false },
        { card, id: index * 2 + 1, matched: false },
      ]);

      setCards(shuffle(doubled));
      setFirstChoice(undefined);
      setSecondChoice(undefined);
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
          void incrementGameCountRequest(token, 'memory');
        }
      }, 500);
    }
  }, [token, cards, gameCompleted]);

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.card.text === secondChoice.card.text) {
        setCards(previous => previous.map(c => (c.card.text === firstChoice.card.text ? { ...c, matched: true } : c)));
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
    setFirstChoice(undefined);
    setSecondChoice(undefined);
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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-300 p-8 pt-28 text-center">
        <Spin size="large" />
        <Title
          level={1}
          className="mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm"
        >
          Loading...
        </Title>
        <Paragraph className="mb-10 text-xl font-medium text-gray-600">Getting your cards ready!</Paragraph>
      </div>
    );
  }

  if (gameWon) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-300 p-8 pt-28 text-center">
        <Title
          level={1}
          className="animate-celebration-bounce mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm"
        >
          Congratulations! 🎉
        </Title>
        <Paragraph className="mb-10 text-xl font-medium text-gray-600">You found all the matches!</Paragraph>
        <Button
          type="primary"
          size="large"
          onClick={() => void initializeGame()}
          className="mt-6 cursor-pointer rounded-xl border-none bg-gradient-to-r from-cyan-600 to-cyan-800 px-[30px] py-3 text-[1.1rem] font-semibold text-white shadow-lg shadow-cyan-600/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-600/60"
        >
          Start New Game
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-300 p-8 pt-28 text-center">
      <Title
        level={1}
        className="mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm"
      >
        Memory Card Game
      </Title>
      <Paragraph className="mb-10 text-xl font-medium text-gray-600">Flip & match the cards!</Paragraph>
      <div className="mx-auto my-8 grid [grid-template-columns:repeat(4,120px)] justify-center gap-[1.2rem] [perspective:1000px]">
        {grid}
      </div>
      <Button
        type="primary"
        size="large"
        onClick={() => void initializeGame()}
        className="mt-6 cursor-pointer rounded-xl border-none bg-gradient-to-r from-cyan-600 to-cyan-800 px-[30px] py-3 text-[1.1rem] font-semibold text-white shadow-lg shadow-cyan-600/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-600/60"
      >
        Start New Game
      </Button>
    </div>
  );
};

function Card({ card, flipped, handleChoice, disabled }: CardComponentProperties) {
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
        card.card.text
      )
    )
  );
}
