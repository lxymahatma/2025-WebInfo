export interface LanguageDB {
  translations: LanguageTranslations;
}

export type Translation = Record<string, string>;

export type LanguageTranslations = Record<string, Translation>;

// API request/response interfaces
export interface LanguageResponse {
  translations: LanguageTranslations;
  userLanguage?: string;
}

export interface UpdateLanguageRequest {
  language: string;
}
