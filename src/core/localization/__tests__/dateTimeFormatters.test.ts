import {
  formatResidentCurrency,
  formatResidentDate,
  formatResidentDateRange,
  formatResidentDateSeparator,
  formatResidentDateTime,
  formatResidentMonthYear,
} from '../dateTimeFormatters';

const context = { locale: 'en-IN', timezone: 'Asia/Kolkata', now: new Date('2026-07-11T06:00:00.000Z') };

describe('resident date, time and currency formatters', () => {
  it('formats month, date and date-time values without exposing source strings', () => {
    expect(formatResidentMonthYear('2026-01', context)).toBe('Jan 2026');
    expect(formatResidentDate('2026-01-28', context)).toBe('28 Jan 2026');
    expect(formatResidentDateTime('2026-03-03T07:00:00.000Z', context)).toBe('3 Mar 2026, 12:30 PM');
  });

  it('formats same-day ranges with a localized day label', () => {
    expect(formatResidentDateRange({
      startIso: '2026-07-11T03:30:00.000Z',
      endIso: '2026-07-11T05:30:00.000Z',
      context,
    })).toBe('Today, 9:00 AM – 11:00 AM');
    expect(formatResidentDateSeparator('2026-07-10T06:00:00.000Z', context)).toBe('Yesterday, 10 Jul 2026');
  });

  it('formats future ranges and Indian currency safely', () => {
    expect(formatResidentDateRange({
      startIso: '2026-07-12T03:30:00.000Z',
      endIso: '2026-07-12T05:30:00.000Z',
      context,
    })).toBe('12 Jul 2026, 9:00 AM – 11:00 AM');
    expect(formatResidentCurrency(125000)).toContain('1,25,000');
    expect(formatResidentDate('not-a-date', context)).toBe('—');
  });
});
