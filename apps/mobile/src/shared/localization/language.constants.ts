import { SupportedLocale } from './language.models';

export const DEFAULT_SUPPORTED_LOCALE = SupportedLocale.EnglishIndia;
export const LANGUAGE_STORAGE_KEY = 'societyos.language.locale';

export const supportedLocales = [
  SupportedLocale.EnglishIndia,
  SupportedLocale.HindiIndia,
  SupportedLocale.MarathiIndia,
] as const;

export function isSupportedLocale(value: string | null): value is SupportedLocale {
  return supportedLocales.some((locale) => locale === value);
}

export function resolveSupportedLocale(languageTag: string): SupportedLocale {
  const normalizedLanguageTag = languageTag.toLowerCase();
  if (normalizedLanguageTag.startsWith('hi')) {
    return SupportedLocale.HindiIndia;
  }
  if (normalizedLanguageTag.startsWith('mr')) {
    return SupportedLocale.MarathiIndia;
  }
  return DEFAULT_SUPPORTED_LOCALE;
}
