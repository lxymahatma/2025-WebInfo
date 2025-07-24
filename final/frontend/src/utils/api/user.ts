import type { LanguageResponse } from '@eduplayground/shared/language';
import type { ProfileResponse } from '@eduplayground/shared/user';
import { API_BASE_URL } from 'config/api';

export const fetchUserProfile = async (token: string): Promise<ProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Failed to fetch user profile', response.statusText);
    throw new Error('Failed to fetch user profile');
  }
  return (await response.json()) as ProfileResponse;
};

export const updateUserInfo = async (token: string, profile: { username: string; password: string }): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    console.error('Failed to update user profile', response.statusText);
    throw new Error('Failed to update user profile');
  }
};

export const fetchUserLanguages = async (token: string): Promise<LanguageResponse> => {
  const response = await fetch(`${API_BASE_URL}/languages`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    console.error('Failed to load translations from backend', response.statusText);
    throw new Error('Failed to load translations from backend');
  }
  return (await response.json()) as LanguageResponse;
};

export const updateUserLanguage = async (token: string, language: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/languages`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ language }),
  });

  if (!response.ok) {
    console.error('Failed to update language preference', response.statusText);
    throw new Error('Failed to update language preference');
  }
};
