export type Translation = Record<string, string>;

export type LanguageTranslations = Record<string, Translation>;

export interface LanguageResponse {
  translations: LanguageTranslations;
  userLanguage?: string;
}

export interface UpdateLanguageRequest {
  language: string;
}
