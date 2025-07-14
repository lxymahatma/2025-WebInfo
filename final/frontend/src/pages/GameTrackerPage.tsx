import React from 'react';
import { Card, Space, Typography, Button, Row, Col, Statistic, Divider } from 'antd';
import { TrophyOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useGameTracker } from './GameTrackerContext';

import './GameTrackerPage.css';

const { Title, Paragraph } = Typography;

const gameInfo = {
  dragdrop: {
    name: 'Drag & Drop',
    icon: '🎯',
    description: 'Match items to their correct categories',
    color: '#1890ff',
    path: '/dragdrop',
  },
  timed: {
    name: 'Timed Quiz',
    icon: '⏰',
    description: 'Answer questions before time runs out',
    color: '#52c41a',
    path: '/timed',
  },
  memory: {
    name: 'Memory Cards',
    icon: '🧠',
    description: 'Match pairs of cards by memory',
    color: '#722ed1',
    path: '/memory',
  },
};

export const GameTrackerPage = (): React.JSX.Element => {
  const { stats, resetStats } = useGameTracker();

  const totalGamesPlayed = stats.dragdrop + stats.timed + stats.memory;

  const handleResetStats = () => {
    if (window.confirm('Are you sure you want to reset all game statistics? This action cannot be undone.')) {
      resetStats();
    }
  };

  return (
    <div className="game-tracker-container">
      <div className="game-tracker-wrapper">
        <Card className="game-tracker-main-card">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <TrophyOutlined className="game-tracker-title-icon" />
              <Title level={1} className="game-tracker-title">
                🎮 Game Tracker
              </Title>
              <Paragraph className="game-tracker-subtitle">
                Track your gaming progress and see how many times you've played each game!
              </Paragraph>
            </div>

            <Divider />

            <Row gutter={[16, 16]} className="game-tracker-stats-grid">
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Total Games Played"
                  value={totalGamesPlayed}
                  prefix="🎯"
                  valueStyle={{ color: '#1890ff', fontSize: 32 }}
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
                  valueStyle={{ color: '#52c41a', fontSize: 20 }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Statistic
                  title="Games Available"
                  value={3}
                  prefix="🎮"
                  valueStyle={{ color: '#722ed1', fontSize: 32 }}
                />
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button
                  type="primary"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={handleResetStats}
                  size="large"
                  className="game-tracker-reset-btn"
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
              <Card hoverable className={`game-tracker-game-card game-${gameKey}-border`} bodyStyle={{ padding: 24 }}>
                <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                  <div>
                    <div className="game-tracker-game-icon">{info.icon}</div>
                    <Title level={3} className={`game-${gameKey}-color`} style={{ margin: 0 }}>
                      {info.name}
                    </Title>
                    <Paragraph className="game-tracker-game-description">{info.description}</Paragraph>
                  </div>

                  <div className={`game-tracker-stat-box game-${gameKey}-bg`}>
                    <Statistic
                      title="Times Played"
                      value={stats[gameKey as keyof typeof stats]}
                      valueStyle={{
                        color: info.color,
                        fontSize: 36,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                      className="game-tracker-stat-style"
                    />
                  </div>

                  {stats[gameKey as keyof typeof stats] > 0 && (
                    <div className="game-tracker-mastered-badge">
                      <Paragraph className="game-tracker-mastered-text">🎉 You've mastered this game!</Paragraph>
                    </div>
                  )}

                  {stats[gameKey as keyof typeof stats] === 0 && (
                    <Link to={info.path} className="game-tracker-try-game-link">
                      <div
                        className="game-tracker-try-game-box"
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#ffe7ba';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = '#fff7e6';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Paragraph className="game-tracker-try-game-text">🎮 Ready to try this game?</Paragraph>
                      </div>
                    </Link>
                  )}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {totalGamesPlayed === 0 && (
          <Card className="game-tracker-welcome-card">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div className="game-tracker-welcome-icon">🎮</div>
              <div>
                <Title level={3} className="game-tracker-welcome-title">
                  Welcome to Game Tracker!
                </Title>
                <Paragraph className="game-tracker-welcome-text">
                  Start playing any of the available games to see your progress here. Each completed game will be
                  automatically tracked!
                </Paragraph>
              </div>
            </Space>
          </Card>
        )}

        {totalGamesPlayed >= 10 && (
          <Card className="game-tracker-champion-card">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div className="game-tracker-champion-icon">🏆</div>
              <div>
                <Title level={2} className="game-tracker-champion-title">
                  Gaming Champion!
                </Title>
                <Paragraph className="game-tracker-champion-text">
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
