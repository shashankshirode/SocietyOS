export interface FacilityDateTimeFormatContext {
  readonly locale: string;
  readonly timezone: string;
}

function createDate(isoValue: string): Date {
  const parsed = new Date(isoValue);
  if (Number.isNaN(parsed.getTime())) {
    return new Date(0);
  }
  return parsed;
}

export function formatFacilityLongDate(
  isoValue: string,
  context: FacilityDateTimeFormatContext,
): string {
  return new Intl.DateTimeFormat(context.locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: context.timezone,
  }).format(createDate(isoValue));
}

export function formatFacilityShortDate(
  isoValue: string,
  context: FacilityDateTimeFormatContext,
): string {
  return new Intl.DateTimeFormat(context.locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: context.timezone,
  }).format(createDate(isoValue));
}

export function formatFacilityMonth(
  isoValue: string,
  context: FacilityDateTimeFormatContext,
): string {
  return new Intl.DateTimeFormat(context.locale, {
    month: 'long',
    year: 'numeric',
    timeZone: context.timezone,
  }).format(createDate(isoValue));
}

export function formatFacilityTime(
  isoValue: string,
  context: FacilityDateTimeFormatContext,
): string {
  return new Intl.DateTimeFormat(context.locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: context.timezone,
  }).format(createDate(isoValue));
}

export function formatFacilityTimeRange(
  startsAt: string,
  endsAt: string,
  context: FacilityDateTimeFormatContext,
): string {
  return `${formatFacilityTime(startsAt, context)} – ${formatFacilityTime(endsAt, context)}`;
}

export function formatFacilityDuration(startsAt: string, endsAt: string): string {
  const minutes = Math.max(0, Math.round((Date.parse(endsAt) - Date.parse(startsAt)) / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`;
}

export function formatFacilityCurrency(
  amountInMinorUnits: number,
  currencyCode: string,
  locale: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(amountInMinorUnits / 100);
}

export function formatHoldCountdown(millisecondsRemaining: number): string {
  const secondsRemaining = Math.max(0, Math.ceil(millisecondsRemaining / 1_000));
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function formatFacilityOperatingHours(
  opensAtLocalTime: string,
  closesAtLocalTime: string,
  locale: string,
): string {
  const [openHour = '0', openMinute = '0'] = opensAtLocalTime.split(':');
  const [closeHour = '0', closeMinute = '0'] = closesAtLocalTime.split(':');
  const open = new Date(2000, 0, 1, Number(openHour), Number(openMinute));
  const close = new Date(2000, 0, 1, Number(closeHour), Number(closeMinute));
  const formatter = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' });
  return `${formatter.format(open)} – ${formatter.format(close)}`;
}

export function dateKeyForTimezone(isoValue: string, context: FacilityDateTimeFormatContext): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: context.timezone,
  }).formatToParts(createDate(isoValue));
  const year = parts.find((part) => part.type === 'year')?.value ?? '1970';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';
  return `${year}-${month}-${day}`;
}
