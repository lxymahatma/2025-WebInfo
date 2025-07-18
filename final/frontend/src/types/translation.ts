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

export interface Translations {
  Eng: TranslationKeys;
  JP: TranslationKeys;
}

// API Response Types
export interface User {
  username: string;
  password: string;
}

export interface ProfileResponse {
  user: User;
}

export interface LanguageResponse {
  translations: Translations;
  userLanguage?: string;
}

export interface ErrorResponse {
  message?: string;
}
