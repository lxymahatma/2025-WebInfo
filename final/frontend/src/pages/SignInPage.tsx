import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { useAuth } from 'components';
import type { SignInResponse, ErrorResponse } from 'types';

const { Title, Text } = Typography;

export const SignInPage = (): React.JSX.Element => {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      void navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSignIn = async (values: { username: string; password: string }): Promise<void> => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = (await response.json()) as SignInResponse;
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);

        message.success('Sign in success!');

        setTimeout(() => {
          signin(data.username);
          void navigate('/');
        }, 800);
      } else {
        const error = (await response.json()) as ErrorResponse;
        message.error(error.message ?? 'Invalid credentials');
        setLoading(false);
      }
    } catch {
      message.error('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 m-0 box-border flex min-h-screen items-center justify-center overflow-auto bg-gradient-to-br from-cyan-600 to-cyan-800 p-0 font-sans">
      <Link
        to="/"
        className="absolute top-8 left-8 text-base font-semibold text-white no-underline transition-opacity duration-300 hover:opacity-80 md:top-4 md:left-4 md:text-sm"
      >
        ← Back to Home
      </Link>
      <div className="box-border flex h-full w-full items-center justify-center p-8">
        <Card className="relative z-10 w-[90%] max-w-md flex-shrink-0 rounded-2xl bg-white/95 text-center shadow-2xl backdrop-blur-sm md:p-8">
          <Title level={2} className="!mb-8 !text-4xl !font-bold !text-gray-800 !drop-shadow-none md:!text-3xl">
            Sign In
          </Title>
          <Form
            layout="vertical"
            onFinish={(values: { username: string; password: string }) => void handleSignIn(values)}
            className="flex flex-col gap-6"
          >
            <Form.Item
              name="username"
              label={<span className="text-base font-semibold text-gray-600">Username</span>}
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
                className="rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition-colors duration-300 focus:border-blue-400 focus:shadow-sm focus:shadow-blue-400/10"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label={<span className="text-base font-semibold text-gray-600">Password</span>}
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                className="rounded-lg border-2 border-gray-300 px-4 py-3 text-base transition-colors duration-300 focus:border-blue-400 focus:shadow-sm focus:shadow-blue-400/10"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                disabled={loading}
                className="!cursor-pointer !rounded-xl !border-none !bg-gradient-to-r !from-cyan-600 !to-cyan-800 !px-8 !py-4 !text-lg !font-semibold !text-white !no-underline !transition-all !duration-300 hover:!-translate-y-0.5 hover:!bg-gradient-to-r hover:!from-cyan-700 hover:!to-cyan-900 hover:!text-white hover:!shadow-lg hover:!shadow-cyan-600/30"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>
          <div className="mt-6 border-t border-gray-300 pt-6">
            <Text className="mb-2 block text-sm text-gray-500">Don't have an account?</Text>
            <Link
              to="/signup"
              className="!font-semibold !text-cyan-600 !no-underline !transition-colors !duration-300 hover:!text-cyan-800 hover:!underline"
            >
              Sign Up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
