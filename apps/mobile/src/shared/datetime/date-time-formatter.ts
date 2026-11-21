/**
 * Centralized Date and Time Formatter
 * Single authoritative formatting layer for Society OS
 */

import {
  UserDateFormatPreference,
  UserTimeFormatPreference,
} from './date-time-preferences.types';
import { dateTimePreferencesService } from './date-time-preferences.service';
import type { Absent } from '../types/absence.types';

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const;

export interface AppFormatOptions {
  includeYear?: boolean;
  timeZone?: string;
  dateFormat?: UserDateFormatPreference;
  timeFormat?: UserTimeFormatPreference;
}

/**
 * Parse an incoming date value safely.
 * Returns null if invalid or missing.
 */
export function parseDateTimeInput(value: string | Date | number | null | Absent): Date | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const str = String(value).trim();
  if (!str) return null;

  // Handle format like "2026-07-09, 09:00"
  const commaMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})[,]\s*(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (commaMatch) {
    const year = Number(commaMatch[1]);
    const month = Number(commaMatch[2]) - 1;
    const day = Number(commaMatch[3]);
    const hour = Number(commaMatch[4]);
    const minute = Number(commaMatch[5]);
    const second = commaMatch[6] ? Number(commaMatch[6]) : 0;
    const date = new Date(Date.UTC(year, month, day, hour, minute, second));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Handle Date-only format "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const parts = str.split('-');
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);
    const date = new Date(Date.UTC(year, month, day));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  // Standard ISO string or timestamp string
  const date = new Date(str);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Format date component according to user preferences
 */
export function formatAppDate(
  value: string | Date | number | null | Absent,
  options?: AppFormatOptions,
): string {
  const date = parseDateTimeInput(value);
  if (!date) return '—';

  const prefs = dateTimePreferencesService.getPreferences();
  const dateFormat = options?.dateFormat ?? prefs.dateFormat;
  const includeYear = options?.includeYear ?? true;
  const timeZone = options?.timeZone;

  // When timezone is UTC or value is date-only string, format in UTC
  const isDateOnly = typeof value === 'string' && /^\d{4}-\d{2}(-\d{2})?$/.test(value.trim());
  const effectiveTimeZone = isDateOnly ? 'UTC' : timeZone;

  try {
    let day: number;
    let monthIndex: number;
    let year: number;

    if (effectiveTimeZone === 'UTC') {
      day = date.getUTCDate();
      monthIndex = date.getUTCMonth();
      year = date.getUTCFullYear();
    } else if (effectiveTimeZone) {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: effectiveTimeZone,
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).formatToParts(date);

      day = Number(parts.find((p) => p.type === 'day')?.value ?? date.getDate());
      monthIndex = Number(parts.find((p) => p.type === 'month')?.value ?? (date.getMonth() + 1)) - 1;
      year = Number(parts.find((p) => p.type === 'year')?.value ?? date.getFullYear());
    } else {
      day = date.getDate();
      monthIndex = date.getMonth();
      year = date.getFullYear();
    }

    const monthShort = MONTH_NAMES_SHORT[monthIndex] ?? 'Jan';
    const dayPadded = String(day).padStart(2, '0');
    const monthPadded = String(monthIndex + 1).padStart(2, '0');

    switch (dateFormat) {
      case 'DD_MM_YYYY':
        return includeYear ? `${dayPadded}/${monthPadded}/${year}` : `${dayPadded}/${monthPadded}`;
      case 'MM_DD_YYYY':
        return includeYear ? `${monthPadded}/${dayPadded}/${year}` : `${monthPadded}/${dayPadded}`;
      case 'MMM_D_YYYY':
        return includeYear ? `${monthShort} ${day}, ${year}` : `${monthShort} ${day}`;
      case 'D_MMM_YYYY':
      default:
        return includeYear ? `${day} ${monthShort} ${year}` : `${day} ${monthShort}`;
    }
  } catch {
    return '—';
  }
}

/**
 * Format time component according to user preferences
 */
export function formatAppTime(
  value: string | Date | number | null | Absent,
  options?: AppFormatOptions,
): string {
  const date = parseDateTimeInput(value);
  if (!date) return '—';

  const prefs = dateTimePreferencesService.getPreferences();
  const timeFormat = options?.timeFormat ?? prefs.timeFormat;
  const timeZone = options?.timeZone;

  try {
    let hours: number;
    let minutes: number;

    if (timeZone === 'UTC') {
      hours = date.getUTCHours();
      minutes = date.getUTCMinutes();
    } else if (timeZone) {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).formatToParts(date);
      hours = Number(parts.find((p) => p.type === 'hour')?.value ?? date.getHours());
      minutes = Number(parts.find((p) => p.type === 'minute')?.value ?? date.getMinutes());
    } else {
      hours = date.getHours();
      minutes = date.getMinutes();
    }

    const minutesPadded = String(minutes).padStart(2, '0');

    if (timeFormat === 'TWENTY_FOUR_HOUR') {
      const hoursPadded = String(hours).padStart(2, '0');
      return `${hoursPadded}:${minutesPadded}`;
    }

    // 12-hour format with uppercase AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours}:${minutesPadded} ${period}`;
  } catch {
    return '—';
  }
}

/**
 * Format date and time unified presentation:
 * Default: "9 Jul · 9:00 AM" (or "9 Jul 2026 · 9:00 AM" when includeYear: true)
 */
export function formatAppDateTime(
  value: string | Date | number | null | Absent,
  options?: AppFormatOptions,
): string {
  const date = parseDateTimeInput(value);
  if (!date) return '—';

  const dateStr = formatAppDate(date, options);
  const timeStr = formatAppTime(date, options);

  if (dateStr === '—' && timeStr === '—') return '—';
  if (dateStr === '—') return timeStr;
  if (timeStr === '—') return dateStr;

  return `${dateStr} · ${timeStr}`;
}
