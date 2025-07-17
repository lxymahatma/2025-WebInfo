import React, { useState, useEffect } from 'react';
import { Button, Card, Space, Tag, Typography, Progress, Result } from 'antd';

import { useGameTracker } from 'pages';
import type { Question } from 'types';

import './TimedQuestionGame.css';

const { Title, Paragraph } = Typography;
type Subject = 'math' | 'english' | 'knowledge';

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
        const data = await response.json();
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
          incrementGameCount('timed');
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
            incrementGameCount('timed');
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
      <div className="timed-question-container">
        <div className="timed-question-centered-wrapper">
          <Card style={{ maxWidth: 400, width: '100%', textAlign: 'center', borderRadius: 16 }} bordered>
            <Title level={2} style={{ marginBottom: 8 }}>
              🎯 Quiz Time!
            </Title>
            <Paragraph style={{ fontSize: 18, marginBottom: 24 }}>Choose your subject to start the quiz:</Paragraph>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Button
                type="primary"
                block
                size="large"
                loading={loading && selectedSubject === 'math'}
                onClick={() => handleSubjectSelect('math')}
              >
                🔢 Math
              </Button>
              <Button
                type="primary"
                block
                size="large"
                loading={loading && selectedSubject === 'english'}
                onClick={() => handleSubjectSelect('english')}
              >
                📚 English
              </Button>
              <Button
                type="primary"
                block
                size="large"
                loading={loading && selectedSubject === 'knowledge'}
                onClick={() => handleSubjectSelect('knowledge')}
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
    let status = 'success';
    let title = '🎉 Great Job!';
    let subTitle = `Your Score: ${score} out of ${questions.length} (${percent}%)`;
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
      <div className="timed-question-container">
        <div className="timed-question-centered-wrapper">
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
      <div className="timed-question-container">
        <div className="timed-question-centered-wrapper">
          <Card style={{ maxWidth: 400, width: '100%', textAlign: 'center', borderRadius: 16 }} bordered>
            <Title level={3}>Loading questions...</Title>
          </Card>
        </div>
      </div>
    );
  }

  if (questions.length === 0 && selectedSubject) {
    return (
      <div className="timed-question-container">
        <div className="timed-question-centered-wrapper">
          <Card style={{ maxWidth: 400, width: '100%', textAlign: 'center', borderRadius: 16 }} bordered>
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
    <div className="timed-question-container">
      <div className="timed-question-centered-wrapper">
        <Card
          style={{
            maxWidth: 480,
            width: '100%',
            borderRadius: 16,
            textAlign: 'center',
            padding: '8px 0',
          }}
          bordered
        >
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div className="timed-question-header-with-back">
              <Button type="text" onClick={resetGame} className="timed-question-back-button">
                ← Back
              </Button>
              <div className="timed-question-tag-container">
                <Tag color="geekblue" style={{ fontSize: 16, padding: '6px 16px' }}>
                  {subjectNames[selectedSubject]}
                </Tag>
                <Tag color="gold" style={{ fontSize: 16 }}>
                  ⏰ {timeLeft}s
                </Tag>
              </div>
              <div className="timed-question-header-spacer"></div>
            </div>
            <Progress
              percent={((currentQuestionIndex + 1) / questions.length) * 100}
              showInfo={false}
              strokeColor="#0080a8"
              trailColor="#e6f7ff"
              style={{ marginBottom: 4 }}
            />
            <Paragraph strong style={{ fontSize: 17, marginBottom: 0 }}>
              Question {currentQuestionIndex + 1} of {questions.length} | Score: {score}
            </Paragraph>
            <Title level={4} style={{ marginBottom: 0 }}>
              {currentQuestion.question}
            </Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {currentQuestion.options.map((option: string, idx: number) => {
                let type: 'default' | 'primary' | 'dashed' | 'link' | 'text' = 'default';
                let danger = false;
                let style: React.CSSProperties = { fontWeight: 500, fontSize: 18 };
                if (selectedOption === idx) {
                  type = idx === currentQuestion.correctAnswer ? 'primary' : 'default';
                  danger = idx !== currentQuestion.correctAnswer;
                  style = { ...style, background: idx === currentQuestion.correctAnswer ? '#e8ffe6' : '#fff1f0' };
                } else if (isAnswered && idx === currentQuestion.correctAnswer) {
                  style = { ...style, background: '#e8ffe6' };
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
};
