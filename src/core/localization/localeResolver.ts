import { DEFAULT_LOCALE } from './localization.config';
import { getDefaultsForCountry } from './countryDefaults';

export function resolveLocale(options?: {
  preferencesLocale?: string;
  preferencesCountry?: string;
  societyCountry?: string;
}): string {
  if (options?.preferencesLocale) {
    return options.preferencesLocale;
  }
  if (options?.preferencesCountry) {
    const defaults = getDefaultsForCountry(options.preferencesCountry);
    if (defaults?.locale) {
      return defaults.locale;
    }
  }
  if (options?.societyCountry) {
    const defaults = getDefaultsForCountry(options.societyCountry);
    if (defaults?.locale) {
      return defaults.locale;
    }
  }
  return DEFAULT_LOCALE;
}
