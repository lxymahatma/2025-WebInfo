export interface TranslationKeys {
  myProfile: string;
  settings: string;
  items: string;
  language: string;
  loading: string;
  name: string;
  password: string;
  profileSettings: string;
  profilePicture: string;
  changeProfilePicture: string;
  uploadFromDevice: string;
  enterImageUrl: string;
  profilePictureUpdated: string;
  chooseFromPresets: string;
  backToProfile: string;
  editProfile: string;
  save: string;
  cancel: string;
  enterNewPassword: string;
  itemsCollection: string;
  close: string;
  equippedItems: string;
  noItemsEquipped: string;
  availableItems: string;
  profilePictureUploaded: string;
}

export interface LanguageResponse {
  translation: TranslationKeys;
  userLanguage: LanguageKey;
}

export interface UpdateLanguageRequest {
  language: LanguageKey;
}

export const LANGUAGE_KEYS = ["en_US", "ja_JP"] as const;

export type LanguageKey = (typeof LANGUAGE_KEYS)[number];
