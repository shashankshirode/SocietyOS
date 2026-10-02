/**
 * Temporal Settings Types
 * 
 * Centralized date/time/timezone preferences for remote owner support.
 * These preferences control how temporal values are displayed across the application.
 */

import type { SupportedLocale } from '../../../shared/localization/language.models';
import type { IanaTimeZone } from '../../../core/temporal/temporal.types';

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

/** Complete temporal preferences */
export interface TemporalPreferences {
  readonly userId: string;
  readonly dateFormat: DateFormatPreference;
  readonly timeFormat: TimeFormatPreference;
  readonly displayTimezoneMode: DisplayTimezoneMode;
  readonly customTimeZone: IanaTimeZone | null;
  readonly locale: SupportedLocale;
}

/** Default temporal preferences */
export const DEFAULT_TEMPORAL_PREFERENCES: Omit<TemporalPreferences, 'userId'> = {
  dateFormat: 'DD_MMM_YYYY',
  timeFormat: 'TWELVE_HOUR',
  displayTimezoneMode: 'DUAL_WHEN_DIFFERENT',
  customTimeZone: null,
  locale: 'en-IN' as SupportedLocale,
};

/** Command types for updating temporal preferences (no Partial for stable commands) */
export interface UpdateDateFormatPreferenceCommand {
  readonly userId: string;
  readonly dateFormat: DateFormatPreference;
}

export interface UpdateTimeFormatPreferenceCommand {
  readonly userId: string;
  readonly timeFormat: TimeFormatPreference;
}

export interface UpdateDisplayTimezoneModeCommand {
  readonly userId: string;
  readonly mode: DisplayTimezoneMode;
}

export interface UpdateCustomTimezoneCommand {
  readonly userId: string;
  readonly customTimeZone: IanaTimeZone | null;
}

export interface UpdateTemporalPreferencesCommand {
  readonly userId: string;
  readonly dateFormat?: DateFormatPreference;
  readonly timeFormat?: TimeFormatPreference;
  readonly displayTimezoneMode?: DisplayTimezoneMode;
  readonly customTimeZone?: IanaTimeZone | null;
}

/** Temporal preferences repository interface */
export interface TemporalPreferencesRepository {
  getPreferences(userId: string): Promise<TemporalPreferences | null>;
  updatePreferences(command: UpdateTemporalPreferencesCommand): Promise<TemporalPreferences>;
  updateDateFormat(command: UpdateDateFormatPreferenceCommand): Promise<TemporalPreferences>;
  updateTimeFormat(command: UpdateTimeFormatPreferenceCommand): Promise<TemporalPreferences>;
  updateDisplayTimezoneMode(command: UpdateDisplayTimezoneModeCommand): Promise<TemporalPreferences>;
  updateCustomTimezone(command: UpdateCustomTimezoneCommand): Promise<TemporalPreferences>;
  resetToDefaults(userId: string): Promise<TemporalPreferences>;
}

/** IANA timezone search result */
export interface TimeZoneSearchResult {
  readonly ianaId: IanaTimeZone;
  readonly displayName: string;        // "New York, USA"
  readonly offset: string;             // "UTC-5:00" or "UTC+5:30"
  readonly currentlyDST: boolean;
}

/** Timezone search query */
export interface TimeZoneSearchQuery {
  readonly query: string;
  readonly limit?: number;
}

/** Temporal preferences for settings UI */
export interface TemporalPreferencesUI {
  readonly dateFormat: DateFormatPreference;
  readonly timeFormat: TimeFormatPreference;
  readonly displayTimezoneMode: DisplayTimezoneMode;
  readonly customTimeZone: IanaTimeZone | null;
  readonly locale: SupportedLocale;
  readonly preview: {
    readonly societyTime: string;
    readonly viewerTime: string;
    readonly societyTimeZoneLabel: string;
    readonly viewerTimeZoneLabel: string;
    readonly isCrossTimezone: boolean;
  };
}
