import type { GreetingRule } from './localization.types';

export const defaultGreetingRules: GreetingRule[] = [
  { period: 'morning', startHourInclusive: 5, endHourExclusive: 12, messageKey: 'resident.dashboard.greeting.morning' },
  { period: 'afternoon', startHourInclusive: 12, endHourExclusive: 17, messageKey: 'resident.dashboard.greeting.afternoon' },
  { period: 'evening', startHourInclusive: 17, endHourExclusive: 21, messageKey: 'resident.dashboard.greeting.evening' },
  { period: 'night', startHourInclusive: 21, endHourExclusive: 5, messageKey: 'resident.dashboard.greeting.night' },
];

export const DEFAULT_LOCALE = 'en-IN';
export const DEFAULT_TIMEZONE = 'Asia/Kolkata';
export const DEFAULT_COUNTRY_CODE = 'IN';
