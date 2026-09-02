import { isTemporalRangeValid, matchesTemporalFilter, resolveTemporalRange } from '../TemporalFilter';

const NOW = new Date('2026-08-21T15:30:00+05:30');

describe('TemporalFilter', () => {
  it('resolves today and the current month without including future days', () => {
    const today = resolveTemporalRange({ preset: 'today' }, NOW);
    const month = resolveTemporalRange({ preset: 'thisMonth' }, NOW);

    expect(today.from?.getHours()).toBe(0);
    expect(today.to?.getHours()).toBe(23);
    expect(month.from?.getDate()).toBe(1);
    expect(month.to?.getDate()).toBe(21);
  });

  it('matches notice dates against a custom inclusive range', () => {
    const range = { preset: 'custom' as const, from: '2026-08-10', to: '2026-08-21' };

    expect(matchesTemporalFilter('2026-08-10', range, NOW)).toBe(true);
    expect(matchesTemporalFilter('2026-08-21', range, NOW)).toBe(true);
    expect(matchesTemporalFilter('2026-08-22', range, NOW)).toBe(false);
  });

  it('rejects inverted and malformed custom ranges', () => {
    expect(isTemporalRangeValid({ preset: 'custom', from: '2026-08-22', to: '2026-08-21' })).toBe(false);
    expect(matchesTemporalFilter('not-a-date', { preset: 'today' }, NOW)).toBe(false);
  });
});
