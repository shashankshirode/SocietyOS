/**
 * Temporal Module - Central Temporal Architecture for Society OS
 * 
 * This module provides the canonical temporal architecture for the entire platform.
 * It enforces strict separation between society business time and viewer display time.
 * 
 * DO NOT use direct date formatting in components. Use the temporal service/hooks.
 */

export * from './temporal.types';
export * from './temporal.service';
export * from './useTemporalContext';

// Re-export key types for convenience
export type {
  IanaTimeZone,
  UtcInstant,
  LocalDate,
  LocalTime,
  YearMonth,
  SocietyTimeContext,
  ViewerTimeContext,
  DeviceTimeContext,
  ResolvedTemporalContext,
  DateFormatPreference,
  TimeFormatPreference,
  DisplayTimezoneMode,
  TemporalFormatOptions,
  FormattedDateTime,
  DualTimeDisplay,
  RelativeTimeContext,
  BusinessDeadline,
  TemporalValidationResult,
  Clock,
  UpdateDateFormatPreferenceCommand,
  UpdateTimeFormatPreferenceCommand,
  UpdateDisplayTimezoneModeCommand,
  UpdateCustomTimezoneCommand,
  UpdateTemporalPreferencesCommand,
} from './temporal.types';

// Re-export key functions for convenience
export {
  formatLocalDate,
  formatLocalTime,
  formatDateTime,
  formatDateOnly,
  formatYearMonth,
  formatDualTime,
  formatRelativeTime,
  getSocietyToday,
  getViewerToday,
  isSameSocietyDay,
  isSameViewerDay,
  formatBusinessDeadline,
  formatCurrency,
  validateTemporalValue,
  createSocietyTimeContext,
  createViewerTimeContext,
  createDeviceTimeContext,
  resolveTemporalContext,
  systemClock,
  DEFAULT_SOCIETY_TIMEZONE,
  DEFAULT_LOCALE,
  DEFAULT_COUNTRY_CODE,
} from './temporal.service';

export { useTemporalContext, useSocietyTime, useViewerTime, useBusinessDeadlines, TemporalProvider } from './useTemporalContext';
