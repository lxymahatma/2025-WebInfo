import type { Subject, TimedQuizQuestion } from '@eduplayground/shared/types/game';
import { Button, Card, message, Progress, Result, Space, Tag, Typography } from 'antd';
import { useAuth } from 'components/auth';
import React, { useEffect, useState } from 'react';
import { fetchTimedQuizQuestions, incrementGameCountRequest } from 'utils/api/game';

const { Title, Paragraph } = Typography;

export const TimedQuestionGame = (): React.JSX.Element => {
  const { token } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedSubject, setSelectedSubject] = useState<Subject>();

  const [questions, setQuestions] = useState<TimedQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number>();
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [score, setScore] = useState<number>(0);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const handleAnswer = (index?: number): void => {
      if (index !== undefined && index === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setTimeLeft(15);
          setSelectedOption(undefined);
          setIsAnswered(false);
        } else {
          setGameFinished(true);
          void incrementGameCountRequest(token, 'timed');
        }
      }, 1200);
    };

    if (timeLeft > 0 && !isAnswered && selectedSubject && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered && selectedSubject && questions.length > 0) {
      setIsAnswered(true);
      handleAnswer();
    }
  }, [token, timeLeft, isAnswered, selectedSubject, questions.length, currentQuestion, currentQuestionIndex, score]);

  const handleSubjectSelect = async (subject: Subject): Promise<void> => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
    setSelectedOption(undefined);
    setIsAnswered(false);
    setScore(0);
    setGameFinished(false);
    const result = await fetchTimedQuizQuestions(subject);
    if (result.isErr()) {
      console.error('Failed to fetch timed questions:', result.error);
      message.error('Failed to load questions. Please try again later.');
      setLoading(false);
      return;
    }

    setQuestions(result.value.questions);
    setLoading(false);
  };

  const handleOptionClick = (index: number): void => {
    if (!isAnswered) {
      setSelectedOption(index);
      setIsAnswered(true);
      const handleAnswer = (answerIndex?: number): void => {
        if (answerIndex !== undefined && answerIndex === currentQuestion.correctAnswer) {
          setScore(score + 1);
        }
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setTimeLeft(15);
            setSelectedOption(undefined);
            setIsAnswered(false);
          } else {
            setGameFinished(true);
            if (!token) {
              return;
            }
            void incrementGameCountRequest(token, 'timed');
          }
        }, 1200);
      };
      handleAnswer(index);
    }
  };

  const resetGame = (): void => {
    setSelectedSubject(undefined);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
    setSelectedOption(undefined);
    setIsAnswered(false);
    setScore(0);
    setGameFinished(false);
  };

  const subjectNames = {
    math: 'Math',
    english: 'English',
    knowledge: 'Fun Facts',
  };

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 pt-28 text-center font-sans">
        <Title
          level={1}
          className="mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm"
        >
          Timed Quiz Game
        </Title>
        <Paragraph className="mb-6 text-lg font-medium text-gray-600">
          Answer questions quickly before time runs out!
        </Paragraph>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Card className="w-full max-w-md rounded-2xl text-center" variant="outlined">
            <Paragraph className="mb-6 text-base">Choose your subject to start the quiz:</Paragraph>
            <Space direction="vertical" size="large" className="w-full">
              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                onClick={() => void handleSubjectSelect('math')}
                className="!border-none !bg-gradient-to-r !from-cyan-600 !to-cyan-800 !shadow-lg !transition-all !duration-300 hover:!from-cyan-700 hover:!to-cyan-900 hover:!shadow-xl"
              >
                🔢 Math
              </Button>
              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                onClick={() => void handleSubjectSelect('english')}
                className="!border-none !bg-gradient-to-r !from-cyan-600 !to-cyan-800 !shadow-lg !transition-all !duration-300 hover:!from-cyan-700 hover:!to-cyan-900 hover:!shadow-xl"
              >
                📚 English
              </Button>
              <Button
                type="primary"
                block
                size="large"
                loading={loading}
                onClick={() => void handleSubjectSelect('knowledge')}
                className="!border-none !bg-gradient-to-r !from-cyan-600 !to-cyan-800 !shadow-lg !transition-all !duration-300 hover:!from-cyan-700 hover:!to-cyan-900 hover:!shadow-xl"
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
    const percent = Math.round((score / questions.length) * 100);
    let status: 'success' | 'info' | 'warning' | 'error' = 'success';
    const title = '🎉 Great Job!';
    const subTitle = `Your Score: ${score.toString()} out of ${questions.length.toString()} (${percent.toString()}%)`;
    let extra = undefined;

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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 pt-28 text-center font-sans">
        <div className="flex min-h-[80vh] items-center justify-center">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 pt-28 text-center font-sans">
        <div className="flex min-h-[80vh] items-center justify-center">
          <Card className="w-full max-w-md rounded-2xl text-center" variant="outlined">
            <Title
              level={3}
              className="bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text font-extrabold text-transparent"
            >
              Loading questions...
            </Title>
          </Card>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 pt-28 text-center font-sans">
        <div className="flex min-h-[80vh] items-center justify-center">
          <Card className="w-full max-w-md rounded-2xl text-center" variant="outlined">
            <Title
              level={3}
              className="mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text font-extrabold text-transparent"
            >
              No questions available
            </Title>
            <Button type="primary" onClick={resetGame}>
              Back to Subject Selection
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-4 pt-28 text-center font-sans">
      <div className="flex min-h-[80vh] items-center justify-center">
        <Card className="w-full max-w-lg rounded-2xl py-2 text-center" variant="outlined">
          <Space direction="vertical" className="w-full" size="large">
            <div className="mb-2 flex items-center justify-between">
              <Button type="text" onClick={resetGame} className="px-2 py-1 text-sm">
                ← Back
              </Button>
              <div className="flex items-center gap-2">
                <Tag color="geekblue" className="px-4 py-1.5 text-base">
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
            <Paragraph strong className="mb-0 text-lg">
              Question {currentQuestionIndex + 1} of {questions.length} | Score: {score}
            </Paragraph>
            <Title level={4} className="mb-0">
              {currentQuestion.question}
            </Title>
            <Space direction="vertical" size="middle" className="w-full">
              {currentQuestion.options.map((option: string, index: number) => {
                let type: 'default' | 'primary' | 'dashed' | 'link' | 'text' = 'default';
                let danger = false;
                let buttonClass = 'font-medium text-lg';

                if (selectedOption === index) {
                  type = index === currentQuestion.correctAnswer ? 'primary' : 'default';
                  danger = index !== currentQuestion.correctAnswer;
                  buttonClass += index === currentQuestion.correctAnswer ? ' bg-green-50' : ' bg-red-50';
                } else if (isAnswered && index === currentQuestion.correctAnswer) {
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
                    onClick={() => handleOptionClick(index)}
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
