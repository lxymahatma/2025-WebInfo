import type { AuthResponse } from '@eduplayground/shared/auth';
import type { ErrorResponse } from '@eduplayground/shared/error';
import { API_BASE_URL } from 'config/api';
import { err, ok, type Result } from 'neverthrow';

export const signInRequest = async (values: {
  username: string;
  password: string;
}): Promise<Result<AuthResponse, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const error = (await response.json()) as ErrorResponse;
      return err(error.message ?? 'Invalid credentials');
    }
    return ok((await response.json()) as AuthResponse);
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Network error');
  }
};

export const signUpRequest = async (values: {
  username: string;
  password: string;
}): Promise<Result<AuthResponse, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const error = (await response.json()) as ErrorResponse;
      return err(error.message ?? 'Sign up failed');
    }
    return ok((await response.json()) as AuthResponse);
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Network error');
  }
};

export const signOutRequest = async (token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/signout`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Sign out failed:', response.status, response.statusText);
  }
};
