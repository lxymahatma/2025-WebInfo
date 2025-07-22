import { Request } from "express";

// Request interface
export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

// Language data interfaces
export interface Translation {
  [key: string]: string;
}

export interface LanguageTranslations {
  [language: string]: Translation;
}

export interface LanguageDB {
  translations: LanguageTranslations;
}

// API request/response interfaces
export interface LanguageResponse {
  translations: LanguageTranslations;
  userLanguage?: string;
}

export interface UpdateLanguageRequest {
  language: string;
}

export interface ErrorResponse {
  message: string;
}
