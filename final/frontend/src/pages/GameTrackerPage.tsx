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
    <div className="bg-gradient-to-br from-indigo-400 to-purple-600 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="backdrop-blur-md bg-white/95 rounded-2xl mb-6 text-center">
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <TrophyOutlined className="text-yellow-400 text-5xl mb-4" />
              <Title level={1} className="text-gray-800 m-0">
                🎮 Game Tracker
              </Title>
              <Paragraph className="text-gray-600 text-lg m-0">
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
                  className="text-blue-500 font-bold text-3xl"
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
                  className="text-green-500 text-xl"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Games Available"
                  value={3}
                  prefix="🎮"
                  className="text-purple-600 font-bold text-3xl"
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
                className="backdrop-blur-md bg-white/95 rounded-2xl h-full transition-all duration-300 p-6"
              >
                <Space direction="vertical" size="middle" className="w-full text-center">
                  <div>
                    <div className="text-6xl mb-3">{info.icon}</div>
                    <Title level={3} className="text-gray-800 m-0">
                      {info.name}
                    </Title>
                    <Paragraph className="text-gray-600 my-2 mx-0">{info.description}</Paragraph>
                  </div>

                  <div className="flex flex-col items-center justify-center mx-auto p-5 rounded-xl w-4/5">
                    <Statistic
                      title="Times Played"
                      value={stats[gameKey as keyof typeof stats]}
                      className={`font-bold text-center w-full ${info.tailwindColor}`}
                    />
                  </div>

                  {stats[gameKey as keyof typeof stats] > 0 && (
                    <div className="flex items-center justify-center mx-auto p-3 w-4/5 bg-green-50 border border-green-300 rounded-lg">
                      <Paragraph className="text-green-600 font-medium m-0 text-center">
                        🎉 You've mastered this game!
                      </Paragraph>
                    </div>
                  )}

                  {stats[gameKey as keyof typeof stats] === 0 && (
                    <Link to={info.path} className="mx-auto no-underline w-4/5">
                      <div className="bg-orange-50 hover:bg-orange-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-center p-3 w-[90%] border border-orange-300 rounded-lg cursor-pointer">
                        <Paragraph className="text-orange-600 font-medium m-0 text-center">
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
          <Card className="backdrop-blur-md bg-white/95 rounded-2xl mt-6 text-center">
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
          <Card className="bg-gradient-to-br from-yellow-200 via-yellow-400 to-blue-800 rounded-2xl mt-6 text-center text-white">
            <Space direction="vertical" size="middle" className="w-full">
              <div className="text-6xl">🏆</div>
              <div>
                <Title level={2} className="text-white m-0">
                  Gaming Champion!
                </Title>
                <Paragraph className="text-white/90 text-lg m-0">
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
