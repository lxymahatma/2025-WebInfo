import type { Subject, TimedQuizQuestion } from '@eduplayground/shared/types/game';
import { Button, Card, message, Progress, Space, Spin, Tag, Typography } from 'antd';
import { useAuth } from 'components/auth';
import React, { useCallback, useEffect, useState } from 'react';
import { fetchTimedQuizQuestions, incrementGameCountRequest } from 'utils/api/game';

const { Title, Paragraph } = Typography;

export const TimedQuestionGame = (): React.JSX.Element => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);

  const [selectedSubject, setSelectedSubject] = useState<Subject>();
  const [questions, setQuestions] = useState<TimedQuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number>();
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const loadQuestions = async (subject: Subject) => {
    setLoading(true);

    try {
      const result = await fetchTimedQuizQuestions(subject);

      if (result.isErr()) {
        console.error('Failed to fetch timed questions:', result.error);
        message.error('Failed to load questions. Please try again later.');
        return;
      }

      setQuestions(result.value.questions);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = useCallback((index?: number) => {
    if (index !== undefined && currentQuestion && index === currentQuestion.correctAnswer) {
      setScore(previousScore => previousScore + 1);
    }
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(previousIndex => previousIndex + 1);
        setTimeLeft(15);
        setSelectedOption(undefined);
        setIsAnswered(false);
      } else {
        setGameFinished(true);
        void incrementGameCountRequest(token, 'timed');
      }
    }, 1200);
  }, [currentQuestion, currentQuestionIndex, questions.length, token]);

  const resetGame = () => {
    setSelectedSubject(undefined);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
    setSelectedOption(undefined);
    setIsAnswered(false);
    setScore(0);
    setGameFinished(false);
  };

  const handleSubjectSelect = async (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
    setSelectedOption(undefined);
    setIsAnswered(false);
    setScore(0);
    setGameFinished(false);
    await loadQuestions(subject);
  };

  const handleOptionClick = (index: number) => {
    if (!isAnswered && currentQuestion) {
      setSelectedOption(index);
      setIsAnswered(true);
      handleAnswer(index);
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !isAnswered && selectedSubject && questions.length > 0 && currentQuestion) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered && selectedSubject && questions.length > 0 && currentQuestion) {
      setIsAnswered(true);
      handleAnswer();
    }
  }, [timeLeft, isAnswered, selectedSubject, questions.length, currentQuestion, handleAnswer]);

  const subjectNames = {
    math: 'Math',
    english: 'English',
    knowledge: 'Fun Facts',
  } as const;

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-8 pt-28 text-center font-sans">
        <Title
          level={1}
          className="mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm"
        >
          Timed Quiz Game
        </Title>
        <div className="mb-4 text-xl font-medium text-gray-600">Answer questions quickly before time runs out!</div>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Card className="w-full max-w-md rounded-2xl text-center" variant="outlined">
            <div className="mb-4 text-xl font-medium text-gray-600">Choose your subject to start the quiz:</div>
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
        <div className="mb-4 text-xl font-medium text-gray-600">Getting your questions ready!</div>
      </div>
    );
  }

  if (gameFinished) {
    const percent = Math.round((score / questions.length) * 100);
    
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-8 pt-28 text-center font-sans">
        <Title
          level={1}
          className="mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm"
        >
          Congratulations! 🎉
        </Title>
        <div className="mb-4 text-xl font-medium text-gray-600">
          Your Score: {score} out of {questions.length} ({percent}%)
        </div>
        {score === questions.length && (
          <Paragraph className="mb-4 text-lg font-medium text-green-600">🌟 Perfect Score! Amazing! 🌟</Paragraph>
        )}
        {score >= questions.length * 0.8 && score < questions.length && (
          <Paragraph className="mb-4 text-lg font-medium text-blue-600">🎊 Excellent work! 🎊</Paragraph>
        )}
        {score >= questions.length * 0.6 && score < questions.length * 0.8 && (
          <Paragraph className="mb-4 text-lg font-medium text-purple-600">👍 Good job! 👍</Paragraph>
        )}
        {score < questions.length * 0.6 && (
          <Paragraph className="mb-4 text-lg font-medium text-gray-600">💪 Keep practicing! 💪</Paragraph>
        )}
        <Space className="mt-6">
          <Button type="default" size="large" onClick={resetGame}>
            Choose New Subject
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => selectedSubject ? void handleSubjectSelect(selectedSubject) : undefined}
            className="cursor-pointer rounded-xl border-none bg-gradient-to-r from-cyan-600 to-cyan-800 px-[30px] py-3 text-[1.1rem] font-semibold text-white shadow-lg shadow-cyan-600/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-600/60"
          >
            Play Again
          </Button>
        </Space>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-8 pt-28 text-center font-sans">
        <Title
          level={1}
          className="mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm"
        >
          No questions available
        </Title>
        <Button
          type="primary"
          size="large"
          onClick={resetGame}
          className="mt-6 cursor-pointer rounded-xl border-none bg-gradient-to-r from-cyan-600 to-cyan-800 px-[30px] py-3 text-[1.1rem] font-semibold text-white shadow-lg shadow-cyan-600/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-600/60"
        >
          Back to Subject Selection
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-8 pt-28 text-center font-sans">
        <Spin size="large" />
        <Title
          level={1}
          className="mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm"
        >
          Loading...
        </Title>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 p-4 pt-28 text-center font-sans">
      <Title
        level={1}
        className="mb-4 bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-[2.5rem] font-extrabold text-transparent drop-shadow-sm"
      >
        Timed Quiz Game
      </Title>
      <div className="mb-4 text-xl font-medium text-gray-600">Answer questions quickly before time runs out!</div>
      <div className="flex min-h-[80vh] items-center justify-center">
        <Card className="w-full max-w-lg rounded-2xl py-2 text-center" variant="outlined">
          <Space direction="vertical" className="w-full" size="large">
            <div className="mb-2 flex items-center justify-between">
              <Button type="text" onClick={resetGame} className="px-2 py-1 text-sm">
                ← Back
              </Button>
              <div className="flex items-center gap-2">
                <Tag color="geekblue" className="px-4 py-1.5 text-base">
                  {selectedSubject ? subjectNames[selectedSubject as keyof typeof subjectNames] : ''}
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
                const type: 'default' | 'primary' | 'dashed' | 'link' | 'text' = 'default';
                let danger = false;
                let buttonClass = 'font-medium text-lg';
                let buttonStyle: React.CSSProperties | undefined;

                const isCorrectAnswer = index === currentQuestion.correctAnswer;
                const isSelectedOption = selectedOption === index;
                const shouldShowAsCorrect = (isSelectedOption && isCorrectAnswer) || (isAnswered && isCorrectAnswer);
                const shouldShowAsIncorrect = isSelectedOption && !isCorrectAnswer;

                if (shouldShowAsCorrect) {
                  // Correct answer - bright green
                  buttonClass += ' !bg-green-200 !border-green-500 !text-green-900 hover:!bg-green-200 hover:!border-green-500';
                  buttonStyle = { backgroundColor: '#bbf7d0', borderColor: '#10b981', color: '#064e3b' };
                } else if (shouldShowAsIncorrect) {
                  // Wrong answer - bright red
                  buttonClass += ' !bg-red-200 !border-red-500 !text-red-900 hover:!bg-red-200 hover:!border-red-500';
                  buttonStyle = { backgroundColor: '#fecaca', borderColor: '#ef4444', color: '#7f1d1d' };
                  danger = true;
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
                    style={buttonStyle}
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
