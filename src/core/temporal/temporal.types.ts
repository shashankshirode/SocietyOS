/**
 * Canonical Temporal Types for Society OS
 * 
 * These types define the authoritative temporal concepts across the platform.
 * They enforce strict separation between:
 * - Society business time (authoritative for rules)
 * - Viewer display time (personal presentation)
 * - UTC instants (authoritative event timestamps)
 * - Date-only values (must not shift by timezone)
 */

import type { SupportedLocale } from '../../shared/localization/language.models';
export type { SupportedLocale } from '../../shared/localization/language.models';

/** IANA timezone identifier (e.g., 'Asia/Kolkata', 'America/New_York') */
export type IanaTimeZone = string & { readonly __brand: unique symbol };

/** UTC Instant - exact moment in time, stored as ISO 8601 UTC string */
export type UtcInstant = string & { readonly __brand: unique symbol };

/** Local Date - calendar date without time, must not shift by timezone (YYYY-MM-DD) */
export type LocalDate = string & { readonly __brand: unique symbol };

/** Local Time - wall-clock time without date (HH:mm[:ss]) */
export type LocalTime = string & { readonly __brand: unique symbol };

/** Year-Month - billing period, financial period (YYYY-MM) */
export type YearMonth = string & { readonly __brand: unique symbol };

/** Zoned Business DateTime - local date/time with explicit IANA zone */
export interface ZonedBusinessDateTime {
  readonly localDate: LocalDate;
  readonly localTime: LocalTime;
  readonly timeZone: IanaTimeZone;
}

/** Society Time Context - authoritative for business rules */
export interface SocietyTimeContext {
  readonly timeZone: IanaTimeZone;
  readonly locale: SupportedLocale;
  readonly countryCode: string;
  readonly financialYearStartMonth: number; // 1-12
  readonly financialYearStartDay: number;   // 1-31
}

/** Viewer Time Context - personal display preferences */
export interface ViewerTimeContext {
  readonly timeZone: IanaTimeZone;
  readonly locale: SupportedLocale;
  readonly dateFormat: DateFormatPreference;
  readonly timeFormat: TimeFormatPreference;
  readonly displayTimezoneMode: DisplayTimezoneMode;
  readonly customTimeZone?: IanaTimeZone;
}

/** Device Time Context - runtime device information */
export interface DeviceTimeContext {
  readonly timeZone: IanaTimeZone;
  readonly locale: SupportedLocale;
}

/** Resolved Temporal Context - combines all sources for formatting */
export interface ResolvedTemporalContext {
  readonly society: SocietyTimeContext;
  readonly viewer: ViewerTimeContext;
  readonly device: DeviceTimeContext;
  readonly now: UtcInstant;
  readonly societyToday: LocalDate;
  readonly viewerToday: LocalDate;
}

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

/** Temporal formatting options */
export interface TemporalFormatOptions {
  readonly dateFormat?: DateFormatPreference;
  readonly timeFormat?: TimeFormatPreference;
  readonly timeZone?: IanaTimeZone;
  readonly locale?: string;
  readonly dualWhenDifferent?: boolean;
  readonly showTimeZoneLabel?: boolean;
  readonly relativeMode?: 'society' | 'viewer';
}

/** Date-time formatting result */
export interface FormattedDateTime {
  readonly date: string;
  readonly time?: string;
  readonly timeZoneLabel?: string;
  readonly dualTime?: {
    readonly viewerDate: string;
    readonly viewerTime: string;
    readonly viewerTimeZoneLabel: string;
  };
}

/** Business deadline context */
export interface BusinessDeadline {
  readonly instant: UtcInstant;
  readonly societyTimeZone: IanaTimeZone;
  readonly societyLocalDate: LocalDate;
  readonly societyLocalTime: LocalTime;
}

/** Calendar event with temporal semantics */
export interface TemporalCalendarEvent {
  readonly id: string;
  readonly title: string;
  readonly start: UtcInstant | ZonedBusinessDateTime;
  readonly end?: UtcInstant | ZonedBusinessDateTime;
  readonly timeZone: IanaTimeZone;
  readonly isAllDay: boolean;
  readonly recurrenceRule?: string;
}

/** Offline event temporal metadata */
export interface OfflineTemporalMetadata {
  readonly createdAt: UtcInstant;
  readonly createdAtLocal: LocalDate;
  readonly createdAtLocalTime: LocalTime;
  readonly deviceTimeZone: IanaTimeZone;
  readonly vectorClock: number;
}

/** Temporal validation result */
export interface TemporalValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
  readonly resolved?: {
    readonly instant: UtcInstant;
    readonly localDate: LocalDate;
    readonly localTime: LocalTime;
    readonly timeZone: IanaTimeZone;
  };
}

/** Temporal preference command types (no Partial for stable commands) */
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

/** Temporal query for business day operations */
export interface SocietyBusinessDayQuery {
  readonly societyTimeZone: IanaTimeZone;
  readonly referenceInstant?: UtcInstant;
  readonly financialYearStartMonth?: number;
  readonly financialYearStartDay?: number;
}

/** Dual-time formatting result for cross-timezone events */
export interface DualTimeDisplay {
  readonly society: {
    readonly date: string;
    readonly time: string;
    readonly timeZoneLabel: string;
  };
  readonly viewer: {
    readonly date: string;
    readonly time: string;
    readonly timeZoneLabel: string;
  };
  readonly isSameDay: boolean;
  readonly dayDifference: number; // viewer days relative to society
}

/** Relative time formatting context */
export interface RelativeTimeContext {
  readonly referenceInstant: UtcInstant;
  readonly referenceTimeZone: IanaTimeZone;
  readonly targetTimeZone: IanaTimeZone;
  readonly locale: SupportedLocale;
}

/** Clock interface for testing */
export interface Clock {
  readonly now: () => UtcInstant;
  readonly nowUtc: () => Date;
}

