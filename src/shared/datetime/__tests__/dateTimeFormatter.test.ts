import {
  formatAppDateTime,
  formatAppDate,
  formatAppTime,
  parseDateTimeInput,
} from '../date-time-formatter';
import { dateTimePreferencesService } from '../date-time-preferences.service';

describe('Centralized Date & Time Formatter', () => {
  beforeEach(() => {
    dateTimePreferencesService.resetForTesting();
  });

  const SAMPLE_UTC = '2026-07-09T03:30:00.000Z'; // 9 Jul 2026, 09:00 in Asia/Kolkata (+05:30)

  describe('Default Format', () => {
    it('formats default date/time without year as 9 Jul · 9:00 AM', () => {
      const result = formatAppDateTime(SAMPLE_UTC, {
        includeYear: false,
        timeZone: 'Asia/Kolkata',
      });
      expect(result).toBe('9 Jul · 9:00 AM');
    });

    it('formats default date/time with year as 9 Jul 2026 · 9:00 AM', () => {
      const result = formatAppDateTime(SAMPLE_UTC, {
        includeYear: true,
        timeZone: 'Asia/Kolkata',
      });
      expect(result).toBe('9 Jul 2026 · 9:00 AM');
    });
  });

  describe('Supported Date Formats', () => {
    it('formats D_MMM_YYYY as 9 Jul 2026', () => {
      const result = formatAppDate(SAMPLE_UTC, {
        dateFormat: 'D_MMM_YYYY',
        includeYear: true,
        timeZone: 'Asia/Kolkata',
      });
      expect(result).toBe('9 Jul 2026');
    });

    it('formats DD_MM_YYYY as 09/07/2026', () => {
      const result = formatAppDate(SAMPLE_UTC, {
        dateFormat: 'DD_MM_YYYY',
        includeYear: true,
        timeZone: 'Asia/Kolkata',
      });
      expect(result).toBe('09/07/2026');
    });

    it('formats MM_DD_YYYY as 07/09/2026', () => {
      const result = formatAppDate(SAMPLE_UTC, {
        dateFormat: 'MM_DD_YYYY',
        includeYear: true,
        timeZone: 'Asia/Kolkata',
      });
      expect(result).toBe('07/09/2026');
    });

    it('formats MMM_D_YYYY as Jul 9, 2026', () => {
      const result = formatAppDate(SAMPLE_UTC, {
        dateFormat: 'MMM_D_YYYY',
        includeYear: true,
        timeZone: 'Asia/Kolkata',
      });
      expect(result).toBe('Jul 9, 2026');
    });
  });

  describe('Supported Time Formats', () => {
    it('formats 12-hour morning as 9:00 AM', () => {
      const result = formatAppTime(SAMPLE_UTC, {
        timeFormat: 'TWELVE_HOUR',
        timeZone: 'Asia/Kolkata',
      });
      expect(result).toBe('9:00 AM');
    });

    it('formats 24-hour morning as 09:00', () => {
      const result = formatAppTime(SAMPLE_UTC, {
        timeFormat: 'TWENTY_FOUR_HOUR',
        timeZone: 'Asia/Kolkata',
      });
      expect(result).toBe('09:00');
    });

    it('formats noon as 12:00 PM and 12:00', () => {
      const noonIso = '2026-07-09T06:30:00.000Z'; // 12:00 PM in IST
      expect(formatAppTime(noonIso, { timeFormat: 'TWELVE_HOUR', timeZone: 'Asia/Kolkata' })).toBe('12:00 PM');
      expect(formatAppTime(noonIso, { timeFormat: 'TWENTY_FOUR_HOUR', timeZone: 'Asia/Kolkata' })).toBe('12:00');
    });

    it('formats midnight as 12:00 AM and 00:00', () => {
      const midnightIso = '2026-07-08T18:30:00.000Z'; // 00:00 in IST
      expect(formatAppTime(midnightIso, { timeFormat: 'TWELVE_HOUR', timeZone: 'Asia/Kolkata' })).toBe('12:00 AM');
      expect(formatAppTime(midnightIso, { timeFormat: 'TWENTY_FOUR_HOUR', timeZone: 'Asia/Kolkata' })).toBe('00:00');
    });

    it('formats afternoon as 3:45 PM and 15:45', () => {
      const pmIso = '2026-07-09T10:15:00.000Z'; // 15:45 in IST
      expect(formatAppTime(pmIso, { timeFormat: 'TWELVE_HOUR', timeZone: 'Asia/Kolkata' })).toBe('3:45 PM');
      expect(formatAppTime(pmIso, { timeFormat: 'TWENTY_FOUR_HOUR', timeZone: 'Asia/Kolkata' })).toBe('15:45');
    });
  });

  describe('Edge cases and Resilience', () => {
    it('safely handles null and undefined inputs with fallback dash', () => {
      expect(formatAppDate(null)).toBe('—');
      expect(formatAppDate(undefined)).toBe('—');
      expect(formatAppTime(null)).toBe('—');
      expect(formatAppTime(undefined)).toBe('—');
      expect(formatAppDateTime(null)).toBe('—');
      expect(formatAppDateTime(undefined)).toBe('—');
    });

    it('safely handles invalid string inputs with fallback dash', () => {
      expect(formatAppDate('not-a-valid-date')).toBe('—');
      expect(formatAppTime('invalid')).toBe('—');
      expect(formatAppDateTime('bogus')).toBe('—');
      expect(parseDateTimeInput('garbage')).toBeNull();
    });

    it('formats year boundary transition correctly', () => {
      const newYearEve = '2026-12-31T23:59:00.000Z';
      const formatted = formatAppDateTime(newYearEve, {
        includeYear: true,
        timeZone: 'UTC',
      });
      expect(formatted).toBe('31 Dec 2026 · 11:59 PM');
    });

    it('formats leap year date correctly', () => {
      const leapDay = '2028-02-29T10:00:00.000Z';
      const formatted = formatAppDateTime(leapDay, {
        includeYear: true,
        timeZone: 'UTC',
      });
      expect(formatted).toBe('29 Feb 2028 · 10:00 AM');
    });

    it('formats custom comma-separated timestamp string "2026-07-09, 09:00"', () => {
      const formatted = formatAppDateTime('2026-07-09, 09:00', {
        includeYear: false,
        timeZone: 'UTC',
      });
      expect(formatted).toBe('9 Jul · 9:00 AM');
    });
  });

  describe('User Preference Persistence', () => {
    it('updates format and reflects in subsequent calls', async () => {
      await dateTimePreferencesService.updatePreferences({
        dateFormat: 'DD_MM_YYYY',
        timeFormat: 'TWENTY_FOUR_HOUR',
      });

      const result = formatAppDateTime(SAMPLE_UTC, {
        includeYear: true,
        timeZone: 'Asia/Kolkata',
      });
      expect(result).toBe('09/07/2026 · 09:00');
    });

    it('isolates preferences by user id', async () => {
      await dateTimePreferencesService.updatePreferences(
        { dateFormat: 'MM_DD_YYYY' },
        'user-1',
      );
      await dateTimePreferencesService.updatePreferences(
        { dateFormat: 'DD_MM_YYYY' },
        'user-2',
      );

      await dateTimePreferencesService.loadPreferences('user-1');
      expect(dateTimePreferencesService.getPreferences().dateFormat).toBe('MM_DD_YYYY');

      await dateTimePreferencesService.loadPreferences('user-2');
      expect(dateTimePreferencesService.getPreferences().dateFormat).toBe('DD_MM_YYYY');
    });
  });
});

