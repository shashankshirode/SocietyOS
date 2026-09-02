import { DEFAULT_TIMEZONE } from './localization.config';
import { getActiveLocale } from './activeLocale';

export type DateTimeFormatContext = {
  locale: string;
  timezone: string;
  countryCode: string;
};

export type FormatDateRangeInput = {
  startIso: string;
  endIso?: string;
  context?: ResidentFormatContext;
};

export type ResidentFormatContext = Partial<DateTimeFormatContext> & {
  now?: Date;
};

function resolveContext(context?: ResidentFormatContext) {
  return {
    locale: context?.locale ?? getActiveLocale(),
    timezone: context?.timezone ?? DEFAULT_TIMEZONE,
    now: context?.now ?? new Date(),
  };
}

function parseResidentDate(value: string | Date): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (/^\d{4}-\d{2}$/.test(value)) {
    const [yearPart, monthPart] = value.split('-');
    if (!yearPart || !monthPart) return null;
    const year = Number(yearPart);
    const month = Number(monthPart);
    const parsedMonth = new Date(Date.UTC(year, month - 1, 1));
    return Number.isNaN(parsedMonth.getTime()) ? null : parsedMonth;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function dateIdentity(date: Date, locale: string, timezone: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function normalizeDayPeriod(value: string): string {
  return value.replace(/\b(am|pm)\b/gi, (period) => period.toUpperCase());
}

function capitalizeLabel(value: string): string {
  return value.length > 0 ? `${value.charAt(0).toLocaleUpperCase()}${value.slice(1)}` : value;
}

export function formatResidentDate(
  value: string | Date,
  context?: ResidentFormatContext,
): string {
  const date = parseResidentDate(value);
  if (!date) return '—';
  const { locale, timezone } = resolveContext(context);
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return '—';
  }
}

export function formatResidentTime(
  value: string | Date,
  context?: ResidentFormatContext,
): string {
  const date = parseResidentDate(value);
  if (!date) return '—';
  const { locale, timezone } = resolveContext(context);
  try {
    return normalizeDayPeriod(new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date));
  } catch {
    return '—';
  }
}

export function formatResidentDateTime(
  value: string | Date,
  context?: ResidentFormatContext,
): string {
  const dateLabel = formatResidentDate(value, context);
  const timeLabel = formatResidentTime(value, context);
  return dateLabel === '—' || timeLabel === '—' ? '—' : `${dateLabel}, ${timeLabel}`;
}

export function formatResidentMonthYear(
  value: string | Date,
  context?: ResidentFormatContext,
): string {
  const date = parseResidentDate(value);
  if (!date) return '—';
  const { locale, timezone } = resolveContext(context);
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: /^\d{4}-\d{2}$/.test(String(value)) ? 'UTC' : timezone,
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return '—';
  }
}

export function formatResidentRelativeTime(
  value: string | Date,
  context?: ResidentFormatContext,
): string {
  const date = parseResidentDate(value);
  if (!date) return '—';
  const { locale, timezone, now } = resolveContext(context);
  try {
    const currentIdentity = dateIdentity(now, locale, timezone);
    const valueIdentity = dateIdentity(date, locale, timezone);
    if (currentIdentity === valueIdentity) return formatResidentTime(date, context);

    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (dateIdentity(yesterday, locale, timezone) === valueIdentity) {
      return capitalizeLabel(new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-1, 'day'));
    }
    return formatResidentDate(date, context);
  } catch {
    return formatResidentDate(date, context);
  }
}

export function formatResidentDateSeparator(
  value: string | Date,
  context?: ResidentFormatContext,
): string {
  const date = parseResidentDate(value);
  if (!date) return '—';
  const { locale, timezone, now } = resolveContext(context);
  const fullDateLabel = formatResidentDate(date, context);
  try {
    const valueIdentity = dateIdentity(date, locale, timezone);
    if (dateIdentity(now, locale, timezone) === valueIdentity) {
      const todayLabel = capitalizeLabel(new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day'));
      return `${todayLabel}, ${fullDateLabel}`;
    }
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (dateIdentity(yesterday, locale, timezone) === valueIdentity) {
      const yesterdayLabel = capitalizeLabel(new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(-1, 'day'));
      return `${yesterdayLabel}, ${fullDateLabel}`;
    }
    return fullDateLabel;
  } catch {
    return fullDateLabel;
  }
}

export function formatResidentCurrency(
  amount: number | { readonly minorUnits: number; readonly currency?: string },
  currencyCode = 'INR',
  context?: Pick<ResidentFormatContext, 'locale'>,
): string {
  const value = typeof amount === 'number' ? amount : amount.minorUnits / 100;
  const resolvedCurrency = typeof amount === 'object' && amount.currency ? amount.currency : currencyCode;
  if (!Number.isFinite(value)) return '—';
  try {
    return new Intl.NumberFormat(context?.locale ?? getActiveLocale(), {
      style: 'currency',
      currency: resolvedCurrency,
      maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  } catch {
    return '—';
  }
}

export function formatResidentStatus(
  value: string | null,
  labels: Readonly<Record<string, string>>,
): string {
  if (!value) return '—';
  return labels[value] ?? '—';
}

export function formatTimePart(date: Date, timezone: string, locale: string): string {
  try {
    return normalizeDayPeriod(date.toLocaleTimeString(locale, {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }));
  } catch {
    const h = date.getHours();
    const m = String(date.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  }
}

export function formatDatePart(date: Date, timezone: string, locale: string, showYear: boolean = true): string {
  try {
    return date.toLocaleDateString(locale, {
      timeZone: timezone,
      day: 'numeric',
      month: 'short',
      year: showYear ? 'numeric' : undefined,
    });
  } catch {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dy = date.getDate();
    const mo = months[date.getMonth()];
    const yr = date.getFullYear();
    return showYear ? `${dy} ${mo} ${yr}` : `${dy} ${mo}`;
  }
}

export function formatResidentDateRange(input: FormatDateRangeInput): string {
  const { startIso, endIso, context } = input;
  const startDate = parseResidentDate(startIso);
  if (!startDate) return '—';
  if (!endIso) return formatResidentDateTime(startDate, context);
  const endDate = parseResidentDate(endIso);
  if (!endDate) return formatResidentDateTime(startDate, context);

  const { locale, timezone, now } = resolveContext(context);
  const startTime = formatResidentTime(startDate, context);
  const endTime = formatResidentTime(endDate, context);
  if (dateIdentity(startDate, locale, timezone) === dateIdentity(endDate, locale, timezone)) {
    const dateLabel = dateIdentity(startDate, locale, timezone) === dateIdentity(now, locale, timezone)
      ? capitalizeLabel(new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day'))
      : formatResidentDate(startDate, context);
    return `${dateLabel}, ${startTime} – ${endTime}`;
  }
  return `${formatResidentDateTime(startDate, context)} – ${formatResidentDateTime(endDate, context)}`;
}

export function formatVisitorEntryExit(
  entryIso: string,
  exitIso?: string,
  timezone: string = DEFAULT_TIMEZONE,
  locale: string = getActiveLocale()
) {
  const entryDate = new Date(entryIso);
  if (isNaN(entryDate.getTime())) {
    return { validFrom: 'N/A', validTill: 'N/A' };
  }

  const entryTimeStr = formatTimePart(entryDate, timezone, locale);

  const todayStr = new Date().toLocaleDateString(locale, { timeZone: timezone });
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString(locale, { timeZone: timezone });
  const entryDayStr = entryDate.toLocaleDateString(locale, { timeZone: timezone });

  let dayPrefix = '';
  if (entryDayStr === todayStr) {
    dayPrefix = 'Today, ';
  } else if (entryDayStr === tomorrowStr) {
    dayPrefix = 'Tomorrow, ';
  } else {
    const showYear = entryDate.getFullYear() !== new Date().getFullYear();
    dayPrefix = `${formatDatePart(entryDate, timezone, locale, showYear)}, `;
  }

  const validFrom = `${dayPrefix}${entryTimeStr}`;

  if (!exitIso) {
    return { validFrom, validTill: 'N/A' };
  }

  const exitDate = new Date(exitIso);
  if (isNaN(exitDate.getTime())) {
    return { validFrom, validTill: 'N/A' };
  }

  const exitTimeStr = formatTimePart(exitDate, timezone, locale);
  const exitDayStr = exitDate.toLocaleDateString(locale, { timeZone: timezone });

  const isSameDay = entryDayStr === exitDayStr;

  let validTill = '';
  if (isSameDay) {
    validTill = exitTimeStr;
  } else {
    let exitDayPrefix = '';
    if (exitDayStr === todayStr) {
      exitDayPrefix = 'Today, ';
    } else if (exitDayStr === tomorrowStr) {
      exitDayPrefix = 'Tomorrow, ';
    } else {
      const showYear = exitDate.getFullYear() !== new Date().getFullYear();
      exitDayPrefix = `${formatDatePart(exitDate, timezone, locale, showYear)}, `;
    }
    validTill = `${exitDayPrefix}${exitTimeStr}`;
  }

  return { validFrom, validTill };
}

export function formatResidentInitials(name: string): string {
  if (!name || !name.trim()) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0]?.slice(0, 2) ?? '??').toUpperCase();
  return `${parts[0]?.charAt(0) ?? ''}${parts[parts.length - 1]?.charAt(0) ?? ''}`.toUpperCase();
}

