import React, { useState, useEffect } from "react";
import "./App.css";

const cardTypes = ["Elephant", "Lion", "Cat", "Car"];

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function MemoryCardGame() {
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const doubled = cardTypes.flatMap((type, idx) => [
      { type, id: idx * 2, matched: false },
      { type, id: idx * 2 + 1, matched: false },
    ]);
    setCards(shuffleArray(doubled));
  }, []);

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.type === secondChoice.type) {
        setCards((prev) =>
          prev.map((c) => (c.type === firstChoice.type ? { ...c, matched: true } : c))
        );
        resetTurn();
      } else {
        setTimeout(resetTurn, 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  function handleChoice(card) {
    if (disabled) return;
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  }

  function resetTurn() {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  }

  const grid = cards.map((card) =>
    React.createElement(Card, {
      key: card.id,
      card,
      flipped: card === firstChoice || card === secondChoice || card.matched,
      handleChoice,
      disabled,
    })
  );

  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, "Memory Card Game"),
    React.createElement("p", null, "Flip & match the cards!"),
    React.createElement("div", { className: "card-grid" }, ...grid)
  );
}

function Card({ card, flipped, handleChoice, disabled }) {
  function onClick() {
    if (!flipped && !disabled) handleChoice(card);
  }
  const innerCls = flipped ? "flipped" : "";

  return React.createElement(
    "div",
    { className: "card", onClick },
    React.createElement(
      "div",
      { className: innerCls },
      // FRONT SIDE: show the text label
      React.createElement("div", { className: "card-front-text" }, card.type),
      // BACK SIDE: show a simple placeholder
      React.createElement("div", { className: "card-back-text" }, "?")
    )
  );
}
