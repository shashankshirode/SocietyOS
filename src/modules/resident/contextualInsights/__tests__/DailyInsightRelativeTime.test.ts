import { formatRelativeTime } from '../utils/formatRelativeTime';

describe('DailyInsightRelativeTime', () => {
  const mockNow = new Date('2026-07-14T12:00:00.000Z');

  it('formats invalid dates or empty strings to Recently updated', () => {
    expect(formatRelativeTime(undefined)).toBe('Recently updated');
    expect(formatRelativeTime('')).toBe('Recently updated');
    expect(formatRelativeTime('INVALID_DATE')).toBe('Recently updated');
  });

  it('formats future dates to Recently updated', () => {
    const futureDate = new Date(mockNow.getTime() + 100000).toISOString();
    expect(formatRelativeTime(futureDate, { now: mockNow })).toBe('Recently updated');
  });

  it('formats under 1 minute diff as Just now', () => {
    const justNowDate = new Date(mockNow.getTime() - 10000).toISOString();
    expect(formatRelativeTime(justNowDate, { now: mockNow })).toBe('Just now');
  });

  it('formats under 60 minutes as minutes ago', () => {
    const twelveMinsAgo = new Date(mockNow.getTime() - 12 * 60000).toISOString();
    expect(formatRelativeTime(twelveMinsAgo, { now: mockNow })).toBe('12 minutes ago');
  });

  it('formats under 24 hours on same calendar day as hours ago', () => {
    const twoHoursAgo = new Date(mockNow.getTime() - 2 * 3600000).toISOString();
    expect(formatRelativeTime(twoHoursAgo, { now: mockNow })).toBe('2 hours ago');
  });

  it('formats yesterday calendar day as Yesterday', () => {
    const yesterdayDate = new Date('2026-07-13T10:00:00.000Z');
    expect(formatRelativeTime(yesterdayDate.toISOString(), { now: mockNow })).toBe('Yesterday');
  });

  it('formats older dates using localized absolute date', () => {
    const oldDate = new Date('2026-07-10T10:00:00.000Z').toISOString();
    expect(formatRelativeTime(oldDate, { now: mockNow, locale: 'en-US' })).toBe('Jul 10, 2026');
  });
});
