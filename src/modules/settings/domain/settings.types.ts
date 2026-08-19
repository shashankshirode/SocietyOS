import type { SupportedLocale } from '../../../shared/localization/language.models';

export type AppearancePreference =
  | 'light'
  | 'dark'
  | 'system';

export type AccessibilityPreferences = {
  textScale: 'default' | 'large' | 'extraLarge';
  reduceMotion: boolean;
  highContrast: boolean;
  simplifiedNavigation: boolean;
  screenReaderEnhancements: boolean;
};

export type NotificationPreferences = {
  emergencyAlerts: boolean;
  visitorActivity: boolean;
  complaints: boolean;
  billing: boolean;
  notices: boolean;
  chat: boolean;
  communityUpdates: boolean;
};

export type ResidentSettings = {
  userId: string;
  languageCode: SupportedLocale;
  appearance: AppearancePreference;
  accessibility: AccessibilityPreferences;
  notifications: NotificationPreferences;
};

export interface UpdateLanguageInput {
  userId: string;
  languageCode: SupportedLocale;
}

export interface UpdateAppearanceInput {
  userId: string;
  appearance: AppearancePreference;
}

export interface UpdateAccessibilityInput {
  userId: string;
  accessibility: Partial<AccessibilityPreferences>;
}

export interface UpdateNotificationPreferencesInput {
  userId: string;
  notifications: Partial<NotificationPreferences>;
}
