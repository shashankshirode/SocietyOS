/**
 * Central Temporal Service
 * 
 * Single authoritative formatting engine for all date/time operations.
 * All screens must use this service instead of direct formatting.
 */

import {
  IanaTimeZone,
  UtcInstant,
  LocalDate,
  LocalTime,
  YearMonth,
  ZonedBusinessDateTime,
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
  Clock,
  TemporalValidationResult,
  BusinessDeadline,
} from './temporal.types';

import { SupportedLocale } from '../../shared/localization/language.models';

/** Default clock implementation using real time */
export const systemClock: Clock = {
  now: () => new Date().toISOString() as UtcInstant,
  nowUtc: () => new Date(),
};

/** Default society timezone (India) */
export const DEFAULT_SOCIETY_TIMEZONE: IanaTimeZone = 'Asia/Kolkata' as IanaTimeZone;

/** Default locale */
export const DEFAULT_LOCALE: SupportedLocale = 'en-IN' as SupportedLocale;

/** Default country code */
export const DEFAULT_COUNTRY_CODE = 'IN';

/** Financial year defaults (India: April 1) */
export const DEFAULT_FINANCIAL_YEAR_START_MONTH = 4;
export const DEFAULT_FINANCIAL_YEAR_START_DAY = 1;

/** IANA timezone validation cache */
const validTimezoneCache = new Map<string, boolean>();

/**
 * Validate an IANA timezone identifier
 */
export function isValidTimezone(timezone: string): boolean {
  if (validTimezoneCache.has(timezone)) {
    return validTimezoneCache.get(timezone)!;
  }
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    validTimezoneCache.set(timezone, true);
    return true;
  } catch {
    validTimezoneCache.set(timezone, false);
    return false;
  }
}

/**
 * Parse a date string safely, preserving date-only semantics
 */
export function parseTemporalValue(value: string | Date): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  
  // Year-month format (YYYY-MM) - treat as first day of month in UTC
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [yearPart, monthPart] = value.split('-');
    const year = Number(yearPart);
    const month = Number(monthPart);
    const parsed = new Date(Date.UTC(year, month - 1, 1));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  
  // Date-only format (YYYY-MM-DD) - treat as UTC midnight
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  
  // Full ISO string
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Format a UTC instant as a LocalDate in the given timezone (no time component)
 * CRITICAL: Date-only values must NOT shift by timezone conversion
 */
export function formatLocalDate(
  value: string | Date,
  timeZone: IanaTimeZone,
  locale: SupportedLocale = DEFAULT_LOCALE,
  options: { dateFormat?: DateFormatPreference } = {}
): string {
  const date = parseTemporalValue(value);
  if (!date) return '—';
  
  // For date-only values (YYYY-MM-DD or YYYY-MM), use UTC to prevent timezone shift
  const isDateOnly = typeof value === 'string' && 
    (/^\d{4}-\d{2}$/.test(value) || /^\d{4}-\d{2}-\d{2}$/.test(value));
  
  const formatTimeZone: IanaTimeZone = isDateOnly ? 'UTC' as IanaTimeZone : timeZone;
  
  try {
    const dateFormat = options.dateFormat ?? 'DD_MMM_YYYY';
    return formatDateWithPattern(date, formatTimeZone, locale, dateFormat);
  } catch {
    return '—';
  }
}

/**
 * Format a UTC instant as LocalTime in the given timezone
 */
export function formatLocalTime(
  value: string | Date,
  timeZone: IanaTimeZone,
  locale: SupportedLocale = DEFAULT_LOCALE,
  options: { timeFormat?: TimeFormatPreference } = {}
): string {
  const date = parseTemporalValue(value);
  if (!date) return '—';
  
  try {
    const timeFormat = options.timeFormat ?? 'TWELVE_HOUR';
    return formatTimeWithPattern(date, timeZone, locale, timeFormat);
  } catch {
    return '—';
  }
}

/**
 * Format a UTC instant as both date and time
 */
export function formatDateTime(
  value: string | Date,
  timeZone: IanaTimeZone,
  locale: SupportedLocale = DEFAULT_LOCALE,
  options: TemporalFormatOptions = {}
): FormattedDateTime {
  const date = parseTemporalValue(value);
  if (!date) return { date: '—' };
  
  const dateStr = formatLocalDate(value, timeZone, locale, options);
  const timeStr = formatLocalTime(value, timeZone, locale, options);
  
  return {
    date: dateStr,
    time: timeStr,
  };
}

/**
 * Format a date-only value (LocalDate) - NEVER shifts by timezone
 * This is the CRITICAL function for billing due dates, occupancy dates, etc.
 */
export function formatDateOnly(
  value: string | Date,
  locale: SupportedLocale = DEFAULT_LOCALE,
  options: { dateFormat?: DateFormatPreference } = {}
): string {
  const date = parseTemporalValue(value);
  if (!date) return '—';
  
  // ALWAYS use UTC for date-only values to prevent timezone shift
  try {
    const dateFormat = options.dateFormat ?? 'DD_MMM_YYYY';
    return formatDateWithPattern(date, 'UTC' as IanaTimeZone, locale, dateFormat);
  } catch {
    return '—';
  }
}

/**
 * Format a YearMonth value - NEVER shifts by timezone
 */
export function formatYearMonth(
  value: string | Date,
  locale: SupportedLocale = DEFAULT_LOCALE,
  options: { dateFormat?: DateFormatPreference } = {}
): string {
  const date = parseTemporalValue(value);
  if (!date) return '—';
  
  // Year-month values always use UTC
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: 'UTC',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return '—';
  }
}

/**
 * Format with dual-time display when viewer timezone differs from society timezone
 */
export function formatDualTime(
  instant: UtcInstant,
  societyContext: SocietyTimeContext,
  viewerContext: ViewerTimeContext,
  options: { 
    showTimeZoneLabel?: boolean;
    relativeMode?: 'society' | 'viewer';
  } = {}
): DualTimeDisplay {
  const societyDate = formatDateTime(instant, societyContext.timeZone, societyContext.locale);
  const viewerDate = formatDateTime(instant, viewerContext.timeZone, viewerContext.locale);
  
  // Calculate day difference
  const societyLocal = new Date(instant).toLocaleDateString(societyContext.locale, { 
    timeZone: societyContext.timeZone 
  });
  const viewerLocal = new Date(instant).toLocaleDateString(viewerContext.locale, { 
    timeZone: viewerContext.timeZone 
  });
  
  const isSameDay = societyLocal === viewerLocal;
  const societyDateObj = new Date(instant);
  const viewerDateObj = new Date(instant);
  
  // Calculate day difference
  const societyMidnight = new Date(societyDateObj.toLocaleString('en-US', { 
    timeZone: societyContext.timeZone 
  }));
  societyMidnight.setHours(0, 0, 0, 0);
  
  const viewerMidnight = new Date(viewerDateObj.toLocaleString('en-US', { 
    timeZone: viewerContext.timeZone 
  }));
  viewerMidnight.setHours(0, 0, 0, 0);
  
  const dayDifference = Math.round((viewerMidnight.getTime() - societyMidnight.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    society: {
      date: societyDate.date,
      time: societyDate.time ?? '',
      timeZoneLabel: getTimeZoneLabel(societyContext.timeZone),
    },
    viewer: {
      date: viewerDate.date,
      time: viewerDate.time ?? '',
      timeZoneLabel: getTimeZoneLabel(viewerContext.timeZone),
    },
    isSameDay,
    dayDifference,
  };
}

/**
 * Format relative time (Today, Yesterday, etc.) using the correct timezone reference
 */
export function formatRelativeTime(
  value: string | Date,
  context: RelativeTimeContext,
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  const date = parseTemporalValue(value);
  if (!date) return '—';
  
  const now = new Date(context.referenceInstant);
  
  // Get day identity in both timezones
  const referenceIdentity = getDayIdentity(now, context.referenceTimeZone, context.locale);
  const targetIdentity = getDayIdentity(date, context.targetTimeZone, context.locale);
  
  if (referenceIdentity === targetIdentity) {
    return formatLocalTime(date, context.targetTimeZone, context.locale, { timeFormat: 'TWELVE_HOUR' });
  }
  
  // Check yesterday
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayIdentity = getDayIdentity(yesterday, context.targetTimeZone, context.locale);
  
  if (yesterdayIdentity === targetIdentity) {
    try {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-1, 'day');
    } catch {
      return formatLocalDate(date, context.targetTimeZone, locale);
    }
  }
  
  // Check tomorrow
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowIdentity = getDayIdentity(tomorrow, context.targetTimeZone, context.locale);
  
  if (tomorrowIdentity === targetIdentity) {
    try {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(1, 'day');
    } catch {
      return formatLocalDate(date, context.targetTimeZone, locale);
    }
  }
  
  return formatLocalDate(date, context.targetTimeZone, locale);
}

/**
 * Get society "today" based on society timezone
 */
export function getSocietyToday(societyTimeZone: IanaTimeZone, referenceInstant?: UtcInstant): LocalDate {
  const now = referenceInstant ? new Date(referenceInstant) : new Date();
  const dateStr = now.toLocaleDateString('en-CA', { timeZone: societyTimeZone }); // YYYY-MM-DD
  return dateStr as LocalDate;
}

/**
 * Get viewer "today" based on viewer timezone
 */
export function getViewerToday(viewerTimeZone: IanaTimeZone, referenceInstant?: UtcInstant): LocalDate {
  const now = referenceInstant ? new Date(referenceInstant) : new Date();
  const dateStr = now.toLocaleDateString('en-CA', { timeZone: viewerTimeZone }); // YYYY-MM-DD
  return dateStr as LocalDate;
}

/**
 * Check if two instants represent the same society day
 */
export function isSameSocietyDay(
  instant1: UtcInstant,
  instant2: UtcInstant,
  societyTimeZone: IanaTimeZone
): boolean {
  const date1 = new Date(instant1).toLocaleDateString('en-CA', { timeZone: societyTimeZone });
  const date2 = new Date(instant2).toLocaleDateString('en-CA', { timeZone: societyTimeZone });
  return date1 === date2;
}

/**
 * Check if two instants represent the same viewer day
 */
export function isSameViewerDay(
  instant1: UtcInstant,
  instant2: UtcInstant,
  viewerTimeZone: IanaTimeZone
): boolean {
  const date1 = new Date(instant1).toLocaleDateString('en-CA', { timeZone: viewerTimeZone });
  const date2 = new Date(instant2).toLocaleDateString('en-CA', { timeZone: viewerTimeZone });
  return date1 === date2;
}

/**
 * Resolve the full temporal context from all sources
 */
export function resolveTemporalContext(
  society: SocietyTimeContext,
  viewer: ViewerTimeContext,
  device: DeviceTimeContext,
  clock: Clock = systemClock
): ResolvedTemporalContext {
  const now = clock.now();
  
  return {
    society,
    viewer,
    device,
    now,
    societyToday: getSocietyToday(society.timeZone, now),
    viewerToday: getViewerToday(viewer.timeZone, now),
  };
}

/**
 * Create society time context from configuration
 */
export function createSocietyTimeContext(
  timeZone: IanaTimeZone,
  locale: SupportedLocale = DEFAULT_LOCALE,
  countryCode: string = DEFAULT_COUNTRY_CODE,
  financialYearStartMonth: number = DEFAULT_FINANCIAL_YEAR_START_MONTH,
  financialYearStartDay: number = DEFAULT_FINANCIAL_YEAR_START_DAY
): SocietyTimeContext {
  if (!isValidTimezone(timeZone)) {
    throw new Error(`Invalid society timezone: ${timeZone}`);
  }
  
  return {
    timeZone,
    locale,
    countryCode,
    financialYearStartMonth,
    financialYearStartDay,
  };
}

/**
 * Create viewer time context from preferences
 */
export function createViewerTimeContext(
  timeZone: IanaTimeZone,
  locale: SupportedLocale = DEFAULT_LOCALE,
  dateFormat: DateFormatPreference = 'DD_MMM_YYYY',
  timeFormat: TimeFormatPreference = 'TWELVE_HOUR',
  displayTimezoneMode: DisplayTimezoneMode = 'DUAL_WHEN_DIFFERENT',
  customTimeZone?: IanaTimeZone
): ViewerTimeContext {
  if (!isValidTimezone(timeZone)) {
    throw new Error(`Invalid viewer timezone: ${timeZone}`);
  }
  if (customTimeZone && !isValidTimezone(customTimeZone)) {
    throw new Error(`Invalid custom timezone: ${customTimeZone}`);
  }
  
  const result: ViewerTimeContext = {
    timeZone,
    locale,
    dateFormat,
    timeFormat,
    displayTimezoneMode,
  };
  if (customTimeZone) {
    return { ...result, customTimeZone };
  }
  return result;
  return result;
}

/**
 * Create device time context from runtime
 */
export function createDeviceTimeContext(): DeviceTimeContext {
  let timeZone: IanaTimeZone = DEFAULT_SOCIETY_TIMEZONE;
  try {
    const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (deviceTz && isValidTimezone(deviceTz)) {
      timeZone = deviceTz as IanaTimeZone;
    }
  } catch {}
  
  return {
    timeZone,
    locale: DEFAULT_LOCALE,
  };
}

/**
 * Format a business deadline with dual-time display
 */
export function formatBusinessDeadline(
  deadline: BusinessDeadline,
  viewerContext: ViewerTimeContext
): DualTimeDisplay {
  const societyContext: SocietyTimeContext = {
    timeZone: deadline.societyTimeZone,
    locale: DEFAULT_LOCALE,
    countryCode: DEFAULT_COUNTRY_CODE,
    financialYearStartMonth: DEFAULT_FINANCIAL_YEAR_START_MONTH,
    financialYearStartDay: DEFAULT_FINANCIAL_YEAR_START_DAY,
  };
  
  const viewer: ViewerTimeContext = {
    ...viewerContext,
    displayTimezoneMode: 'DUAL_WHEN_DIFFERENT',
  };
  
  return formatDualTime(deadline.instant, societyContext, viewer);
}

/**
 * Validate a temporal value
 */
export function validateTemporalValue(
  value: string,
  expectedType: 'instant' | 'date' | 'datetime' | 'year-month'
): TemporalValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const parsed = parseTemporalValue(value);
  if (!parsed) {
    return { valid: false, errors: ['Invalid temporal value'], warnings: [] };
  }
  
  switch (expectedType) {
    case 'date':
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        errors.push('Date must be in YYYY-MM-DD format');
      }
      break;
    case 'year-month':
      if (!/^\d{4}-\d{2}$/.test(value)) {
        errors.push('Year-month must be in YYYY-MM format');
      }
      break;
    case 'datetime':
    case 'instant':
      if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        warnings.push('Expected ISO 8601 datetime format');
      }
      break;
  }
  
  if (errors.length > 0) {
    return { valid: false, errors, warnings };
  }
  
  return {
    valid: true,
    errors: [],
    warnings,
    resolved: {
      instant: parsed.toISOString() as UtcInstant,
      localDate: parsed.toLocaleDateString('en-CA', { timeZone: 'UTC' }) as LocalDate,
      localTime: parsed.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false, hour: '2-digit', minute: '2-digit' }) as LocalTime,
      timeZone: 'UTC' as IanaTimeZone,
    },
  };
}

/**
 * Format currency with locale
 */
export function formatCurrency(
  amount: number | { readonly minorUnits: number; readonly currency?: string },
  currencyCode: string = 'INR',
  locale: SupportedLocale = DEFAULT_LOCALE
): string {
  const value = typeof amount === 'number' ? amount : amount.minorUnits / 100;
  const resolvedCurrency = typeof amount === 'object' && amount.currency ? amount.currency : currencyCode;
  
  if (!Number.isFinite(value)) return '—';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: resolvedCurrency,
      maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  } catch {
    return '—';
  }
}

/**
 * Normalize day period (am/pm -> AM/PM)
 */
function normalizeDayPeriod(value: string): string {
  return value.replace(/\b(am|pm)\b/gi, (period) => period.toUpperCase());
}

/**
 * Capitalize first letter
 */
function capitalizeLabel(value: string): string {
  return value.length > 0 ? `${value.charAt(0).toLocaleUpperCase()}${value.slice(1)}` : value;
}

/**
 * Get day identity string for comparison
 */
function getDayIdentity(date: Date, timeZone: IanaTimeZone, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/**
 * Format date with pattern
 */
function formatDateWithPattern(
  date: Date,
  timeZone: IanaTimeZone,
  locale: SupportedLocale,
  dateFormat: DateFormatPreference
): string {
  switch (dateFormat) {
    case 'DD_MM_YYYY':
      return new Intl.DateTimeFormat(locale, { timeZone, day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
    case 'MM_DD_YYYY':
      // US format - use en-US for proper ordering
      return new Intl.DateTimeFormat('en-US', { timeZone, month: '2-digit', day: '2-digit', year: 'numeric' }).format(date);
    case 'DD_MMM_YYYY':
      return new Intl.DateTimeFormat(locale, { timeZone, day: 'numeric', month: 'short', year: 'numeric' }).format(date);
    case 'YYYY_MM_DD':
      return new Intl.DateTimeFormat(locale, { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    case 'SYSTEM_LOCALE':
    default:
      return new Intl.DateTimeFormat(locale, { timeZone, day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  }
}

/**
 * Format time with pattern
 */
function formatTimeWithPattern(
  date: Date,
  timeZone: IanaTimeZone,
  locale: SupportedLocale,
  timeFormat: TimeFormatPreference
): string {
  const hour12 = timeFormat === 'TWELVE_HOUR' || timeFormat === 'SYSTEM_LOCALE';
  const formatted = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12,
  }).format(date);
  
  return normalizeDayPeriod(formatted);
}

/**
 * Normalize day period
 */


/**
 * Get timezone label (short or IANA)
 */
function getTimeZoneLabel(timeZone: IanaTimeZone): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart?.value ?? timeZone;
  } catch {
    return timeZone;
  }
}

