import React from 'react';
import { Card, Space, Typography, Button, Row, Col, Statistic, Divider } from 'antd';
import { TrophyOutlined, ReloadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useGameTracker } from './GameTrackerContext';

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

export default function GameTrackerPage(): React.JSX.Element {
  const { stats, resetStats } = useGameTracker();

  const totalGamesPlayed = stats.dragdrop + stats.timed + stats.memory;

  const handleResetStats = () => {
    if (window.confirm('Are you sure you want to reset all game statistics? This action cannot be undone.')) {
      resetStats();
    }
  };

  return (
    <div
      style={{
        padding: '24px',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Card
          style={{
            borderRadius: 16,
            marginBottom: 24,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <TrophyOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
              <Title level={1} style={{ margin: 0, color: '#1f1f1f' }}>
                🎮 Game Tracker
              </Title>
              <Paragraph style={{ fontSize: 18, color: '#666', margin: 0 }}>
                Track your gaming progress and see how many times you've played each game!
              </Paragraph>
            </div>

            <Divider />

            <Row gutter={[16, 16]} justify="center">
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
                  style={{ marginTop: 8 }}
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
                style={{
                  borderRadius: 16,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `3px solid ${info.color}`,
                  transition: 'all 0.3s ease',
                }}
                bodyStyle={{ padding: 24 }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: 64, marginBottom: 12 }}>{info.icon}</div>
                    <Title level={3} style={{ margin: 0, color: info.color }}>
                      {info.name}
                    </Title>
                    <Paragraph style={{ color: '#666', margin: '8px 0 16px 0' }}>{info.description}</Paragraph>
                  </div>

                  <div
                    style={{
                      background: `linear-gradient(135deg, ${info.color}20, ${info.color}10)`,
                      borderRadius: 12,
                      padding: 20,
                      width: '80%',
                      margin: '0 auto',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Statistic
                      title="Times Played"
                      value={stats[gameKey as keyof typeof stats]}
                      valueStyle={{
                        color: info.color,
                        fontSize: 36,
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                      suffix="games"
                      style={{ textAlign: 'center' }}
                    />
                  </div>

                  {stats[gameKey as keyof typeof stats] > 0 && (
                    <div
                      style={{
                        background: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: 8,
                        padding: 12,
                        width: '85%',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Paragraph style={{ margin: 0, color: '#52c41a', fontWeight: 500, textAlign: 'center' }}>
                        🎉 You've mastered this game!
                      </Paragraph>
                    </div>
                  )}

                  {stats[gameKey as keyof typeof stats] === 0 && (
                    <Link to={info.path} style={{ textDecoration: 'none', width: '80%', margin: '0 auto' }}>
                      <div
                        style={{
                          background: '#fff7e6',
                          border: '1px solid #ffd591',
                          borderRadius: 8,
                          padding: 12,
                          width: '90%',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
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
                        <Paragraph style={{ margin: 0, color: '#fa8c16', fontWeight: 500, textAlign: 'center' }}>
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
          <Card
            style={{
              borderRadius: 16,
              marginTop: 24,
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ fontSize: 72 }}>🎮</div>
              <div>
                <Title level={3} style={{ color: '#1890ff' }}>
                  Welcome to Game Tracker!
                </Title>
                <Paragraph style={{ fontSize: 16, color: '#666' }}>
                  Start playing any of the available games to see your progress here. Each completed game will be
                  automatically tracked!
                </Paragraph>
              </div>
            </Space>
          </Card>
        )}

        {totalGamesPlayed >= 10 && (
          <Card
            style={{
              borderRadius: 16,
              marginTop: 24,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
              color: 'white',
            }}
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ fontSize: 64 }}>🏆</div>
              <div>
                <Title level={2} style={{ color: 'white', margin: 0 }}>
                  Gaming Champion!
                </Title>
                <Paragraph style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                  You've played {totalGamesPlayed} games! You're a true gaming enthusiast! 🌟
                </Paragraph>
              </div>
            </Space>
          </Card>
        )}
      </div>
    </div>
  );
}
