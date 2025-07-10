import React, { useState, useEffect } from "react";

interface TimedQuestionGameProps {
  question: string;
  options: string[];
  onAnswer: (idx: number | null) => void;
}

export default function TimedQuestionGame({
  question,
  options,
  onAnswer,
}: TimedQuestionGameProps): React.JSX.Element {
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      setIsAnswered(true);
      onAnswer(null);
    }
  }, [timeLeft, isAnswered, onAnswer]);

  const handleOptionClick = (idx: number): void => {
    if (!isAnswered) {
      setSelectedOption(idx);
      setIsAnswered(true);
      onAnswer(idx);
    }
  };

  return (
    <div className="timed-question-container">
      <div className="timed-question-timer">⏰ {timeLeft}s</div>
      <h3 className="timed-question-question">{question}</h3>
      <div className="timed-question-options">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(idx)}
            disabled={isAnswered}
            className={`timed-question-option ${selectedOption === idx ? "selected" : ""}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
