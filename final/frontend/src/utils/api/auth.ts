import type { SignInResponse, SignUpResponse, ErrorResponse } from 'types';
import { API_BASE_URL } from 'config/api';

export const signIn = async (values: { username: string; password: string }): Promise<SignInResponse> => {
  const response = await fetch(`${API_BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (response.ok) {
    return (await response.json()) as SignInResponse;
  } else {
    const error = (await response.json()) as ErrorResponse;
    throw new Error(error.message ?? 'Invalid credentials');
  }
};

export const signUp = async (values: { username: string; password: string }): Promise<SignUpResponse> => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (response.ok) {
    return (await response.json()) as SignUpResponse;
  } else {
    const error = (await response.json()) as ErrorResponse;
    throw new Error(error.message ?? 'Sign up failed');
  }
};

export const signOut = async (token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/signout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Sign out failed');
  }
};
