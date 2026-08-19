import { DEFAULT_LOCALE } from './localization.config';

let activeLocale = DEFAULT_LOCALE;

export function getActiveLocale(): string {
  return activeLocale;
}

export function setActiveLocale(locale: string): void {
  activeLocale = locale;
}
