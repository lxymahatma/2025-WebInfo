import type { AuthResponse } from '@eduplayground/shared/auth';
import type { ErrorResponse } from '@eduplayground/shared/error';
import { API_BASE_URL } from 'config/api';

export const signIn = async (values: { username: string; password: string }): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    console.error('Sign in failed:', error.message);
    throw new Error(error.message ?? 'Invalid credentials');
  }
  return (await response.json()) as AuthResponse;
};

export const signUp = async (values: { username: string; password: string }): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    console.error('Sign up failed:', error.message);
    throw new Error(error.message ?? 'Sign up failed');
  }
  return (await response.json()) as AuthResponse;
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
    console.error('Sign out failed:', response.statusText);
    throw new Error('Sign out failed');
  }
};
