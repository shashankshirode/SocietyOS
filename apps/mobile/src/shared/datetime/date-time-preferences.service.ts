/**
 * Date and Time Preferences Service
 * Persists and retrieves user-specific display preferences
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserDateTimePreferences,
  UserDateFormatPreference,
  UserTimeFormatPreference,
  DEFAULT_USER_DATE_FORMAT,
  DEFAULT_USER_TIME_FORMAT,
} from './date-time-preferences.types';

const STORAGE_KEY_PREFIX = 'society-os.user-datetime-prefs.';
const ANONYMOUS_USER_ID = 'anonymous';

type PreferenceListener = (prefs: UserDateTimePreferences) => void;

class DateTimePreferencesService {
  private activeUserId: string = ANONYMOUS_USER_ID;
  private currentPreferences: UserDateTimePreferences = {
    userId: ANONYMOUS_USER_ID,
    dateFormat: DEFAULT_USER_DATE_FORMAT,
    timeFormat: DEFAULT_USER_TIME_FORMAT,
  };
  private listeners: Set<PreferenceListener> = new Set();
  private initializedForUserId: string | null = null;

  public getPreferences(): UserDateTimePreferences {
    return this.currentPreferences;
  }

  public setActiveUser(userId?: string): void {
    const nextUserId = userId?.trim() || ANONYMOUS_USER_ID;
    if (this.activeUserId !== nextUserId || this.initializedForUserId !== nextUserId) {
      this.activeUserId = nextUserId;
      void this.loadPreferences(nextUserId);
    }
  }

  public async loadPreferences(userId?: string): Promise<UserDateTimePreferences> {
    const targetUserId = userId?.trim() || this.activeUserId || ANONYMOUS_USER_ID;
    this.activeUserId = targetUserId;
    const storageKey = `${STORAGE_KEY_PREFIX}${targetUserId}`;

    try {
      const raw = await AsyncStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserDateTimePreferences>;
        const validDateFormat: UserDateFormatPreference =
          parsed.dateFormat === 'DD_MM_YYYY' ||
          parsed.dateFormat === 'MM_DD_YYYY' ||
          parsed.dateFormat === 'MMM_D_YYYY' ||
          parsed.dateFormat === 'D_MMM_YYYY'
            ? parsed.dateFormat
            : DEFAULT_USER_DATE_FORMAT;

        const validTimeFormat: UserTimeFormatPreference =
          parsed.timeFormat === 'TWENTY_FOUR_HOUR' ||
          parsed.timeFormat === 'TWELVE_HOUR'
            ? parsed.timeFormat
            : DEFAULT_USER_TIME_FORMAT;

        this.currentPreferences = {
          userId: targetUserId,
          dateFormat: validDateFormat,
          timeFormat: validTimeFormat,
          ...(parsed.timeZone ? { timeZone: parsed.timeZone } : {}),
        };
      } else {
        this.currentPreferences = {
          userId: targetUserId,
          dateFormat: DEFAULT_USER_DATE_FORMAT,
          timeFormat: DEFAULT_USER_TIME_FORMAT,
        };
      }
    } catch {
      this.currentPreferences = {
        userId: targetUserId,
        dateFormat: DEFAULT_USER_DATE_FORMAT,
        timeFormat: DEFAULT_USER_TIME_FORMAT,
      };
    }

    this.initializedForUserId = targetUserId;
    this.notifyListeners();
    return this.currentPreferences;
  }

  public async updatePreferences(
    updates: Partial<Pick<UserDateTimePreferences, 'dateFormat' | 'timeFormat' | 'timeZone'>>,
    userId?: string,
  ): Promise<UserDateTimePreferences> {
    const targetUserId = userId?.trim() || this.activeUserId || ANONYMOUS_USER_ID;
    const storageKey = `${STORAGE_KEY_PREFIX}${targetUserId}`;

    const nextPreferences: UserDateTimePreferences = {
      ...this.currentPreferences,
      userId: targetUserId,
      ...(updates.dateFormat ? { dateFormat: updates.dateFormat } : {}),
      ...(updates.timeFormat ? { timeFormat: updates.timeFormat } : {}),
      ...(updates.timeZone !== undefined ? { timeZone: updates.timeZone } : {}),
    };

    this.currentPreferences = nextPreferences;
    this.notifyListeners();

    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(nextPreferences));
    } catch (error) {
      console.warn('Failed to persist user date/time preferences to storage:', error);
    }

    return this.currentPreferences;
  }

  public subscribe(listener: PreferenceListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.currentPreferences);
      } catch (error) {
        console.warn('Error in date-time preference listener:', error);
      }
    }
  }

  public resetForTesting(): void {
    this.activeUserId = ANONYMOUS_USER_ID;
    this.initializedForUserId = null;
    this.currentPreferences = {
      userId: ANONYMOUS_USER_ID,
      dateFormat: DEFAULT_USER_DATE_FORMAT,
      timeFormat: DEFAULT_USER_TIME_FORMAT,
    };
    this.listeners.clear();
  }
}

export const dateTimePreferencesService = new DateTimePreferencesService();

