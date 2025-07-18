import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Space, Typography, Button, Row, Col, Statistic, Divider } from 'antd';
import { TrophyOutlined, ReloadOutlined } from '@ant-design/icons';

import { useGameTracker } from 'components';

const { Title, Paragraph } = Typography;

const gameInfo = {
  dragdrop: {
    name: 'Drag & Drop',
    icon: '🎯',
    description: 'Match items to their correct categories',
    color: '#1890ff',
    tailwindColor: 'text-blue-500',
    path: '/dragdrop',
  },
  timed: {
    name: 'Timed Quiz',
    icon: '⏰',
    description: 'Answer questions before time runs out',
    color: '#52c41a',
    tailwindColor: 'text-green-500',
    path: '/timed',
  },
  memory: {
    name: 'Memory Cards',
    icon: '🧠',
    description: 'Match pairs of cards by memory',
    color: '#722ed1',
    tailwindColor: 'text-purple-500',
    path: '/memory',
  },
};

export const GameTrackerPage = (): React.JSX.Element => {
  const { stats, resetStats } = useGameTracker();

  const totalGamesPlayed = stats.dragdrop + stats.timed + stats.memory;

  const handleResetStats = () => {
    if (window.confirm('Are you sure you want to reset all game statistics? This action cannot be undone.')) {
      void resetStats();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 p-6">
      <div className="mx-auto max-w-6xl">
        <Card className="mb-6 rounded-2xl bg-white/95 text-center backdrop-blur-md">
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <TrophyOutlined className="mb-4 text-5xl text-yellow-400" />
              <Title level={1} className="m-0 text-gray-800">
                🎮 Game Tracker
              </Title>
              <Paragraph className="m-0 text-lg text-gray-600">
                Track your gaming progress and see how many times you've played each game!
              </Paragraph>
            </div>

            <Divider />

            <Row gutter={[16, 16]} className="justify-center">
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Total Games Played"
                  value={totalGamesPlayed}
                  prefix="🎯"
                  className="text-3xl font-bold text-blue-500"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Favorite Game"
                  value={
                    totalGamesPlayed === 0
                      ? 'None yet'
                      : Object.entries(stats).reduce((a, b) =>
                          stats[a[0] as keyof typeof stats] > stats[b[0] as keyof typeof stats] ? a : b
                        )[0]
                  }
                  className="text-xl text-green-500"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Games Available"
                  value={3}
                  prefix="🎮"
                  className="text-3xl font-bold text-purple-600"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={handleResetStats}
                  size="large"
                  className="mt-2"
                >
                  Reset Stats
                </Button>
              </Col>
            </Row>
          </Space>
        </Card>

        <Row gutter={[24, 24]}>
          {Object.entries(gameInfo).map(([gameKey, info]) => (
            <Col xs={24} sm={12} lg={8} key={gameKey}>
              <Card
                hoverable
                className="h-full rounded-2xl bg-white/95 p-6 backdrop-blur-md transition-all duration-300"
              >
                <Space direction="vertical" size="middle" className="w-full text-center">
                  <div>
                    <div className="mb-3 text-6xl">{info.icon}</div>
                    <Title level={3} className="m-0 text-gray-800">
                      {info.name}
                    </Title>
                    <Paragraph className="mx-0 my-2 text-gray-600">{info.description}</Paragraph>
                  </div>

                  <div className="mx-auto flex w-4/5 flex-col items-center justify-center rounded-xl p-5">
                    <Statistic
                      title="Times Played"
                      value={stats[gameKey as keyof typeof stats]}
                      className={`w-full text-center font-bold ${info.tailwindColor}`}
                    />
                  </div>

                  {stats[gameKey as keyof typeof stats] > 0 && (
                    <div className="mx-auto flex w-4/5 items-center justify-center rounded-lg border border-green-300 bg-green-50 p-3">
                      <Paragraph className="m-0 text-center font-medium text-green-600">
                        🎉 You've mastered this game!
                      </Paragraph>
                    </div>
                  )}

                  {stats[gameKey as keyof typeof stats] === 0 && (
                    <Link to={info.path} className="mx-auto w-4/5 no-underline">
                      <div className="flex w-[90%] cursor-pointer items-center justify-center rounded-lg border border-orange-300 bg-orange-50 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-orange-100 hover:shadow-lg">
                        <Paragraph className="m-0 text-center font-medium text-orange-600">
                          🎮 Ready to try this game?
                        </Paragraph>
                      </div>
                    </Link>
                  )}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {totalGamesPlayed === 0 && (
          <Card className="mt-6 rounded-2xl bg-white/95 text-center backdrop-blur-md">
            <Space direction="vertical" size="large" className="w-full">
              <div className="text-7xl">🎮</div>
              <div>
                <Title level={3} className="text-blue-500">
                  Welcome to Game Tracker!
                </Title>
                <Paragraph className="text-gray-600">
                  Start playing any of the available games to see your progress here. Each completed game will be
                  automatically tracked!
                </Paragraph>
              </div>
            </Space>
          </Card>
        )}

        {totalGamesPlayed >= 10 && (
          <Card className="mt-6 rounded-2xl bg-gradient-to-br from-yellow-200 via-yellow-400 to-blue-800 text-center text-white">
            <Space direction="vertical" size="middle" className="w-full">
              <div className="text-6xl">🏆</div>
              <div>
                <Title level={2} className="m-0 text-white">
                  Gaming Champion!
                </Title>
                <Paragraph className="m-0 text-lg text-white/90">
                  You've played {totalGamesPlayed} games! You're a true gaming enthusiast! 🌟
                </Paragraph>
              </div>
            </Space>
          </Card>
        )}
      </div>
    </div>
  );
};
