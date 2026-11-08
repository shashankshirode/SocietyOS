/**
 * Date and Time Preference Types
 * Centralized user display preferences for Society OS
 */

export type UserDateFormatPreference =
  | 'D_MMM_YYYY'   // 9 Jul 2026
  | 'DD_MM_YYYY'   // 09/07/2026
  | 'MM_DD_YYYY'   // 07/09/2026
  | 'MMM_D_YYYY';  // Jul 9, 2026

export type UserTimeFormatPreference =
  | 'TWELVE_HOUR'       // 9:00 AM
  | 'TWENTY_FOUR_HOUR'; // 09:00

export interface UserDateTimePreferences {
  readonly userId: string;
  readonly dateFormat: UserDateFormatPreference;
  readonly timeFormat: UserTimeFormatPreference;
  readonly timeZone?: string;
}

export const DEFAULT_USER_DATE_FORMAT: UserDateFormatPreference = 'D_MMM_YYYY';
export const DEFAULT_USER_TIME_FORMAT: UserTimeFormatPreference = 'TWELVE_HOUR';

export const DEFAULT_USER_DATE_TIME_PREFERENCES: Omit<UserDateTimePreferences, 'userId'> = {
  dateFormat: DEFAULT_USER_DATE_FORMAT,
  timeFormat: DEFAULT_USER_TIME_FORMAT,
};

