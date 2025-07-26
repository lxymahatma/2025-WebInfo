import type { TranslationKeys } from "@eduplayground/shared/types/language";

export interface LanguageDB {
  translations: {
    en: TranslationKeys;
    jp: TranslationKeys;
  };
}
