import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Tag, Typography, Progress, Result } from 'antd';
import { useGameTracker } from './GameTrackerContext';

const { Title, Paragraph } = Typography;

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

type Subject = 'math' | 'english' | 'knowledge';

const questionsBySubject: Record<Subject, Question[]> = {

  math: [
    { question: "What is 2 + 3?", options: ['4', '5', '6', '7'], correctAnswer: 1 },
    { question: "What is 10 - 4?", options: ['5', '6', '7', '8'], correctAnswer: 1 },
    { question: "How many sides does a triangle have?", options: ['2', '3', '4', '5'], correctAnswer: 1 },
    { question: "What is 3 × 2?", options: ['4', '5', '6', '7'], correctAnswer: 2 },
    { question: "What comes after the number 9?", options: ['8', '10', '11', '12'], correctAnswer: 1 }
  ],
  english: [
    { question: "Which letter comes after 'B'?", options: ['A', 'C', 'D', 'E'], correctAnswer: 1 },
    { question: "What sound does a cat make?", options: ['Woof', 'Meow', 'Moo', 'Oink'], correctAnswer: 1 },
    { question: "How many letters are in the word 'CAT'?", options: ['2', '3', '4', '5'], correctAnswer: 1 },
    { question: "Which word rhymes with 'hat'?", options: ['dog', 'cat', 'sun', 'tree'], correctAnswer: 1 },
    { question: "What is the first letter of the alphabet?", options: ['B', 'A', 'C', 'D'], correctAnswer: 1 }
  ],
  knowledge: [
    { question: "What color do you get when you mix red and yellow?", options: ['Purple', 'Orange', 'Green', 'Blue'], correctAnswer: 1 },
    { question: "How many legs does a dog have?", options: ['2', '3', '4', '5'], correctAnswer: 2 },
    { question: "What do bees make?", options: ['Milk', 'Honey', 'Cheese', 'Bread'], correctAnswer: 1 },
    { question: "Which season comes after winter?", options: ['Summer', 'Spring', 'Fall', 'Winter'], correctAnswer: 1 },
    { question: "What do we use to brush our teeth?", options: ['Fork', 'Toothbrush', 'Spoon', 'Comb'], correctAnswer: 1 }
  ]
};

export default function TimedQuestionGame(): React.JSX.Element {
  const { incrementGameCount } = useGameTracker();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const currentQuestions = selectedSubject ? questionsBySubject[selectedSubject] : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && selectedSubject) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered && selectedSubject) {
      setIsAnswered(true);
      handleAnswer(null);
    }
  }, [timeLeft, isAnswered, selectedSubject]);

  const handleSubjectSelect = (subject: Subject): void => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setGameFinished(false);
  };

  const handleAnswer = (idx: number | null): void => {
    if (idx !== null && idx === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTimeLeft(15);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setGameFinished(true);
        // Increment game count when quiz is completed
        incrementGameCount('timed');
      }
    }, 1200);
  };

  const handleOptionClick = (idx: number): void => {
    if (!isAnswered) {
      setSelectedOption(idx);
      setIsAnswered(true);
      handleAnswer(idx);
    }
  };

  const resetGame = (): void => {
    setSelectedSubject(null);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setGameFinished(false);
  };

  const subjectNames = {
    math: 'Math',
    english: 'English', 
    knowledge: 'Fun Facts'
  };

  // Subject selection screen
  if (!selectedSubject) {
    return (
      <div className="timed-question-container">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <Card
            style={{ maxWidth: 400, width: "100%", textAlign: "center", borderRadius: 16 }}
            bordered
          >
            <Title level={2} style={{ marginBottom: 8 }}>🎯 Quiz Time!</Title>
            <Paragraph style={{ fontSize: 18, marginBottom: 24 }}>Choose your subject to start the quiz:</Paragraph>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Button type="primary" block size="large" onClick={() => handleSubjectSelect('math')}>
                🔢 Math
              </Button>
              <Button type="primary" block size="large" onClick={() => handleSubjectSelect('english')}>
                📚 English
              </Button>
              <Button type="primary" block size="large" onClick={() => handleSubjectSelect('knowledge')}>
                🌟 Fun Facts
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    // Show result using Ant Design's Result component
    const percent = Math.round((score / currentQuestions.length) * 100);
    let status = "success";
    let title = "🎉 Great Job!";
    let subTitle = `Your Score: ${score} out of ${currentQuestions.length} (${percent}%)`;
    let extra = null;

    if (score === currentQuestions.length) {
      status = "success";
      extra = <Paragraph>🌟 Perfect Score! Amazing! 🌟</Paragraph>;
    } else if (score >= currentQuestions.length * 0.8) {
      extra = <Paragraph>🎊 Excellent work! 🎊</Paragraph>;
    } else if (score >= currentQuestions.length * 0.6) {
      extra = <Paragraph>👍 Good job! 👍</Paragraph>;
    } else {
      status = "info";
      extra = <Paragraph>💪 Keep practicing! 💪</Paragraph>;
    }

    return (
      <div className="timed-question-container">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
          <Result
            status={status as any}
            title={title}
            subTitle={subTitle}
            extra={[
              extra,
              <Space key="buttons" style={{ marginTop: 16 }}>
                <Button type="default" size="large" onClick={resetGame}>
                  Choose New Subject
                </Button>
                <Button type="primary" size="large" onClick={() => handleSubjectSelect(selectedSubject)}>
                  Play Again
                </Button>
              </Space>
            ]}
          />
        </div>
      </div>
    );
  }

  // Main quiz screen
  return (
    <div className="timed-question-container">
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh"
      }}>
        <Card
          style={{
            maxWidth: 480, width: "100%", borderRadius: 16, textAlign: "center", padding: "8px 0"
          }}
          bordered
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <Tag color="geekblue" style={{ fontSize: 16, padding: "6px 16px" }}>
                {subjectNames[selectedSubject]}
              </Tag>
              <Tag color="gold" style={{ fontSize: 16 }}>
                ⏰ {timeLeft}s
              </Tag>
            </div>
            <Progress
              percent={((currentQuestionIndex + 1) / currentQuestions.length) * 100}
              showInfo={false}
              strokeColor="#0080a8"
              trailColor="#e6f7ff"
              style={{ marginBottom: 4 }}
            />
            <Paragraph strong style={{ fontSize: 17, marginBottom: 0 }}>
              Question {currentQuestionIndex + 1} of {currentQuestions.length} | Score: {score}
            </Paragraph>
            <Title level={4} style={{ marginBottom: 0 }}>{currentQuestion.question}</Title>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {currentQuestion.options.map((option: string, idx: number) => {
                let type: "default" | "primary" | "dashed" | "link" | "text" = "default";
                let danger = false;
                let style: React.CSSProperties = { fontWeight: 500, fontSize: 18 };
                if (selectedOption === idx) {
                  type = idx === currentQuestion.correctAnswer ? "primary" : "default";
                  danger = idx !== currentQuestion.correctAnswer;
                  style = { ...style, background: idx === currentQuestion.correctAnswer ? "#e8ffe6" : "#fff1f0" };
                } else if (isAnswered && idx === currentQuestion.correctAnswer) {
                  style = { ...style, background: "#e8ffe6" };
                }
                return (
                  <Button
                    key={idx}
                    block
                    type={type}
                    danger={danger}
                    disabled={isAnswered}
                    size="large"
                    style={style}
                    onClick={() => handleOptionClick(idx)}
                  >
                    {option}
                  </Button>
                );
              })}
            </Space>
          </Space>
        </Card>
      </div>
    </div>
  );
}
