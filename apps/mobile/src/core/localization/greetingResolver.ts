import { defaultGreetingRules } from './localization.config';
import type { GreetingRule } from './localization.types';

export function getHourInTimezone(date: Date, timezone: string): number {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const hourPart = parts.find((part) => part.type === 'hour');
    if (hourPart) {
      return parseInt(hourPart.value, 10);
    }
  } catch {
    return date.getHours();
  }
  return date.getHours();
}

export function resolveGreetingKey(
  date: Date,
  timezone: string,
  rules: GreetingRule[] = defaultGreetingRules
): string {
  const hour = getHourInTimezone(date, timezone);

  for (const rule of rules) {
    const { startHourInclusive, endHourExclusive } = rule;
    if (startHourInclusive < endHourExclusive) {
      if (hour >= startHourInclusive && hour < endHourExclusive) {
        return rule.messageKey;
      }
    } else {
      if (hour >= startHourInclusive || hour < endHourExclusive) {
        return rule.messageKey;
      }
    }
  }

  return 'resident.dashboard.greeting.morning';
}
