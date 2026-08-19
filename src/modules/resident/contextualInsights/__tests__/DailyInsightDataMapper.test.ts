import { mapSuggestionToViewModel } from '../../dashboard/components/insights/dailyInsightMapper';
import type { ResidentContextualInsightsResult, ResidentContextualSuggestion } from '../data/residentContextualInsights.types';
import { enMessages } from '../../../../messages/en';

describe('DailyInsightDataMapper', () => {
  const mockResult: ResidentContextualInsightsResult = {
    activeAreaId: 'area-1',
    activeSocietyId: 'soc-1',
    activeUnitId: 'unit-1',
    weatherSnapshot: null,
    advisories: [],
    suggestions: [],
    topSuggestion: null,
    lastUpdatedIso: '2026-07-14T12:00:00.000Z',
    nextRefreshDueIso: '2026-07-14T13:00:00.000Z',
  };

  const baseSuggestion: ResidentContextualSuggestion = {
    id: 'sug-1',
    priority: 'high',
    iconName: 'warning-outline',
    titleMessageKey: 'resident.dashboard.greetingMorning',
    oneLineMessageKey: 'resident.dashboard.greetingAfternoon',
    detailMessageKey: 'resident.dashboard.greetingEvening',
    advisory: {
      id: 'adv-1',
      areaId: 'Tower B',
      type: 'liftOutage',
      priority: 'high',
      titleMessageKey: 'resident.dashboard.greetingMorning',
      descriptionMessageKey: 'resident.dashboard.greetingEvening',
      shortSuggestionMessageKey: 'resident.dashboard.greetingAfternoon',
      reportedAtIso: '2026-07-14T11:48:00.000Z', 
      validUntilIso: '2026-07-14T14:00:00.000Z',
      source: 'facilityTeam',
    },
  };

  it('maps suggestion correctly and normalizes titles and descriptions', () => {
    const viewModel = mapSuggestionToViewModel(baseSuggestion, mockResult, enMessages);

    expect(viewModel.id).toBe('sug-1');
    expect(viewModel.categoryLabel).toBe('Utility update');
    expect(viewModel.severityLabel).toBe('Important');
    expect(viewModel.title).toBe(enMessages.resident.dashboard.greetingMorning);
    expect(viewModel.description).toBe(enMessages.resident.dashboard.greetingEvening);
    expect(viewModel.sourceLabel).toBe('Reported by Facility Team');
    expect(viewModel.locationLabel).toBe('Tower B');
    expect(viewModel.updatedLabel).toBe('12 minutes ago');
  });

  it('deduplicates recommendation when it matches description', () => {
    
    const duplicateSuggestion = {
      ...baseSuggestion,
      detailMessageKey: 'resident.dashboard.greetingMorning', 
      oneLineMessageKey: 'resident.dashboard.greetingMorning',
      advisory: {
        ...baseSuggestion.advisory!,
        shortSuggestionMessageKey: 'resident.dashboard.greetingMorning',
      },
    };

    const viewModel = mapSuggestionToViewModel(duplicateSuggestion, mockResult, enMessages);
    expect(viewModel.recommendation).toBeUndefined();
  });
});
