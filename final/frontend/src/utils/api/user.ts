import type { LanguageResponse } from '@eduplayground/shared/language';
import type { ProfileResponse } from '@eduplayground/shared/user';
import { API_BASE_URL } from 'config/api';
import { err, ok, type Result } from 'neverthrow';

export const fetchUserProfile = async (token: string): Promise<Result<ProfileResponse, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return err(`Failed to fetch user profile: ${response.status}, ${response.statusText}`);
    }

    return ok((await response.json()) as ProfileResponse);
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Error fetching user profile');
  }
};

export const updateUserInfo = async (
  token: string,
  profile: { username: string; password: string }
): Promise<Result<void, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      return err(`Failed to update user info: ${response.status}, ${response.statusText}`);
    }

    return ok();
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Error updating user info');
  }
};

export const fetchUserLanguages = async (token: string): Promise<Result<LanguageResponse, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to load translations from backend', response.statusText);
      return err('Failed to load translations from backend');
    }

    return ok((await response.json()) as LanguageResponse);
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Error fetching user languages');
  }
};

export const updateUserLanguage = async (token: string, language: string): Promise<Result<void, string>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language }),
    });

    if (!response.ok) {
      return err(`Failed to update language preference: ${response.statusText}`);
    }

    return ok();
  } catch (error) {
    return err(error instanceof Error ? error.message : 'Error updating language preference');
  }
};
