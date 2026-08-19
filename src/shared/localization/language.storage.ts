import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSupportedLocale, LANGUAGE_STORAGE_KEY } from './language.constants';
import type { SupportedLocale } from './language.models';

export async function readStoredLocale(): Promise<SupportedLocale | null> {
  const value = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  return isSupportedLocale(value) ? value : null;
}

export async function writeStoredLocale(locale: SupportedLocale): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
}
