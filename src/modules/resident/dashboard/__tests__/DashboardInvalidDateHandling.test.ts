import type { LocalAreaAdvisory } from '../../contextualInsights/data/residentContextualInsights.types';
import { buildSuggestions, isAdvisoryCurrent } from '../../contextualInsights/utils/contextualSuggestionEngine';
import { formatDashboardDate, normalizeDashboardIsoDate } from '../data/dashboard.normalization';

function advisory(validUntilIso: string): LocalAreaAdvisory {
  return {
    id: 'date-test-advisory',
    areaId: 'area-nashik-road',
    type: 'waterlogging',
    priority: 'high',
    titleMessageKey: 'resident.contextualInsights.title',
    descriptionMessageKey: 'resident.contextualInsights.advisory.waterloggingSuggestion',
    shortSuggestionMessageKey: 'resident.contextualInsights.advisory.waterloggingSuggestion',
    reportedAtIso: '2026-07-13T06:00:00.000Z',
    validUntilIso,
    source: 'mock',
  };
}

describe('Dashboard invalid-date handling', () => {
  const now = Date.parse('2026-07-13T12:00:00.000Z');

  it('uses stable fallbacks instead of leaking invalid or raw ISO values', () => {
    const fallback = '2026-07-13T00:00:00.000Z';
    expect(normalizeDashboardIsoDate('not-a-date', fallback)).toBe(fallback);
    expect(formatDashboardDate('not-a-date', 'Date unavailable')).toBe('Date unavailable');
    expect(formatDashboardDate('2026-07-13T06:00:00.000Z', 'Date unavailable')).toBe('13 Jul 2026');
  });

  it('rejects expired and malformed advisories from current suggestions', () => {
    const expired = advisory('2026-07-13T11:59:59.000Z');
    const malformed = advisory('invalid-date');
    expect(isAdvisoryCurrent(expired, now)).toBe(false);
    expect(isAdvisoryCurrent(malformed, now)).toBe(false);
    expect(buildSuggestions(null, [expired, malformed], now)).toHaveLength(0);
  });
});
