import { DEFAULT_TIMEZONE } from './localization.config';
import { getDefaultsForCountry } from './countryDefaults';

export function resolveTimezone(options?: {
  preferencesTimezone?: string;
  societyTimezone?: string;
  societyCountry?: string;
}): string {
  if (options?.preferencesTimezone) {
    return options.preferencesTimezone;
  }
  if (options?.societyTimezone) {
    return options.societyTimezone;
  }
  if (options?.societyCountry) {
    const defaults = getDefaultsForCountry(options.societyCountry);
    if (defaults?.timezone) {
      return defaults.timezone;
    }
  }

  try {
    const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (deviceTimezone) {
      return deviceTimezone;
    }
  } catch {}

  return DEFAULT_TIMEZONE;
}
