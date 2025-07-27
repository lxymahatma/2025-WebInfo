import { Button, message, Spin, Typography } from 'antd';
import { MemoryCardView, useAuth } from 'components';
import { shuffle } from 'es-toolkit';
import React, { useEffect, useState } from 'react';
import type { CardType } from 'types/game';
import { fetchMemoryCards, incrementGameCountRequest } from 'utils/api/game';

const { Title } = Typography;

export const MemoryCardGame = (): React.JSX.Element => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);

  const [cards, setCards] = useState<CardType[]>([]);
  const [firstChoice, setFirstChoice] = useState<CardType>();
  const [secondChoice, setSecondChoice] = useState<CardType>();
  const [disabled, setDisabled] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const initializeGame = async () => {
    setLoading(true);
    try {
      const result = await fetchMemoryCards();

      if (result.isErr()) {
        console.error('Failed to fetch memory cards:', result.error);
        message.error('Failed to load cards. Please try again later.');
        return;
      }

      const doubledCards = result.value.cards.flatMap((card, index) => [
        { ...card, id: index * 2, matched: false },
        { ...card, id: index * 2 + 1, matched: false },
      ]);

      setCards(shuffle(doubledCards));
      setFirstChoice(undefined);
      setSecondChoice(undefined);
      setGameCompleted(false);
      setDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  const resetTurn = () => {
    setFirstChoice(undefined);
    setSecondChoice(undefined);
  };

  const handleChoice = (card: CardType) => {
    if (gameCompleted || card === firstChoice || disabled) return;

    if (firstChoice) {
      setSecondChoice(card);
    } else {
      setFirstChoice(card);
    }
  };

  useEffect(() => {
    void initializeGame();
  }, []);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setTimeout(() => {
        setGameCompleted(true);
        void incrementGameCountRequest(token, 'memory');
      }, 500);
    }
  }, [token, cards, gameCompleted]);

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);

      if (firstChoice.text === secondChoice.text) {
        setCards(previous => previous.map(c => (c.text === firstChoice.text ? { ...c, matched: true } : c)));
        resetTurn();
        setDisabled(false);
      } else {
        setTimeout(() => {
          resetTurn();
          setDisabled(false);
        }, 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-8 pt-28 text-center font-sans">
        <Spin size="large" />
        <Title
          level={1}
          className="mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm"
        >
          Loading...
        </Title>
        <div className="mb-4 text-xl font-medium text-gray-600">Getting your cards ready!</div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-8 pt-28 text-center font-sans">
        <Title
          level={1}
          className={`animate-celebration-bounce mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm`}
        >
          Congratulations! 🎉
        </Title>
        <div className="mb-4 text-xl font-medium text-gray-600">You found all the matches!</div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 pt-28 text-center font-sans">
      <Title
        level={1}
        className="mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm"
      >
        Memory Card Game
      </Title>
      <div className="mb-4 text-xl font-medium text-gray-600">Flip & match the cards!</div>
      <div className="mx-auto my-8 grid [grid-template-columns:repeat(4,120px)] justify-center gap-[1.2rem] [perspective:1000px]">
        {cards.map(card => (
          <MemoryCardView
            key={card.id}
            card={card}
            flipped={card === firstChoice || card === secondChoice || card.matched}
            handleChoice={handleChoice}
          />
        ))}
      </div>
    </div>
  );
};
