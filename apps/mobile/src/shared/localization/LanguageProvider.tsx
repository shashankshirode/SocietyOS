import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getLocales } from 'expo-localization';
import type { EnglishMessagesType } from '../../messages/en';
import { setActiveLocale } from '../../core/localization/activeLocale';
import { DEFAULT_SUPPORTED_LOCALE, resolveSupportedLocale } from './language.constants';
import { readStoredLocale, writeStoredLocale } from './language.storage';
import { getMessagesForLocale } from './localizedMessages';
import { SupportedLocale } from './language.models';

type LanguageContextValue = {
  locale: SupportedLocale;
  messages: EnglishMessagesType;
  isReady: boolean;
  setLocale: (locale: SupportedLocale) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLocale(): SupportedLocale {
  const locales = getLocales();
  const deviceLocale = locales && locales.length > 0 ? locales[0] : undefined;
  return deviceLocale
    ? resolveSupportedLocale(deviceLocale.languageTag)
    : DEFAULT_SUPPORTED_LOCALE;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(getInitialLocale);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    void readStoredLocale()
      .then((storedLocale) => {
        if (!active) return;
        const resolvedLocale = storedLocale ?? getInitialLocale();
        setActiveLocale(resolvedLocale);
        setLocaleState(resolvedLocale);
      })
      .finally(() => {
        if (active) setIsReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const setLocale = useCallback(async (nextLocale: SupportedLocale) => {
    setActiveLocale(nextLocale);
    setLocaleState(nextLocale);
    await writeStoredLocale(nextLocale);
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    messages: getMessagesForLocale(locale),
    isReady,
    setLocale,
  }), [isReady, locale, setLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
}

export function useOptionalLanguage(): LanguageContextValue | null {
  return useContext(LanguageContext);
}
