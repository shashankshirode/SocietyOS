/**
 * React Hook for User Date/Time Preferences
 * Provides reactive preferences and formatting helpers
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { dateTimePreferencesService } from './date-time-preferences.service';
import {
  UserDateTimePreferences,
  UserDateFormatPreference,
  UserTimeFormatPreference,
} from './date-time-preferences.types';
import {
  formatAppDate,
  formatAppTime,
  formatAppDateTime,
  AppFormatOptions,
} from './date-time-formatter';
import { useAuthSession } from '../../core/auth/useAuthSession';
import type { Absent } from '../types/absence.types';

export function useDateTimePreferences() {
  const { session } = useAuthSession();
  const userId = session?.userId;

  const [preferences, setPreferences] = useState<UserDateTimePreferences>(() =>
    dateTimePreferencesService.getPreferences(),
  );

  useEffect(() => {
    dateTimePreferencesService.setActiveUser(userId);
    setPreferences(dateTimePreferencesService.getPreferences());

    const unsubscribe = dateTimePreferencesService.subscribe((updated) => {
      setPreferences(updated);
    });

    return () => {
      unsubscribe();
    };
  }, [userId]);

  const updateDateFormat = useCallback(
    async (format: UserDateFormatPreference) => {
      await dateTimePreferencesService.updatePreferences({ dateFormat: format }, userId);
    },
    [userId],
  );

  const updateTimeFormat = useCallback(
    async (format: UserTimeFormatPreference) => {
      await dateTimePreferencesService.updatePreferences({ timeFormat: format }, userId);
    },
    [userId],
  );

  const updatePreferences = useCallback(
    async (updates: Partial<Pick<UserDateTimePreferences, 'dateFormat' | 'timeFormat' | 'timeZone'>>) => {
      await dateTimePreferencesService.updatePreferences(updates, userId);
    },
    [userId],
  );

  const formatDate = useCallback(
    (value: string | Date | number | null | Absent, options?: AppFormatOptions) => {
      return formatAppDate(value, {
        dateFormat: preferences.dateFormat,
        timeFormat: preferences.timeFormat,
        ...options,
      });
    },
    [preferences],
  );

  const formatTime = useCallback(
    (value: string | Date | number | null | Absent, options?: AppFormatOptions) => {
      return formatAppTime(value, {
        timeFormat: preferences.timeFormat,
        ...options,
      });
    },
    [preferences],
  );

  const formatDateTime = useCallback(
    (value: string | Date | number | null | Absent, options?: AppFormatOptions) => {
      return formatAppDateTime(value, {
        dateFormat: preferences.dateFormat,
        timeFormat: preferences.timeFormat,
        ...options,
      });
    },
    [preferences],
  );

  return useMemo(
    () => ({
      preferences,
      updateDateFormat,
      updateTimeFormat,
      updatePreferences,
      formatDate,
      formatTime,
      formatDateTime,
    }),
    [
      preferences,
      updateDateFormat,
      updateTimeFormat,
      updatePreferences,
      formatDate,
      formatTime,
      formatDateTime,
    ],
  );
}
