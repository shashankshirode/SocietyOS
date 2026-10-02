import type { SupportedLocale } from '../../../shared/localization/language.models';
import type { IanaTimeZone } from '../../../core/temporal/temporal.types';

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

/** Date format preferences */
export type DateFormatPreference =
  | 'SYSTEM_LOCALE'
  | 'DD_MM_YYYY'      // 02/10/2026
  | 'MM_DD_YYYY'      // 10/02/2026
  | 'DD_MMM_YYYY'     // 02 Oct 2026
  | 'YYYY_MM_DD';     // 2026-10-02

/** Time format preferences */
export type TimeFormatPreference =
  | 'SYSTEM_LOCALE'
  | 'TWELVE_HOUR'     // 7:30 PM
  | 'TWENTY_FOUR_HOUR'; // 19:30

/** Display timezone mode */
export type DisplayTimezoneMode =
  | 'SOCIETY'                    // Always show society time
  | 'DEVICE'                     // Use device timezone
  | 'CUSTOM'                     // Use explicit custom timezone
  | 'DUAL_WHEN_DIFFERENT';       // Show both when different

/** Temporal preferences */
export type TemporalPreferences = {
  dateFormat: DateFormatPreference;
  timeFormat: TimeFormatPreference;
  displayTimezoneMode: DisplayTimezoneMode;
  customTimeZone: IanaTimeZone | null;
  locale: string;
};

export type ResidentSettings = {
  userId: string;
  languageCode: SupportedLocale;
  appearance: AppearancePreference;
  accessibility: AccessibilityPreferences;
  notifications: NotificationPreferences;
  temporal: TemporalPreferences;
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

export interface UpdateTemporalPreferencesInput {
  userId: string;
  temporal: Partial<TemporalPreferences>;
}

export interface UpdateTemporalDateFormatInput {
  userId: string;
  dateFormat: 'SYSTEM_LOCALE' | 'DD_MM_YYYY' | 'MM_DD_YYYY' | 'DD_MMM_YYYY' | 'YYYY_MM_DD';
}

export interface UpdateTemporalTimeFormatInput {
  userId: string;
  timeFormat: 'SYSTEM_LOCALE' | 'TWELVE_HOUR' | 'TWENTY_FOUR_HOUR';
}

export interface UpdateTemporalDisplayModeInput {
  userId: string;
  mode: 'SOCIETY' | 'DEVICE' | 'CUSTOM' | 'DUAL_WHEN_DIFFERENT';
}

export interface UpdateTemporalCustomTimezoneInput {
  userId: string;
  customTimeZone: IanaTimeZone | null;
}
