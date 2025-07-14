export interface Translation {
  [key: string]: string;
}

export interface LanguageTranslations {
  [language: string]: Translation;
}

export interface LanguageDB {
  translations: LanguageTranslations;
}

export interface LanguageResponse {
  translations: LanguageTranslations;
  userLanguage?: string;
}

export interface UpdateLanguageRequest {
  language: string;
}
