import type { ProfileResponse, LanguageResponse } from 'types';
import { API_BASE_URL } from 'config/api';

export const fetchUserProfile = async (token: string): Promise<ProfileResponse> => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    return (await response.json()) as ProfileResponse;
  } else {
    throw new Error('Failed to fetch user profile');
  }
};

export const updateUserProfile = async (
  token: string,
  profile: { username: string; password: string }
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
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

  if (response.ok) {
    return (await response.json()) as LanguageResponse;
  } else {
    throw new Error('Failed to load translations from backend');
  }
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
    throw new Error('Failed to update language preference');
  }
};
