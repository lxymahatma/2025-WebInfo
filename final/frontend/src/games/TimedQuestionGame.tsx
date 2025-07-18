import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Tag, Typography, Progress, Result } from 'antd';

import { useGameTracker } from 'components';
import type { Question, Subject, TimedQuestionsResponse } from 'types';

const { Title, Paragraph } = Typography;

export const TimedQuestionGame = (): React.JSX.Element => {
  const { incrementGameCount } = useGameTracker();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const currentQuestion = questions[currentQuestionIndex];

  const fetchQuestions = async (subject: Subject): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/timed/questions?subject=${subject}`);
      if (response.ok) {
        const data = (await response.json()) as TimedQuestionsResponse;
        setQuestions(data.questions);
      } else {
        console.error('Failed to fetch questions');
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleAnswer = (idx: number | null): void => {
      if (idx !== null && idx === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setTimeLeft(15);
          setSelectedOption(null);
          setIsAnswered(false);
        } else {
          setGameFinished(true);
          // Increment game count when quiz is completed
          void incrementGameCount('timed');
        }
      }, 1200);
    };

    if (timeLeft > 0 && !isAnswered && selectedSubject && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered && selectedSubject && questions.length > 0) {
      setIsAnswered(true);
      handleAnswer(null);
    }
  }, [
    timeLeft,
    isAnswered,
    selectedSubject,
    questions.length,
    currentQuestion,
    currentQuestionIndex,
    score,
    incrementGameCount,
  ]);

  const handleSubjectSelect = async (subject: Subject): Promise<void> => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setGameFinished(false);
    await fetchQuestions(subject);
  };

  const handleOptionClick = (idx: number): void => {
    if (!isAnswered) {
      setSelectedOption(idx);
      setIsAnswered(true);
      const handleAnswer = (answerIdx: number | null): void => {
        if (answerIdx !== null && answerIdx === currentQuestion.correctAnswer) {
          setScore(score + 1);
        }
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(15);
            setSelectedOption(null);
            setIsAnswered(false);
          } else {
            setGameFinished(true);
            // Increment game count when quiz is completed
            void incrementGameCount('timed');
          }
        }, 1200);
      };
      handleAnswer(idx);
    }
  };

  const resetGame = (): void => {
    setSelectedSubject(null);
    setQuestions([]);
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
    knowledge: 'Fun Facts',
  };

  // Subject selection screen
  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center font-sans">
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md w-full text-center rounded-2xl" variant="outlined">
            <Title level={2} className="mb-2">
              🎯 Quiz Time!
            </Title>
            <Paragraph className="text-lg mb-6">Choose your subject to start the quiz:</Paragraph>
            <Space direction="vertical" size="large" className="w-full">
              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                onClick={() => void handleSubjectSelect('math')}
              >
                🔢 Math
              </Button>
              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                onClick={() => void handleSubjectSelect('english')}
              >
                📚 English
              </Button>
              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                onClick={() => void handleSubjectSelect('knowledge')}
              >
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
    const percent = Math.round((score / questions.length) * 100);
    let status: 'success' | 'info' | 'warning' | 'error' = 'success';
    const title = '🎉 Great Job!';
    const subTitle = `Your Score: ${score.toString()} out of ${questions.length.toString()} (${percent.toString()}%)`;
    let extra = null;

    if (score === questions.length) {
      status = 'success';
      extra = <Paragraph>🌟 Perfect Score! Amazing! 🌟</Paragraph>;
    } else if (score >= questions.length * 0.8) {
      extra = <Paragraph>🎊 Excellent work! 🎊</Paragraph>;
    } else if (score >= questions.length * 0.6) {
      extra = <Paragraph>👍 Good job! 👍</Paragraph>;
    } else {
      status = 'info';
      extra = <Paragraph>💪 Keep practicing! 💪</Paragraph>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center font-sans">
        <div className="flex items-center justify-center min-h-[80vh]">
          <Result
            status={status}
            title={title}
            subTitle={subTitle}
            extra={[
              extra,
              <Space key="buttons" className="mt-4">
                <Button type="default" size="large" onClick={resetGame}>
                  Choose New Subject
                </Button>
                <Button type="primary" size="large" onClick={() => void handleSubjectSelect(selectedSubject)}>
                  Play Again
                </Button>
              </Space>,
            ]}
          />
        </div>
      </div>
    );
  }

  // Main quiz screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center font-sans">
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md w-full text-center rounded-2xl" variant="outlined">
            <Title level={3}>Loading questions...</Title>
          </Card>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 text-center font-sans">
        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-md w-full text-center rounded-2xl" variant="outlined">
            <Title level={3}>No questions available</Title>
            <Button type="primary" onClick={resetGame}>
              Back to Subject Selection
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Main quiz screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-4 text-center font-sans pt-20">
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="max-w-lg w-full rounded-2xl text-center py-2" variant="outlined">
          <Space direction="vertical" className="w-full" size="large">
            <div className="flex items-center justify-between mb-2">
              <Button type="text" onClick={resetGame} className="text-sm px-2 py-1">
                ← Back
              </Button>
              <div className="flex items-center gap-2">
                <Tag color="geekblue" className="text-base px-4 py-1.5">
                  {subjectNames[selectedSubject]}
                </Tag>
                <Tag color="gold" className="text-base">
                  ⏰ {timeLeft}s
                </Tag>
              </div>
              <div className="w-12"></div>
            </div>
            <Progress
              percent={((currentQuestionIndex + 1) / questions.length) * 100}
              showInfo={false}
              strokeColor="#0080a8"
              trailColor="#e6f7ff"
              className="mb-1"
            />
            <Paragraph strong className="text-lg mb-0">
              Question {currentQuestionIndex + 1} of {questions.length} | Score: {score}
            </Paragraph>
            <Title level={4} className="mb-0">
              {currentQuestion.question}
            </Title>
            <Space direction="vertical" size="middle" className="w-full">
              {currentQuestion.options.map((option: string, idx: number) => {
                let type: 'default' | 'primary' | 'dashed' | 'link' | 'text' = 'default';
                let danger = false;
                let buttonClass = 'font-medium text-lg';

                if (selectedOption === idx) {
                  type = idx === currentQuestion.correctAnswer ? 'primary' : 'default';
                  danger = idx !== currentQuestion.correctAnswer;
                  buttonClass += idx === currentQuestion.correctAnswer ? ' bg-green-50' : ' bg-red-50';
                } else if (isAnswered && idx === currentQuestion.correctAnswer) {
                  buttonClass += ' bg-green-50';
                }

                return (
                  <Button
                    key={`${currentQuestionIndex.toString()}-${option}`}
                    block
                    type={type}
                    danger={danger}
                    disabled={isAnswered}
                    size="large"
                    className={buttonClass}
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
};
