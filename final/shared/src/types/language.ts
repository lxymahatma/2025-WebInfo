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

export interface LanguageResponse {
  translations: Translations;
  userLanguage?: keyof Translations;
}

export interface UpdateLanguageRequest {
  language: keyof Translations;
}
