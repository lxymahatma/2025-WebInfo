import { ExclamationCircleOutlined, ReloadOutlined, TrophyOutlined } from '@ant-design/icons';
import type { GameDashboard, GameStats } from '@eduplayground/shared/game';
import { Button, Card, Col, Divider, message, Modal, Row, Space, Spin, Statistic, Typography } from 'antd';
import { useAuth } from 'components/auth';
import { maxBy, sum } from 'es-toolkit';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGameOverview, resetGameStatsRequest } from 'utils/api/game';

const { Title, Paragraph } = Typography;

export const GameDashboardPage = (): React.JSX.Element => {
  const { token } = useAuth();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState<GameDashboard>();
  const [userStats, setUserStats] = useState<GameStats>();
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);

  useEffect(() => {
    const loadGameDashboard = async () => {
      setLoading(true);

      const result = await fetchGameOverview(token);

      if (result.isErr()) {
        console.error('Failed to load game dashboard:', result.error);
        message.error('Failed to load game dashboard. Please try again later.');
        setLoading(false);
        return;
      }

      const { dashboard, userStats } = result.value;
      setDashboard(dashboard);
      setUserStats(userStats);
      setTotalGamesPlayed(sum(Object.values(userStats)));
      setLoading(false);
    };

    void loadGameDashboard();
  }, [token]);

  const handleResetStats = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = async () => {
    await resetGameStatsRequest(token);
    setTotalGamesPlayed(0);
    setIsResetModalOpen(false);
  };

  const handleCancelReset = () => {
    setIsResetModalOpen(false);
  };

  if (!dashboard || !userStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 p-6">
        <div className="mx-auto max-w-6xl">
          <Card className="mb-6 rounded-2xl bg-white/95 text-center shadow-2xl backdrop-blur-md">
            <Space direction="vertical" size="large" className="w-full">
              <Title level={3} className="text-red-500">
                Failed to Load Game Information
              </Title>
              <Paragraph>Please try refreshing the page or check your connection.</Paragraph>
              <Button
                type="primary"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow"
                onClick={() => globalThis.location.reload()}
              >
                Retry
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 p-6">
        <div className="mx-auto max-w-6xl">
          <Card className="mb-6 rounded-2xl bg-white/95 text-center shadow-2xl backdrop-blur-md">
            <Space direction="vertical" size="large" className="w-full">
              <Spin size="large" />
              <Title level={3} className="text-indigo-600">
                Loading Game Information...
              </Title>
            </Space>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 p-6">
      <div className="mx-auto max-w-6xl">
        <Card className="mb-6 rounded-2xl bg-white/95 text-center shadow-2xl backdrop-blur-md">
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <TrophyOutlined className="mb-4 text-5xl text-yellow-400 drop-shadow-lg" />
              <Title level={1} className="m-0 text-gray-800 drop-shadow">
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
                  className="text-4xl font-extrabold text-blue-600"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Favorite Game"
                  value={
                    totalGamesPlayed === 0
                      ? 'None yet'
                      : (() => {
                          const maxEntry = maxBy(Object.entries(userStats), ([, value]: [string, number]) => value);
                          const maxKey = maxEntry?.[0] as keyof GameStats | undefined;

                          return maxKey ? dashboard.cards[maxKey].name : 'Unknown';
                        })()
                  }
                  className="text-2xl font-bold text-green-600"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Games Available"
                  value={3}
                  prefix="🎮"
                  className="text-4xl font-extrabold text-purple-700"
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={handleResetStats}
                  size="large"
                  className="mt-2 bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg hover:from-pink-600 hover:to-indigo-700"
                >
                  Reset Stats
                </Button>
              </Col>
            </Row>
          </Space>
        </Card>

        <Row gutter={[24, 24]}>
          {Object.entries(dashboard.cards).map(([gameKey, card]) => (
            <Col xs={24} sm={12} lg={8} key={gameKey}>
              <Card
                hoverable
                className="h-full rounded-2xl bg-white/95 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <Space direction="vertical" size="middle" className="w-full text-center">
                  <div>
                    <div className="mb-3 text-6xl">{card.icon}</div>
                    <Title level={3} className="m-0 text-gray-800">
                      {card.name}
                    </Title>
                    <Paragraph className="mx-0 my-2 text-gray-600">{card.description}</Paragraph>
                  </div>

                  <div className="mx-auto flex w-4/5 flex-col items-center justify-center rounded-xl p-5">
                    <Statistic
                      title="Times Played"
                      value={userStats[gameKey as keyof typeof userStats]}
                      className={`w-full text-center text-3xl font-bold ${card.textColor}`}
                    />
                  </div>

                  {userStats[gameKey as keyof typeof userStats] > 0 && (
                    <div className="mx-auto flex w-4/5 items-center justify-center rounded-lg border border-green-300 bg-green-50 p-3 shadow">
                      <Paragraph className="m-0 text-center font-medium text-green-600">
                        🎉 You've mastered this game!
                      </Paragraph>
                    </div>
                  )}

                  {userStats[gameKey as keyof typeof userStats] === 0 && (
                    <Link to={`/${card.id}`} className="mx-auto w-4/5 no-underline">
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
          <Card className="mt-6 rounded-2xl bg-white/95 text-center shadow-2xl backdrop-blur-md">
            <Space direction="vertical" size="large" className="w-full">
              <div className="text-7xl">🎮</div>
              <div>
                <Title level={3} className="text-blue-500 drop-shadow">
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
          <Card className="mt-6 rounded-2xl bg-gradient-to-br from-yellow-200 via-yellow-400 to-blue-800 text-center text-white shadow-2xl">
            <Space direction="vertical" size="middle" className="w-full">
              <div className="text-6xl">🏆</div>
              <div>
                <Title level={2} className="m-0 text-white drop-shadow">
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

      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="mr-2 text-red-500" />
            Reset Game Statistics
          </div>
        }
        open={isResetModalOpen}
        onOk={() => void handleConfirmReset()}
        onCancel={handleCancelReset}
        okText="Yes, Reset"
        cancelText="Cancel"
        okType="danger"
      >
        <p>Are you sure you want to reset all game statistics?</p>
        <p>
          <strong>This action cannot be undone.</strong>
        </p>
      </Modal>
    </div>
  );
};
