import type { TranslationKeys } from "@eduplayground/shared/types/language";

export interface LanguageDB {
  translations: {
    en_US: TranslationKeys;
    ja_JP: TranslationKeys;
    zh_CN: TranslationKeys;
  };
}
