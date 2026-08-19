import { renderWithProviders } from '../../../../test/testUtils';
import { screen } from '@testing-library/react-native';
import React from 'react';
import { DailyInsightsBottomSheet } from '../../dashboard/components/insights/DailyInsightsBottomSheet';
import type { ResidentContextualInsightsResult } from '../data/residentContextualInsights.types';

describe('DailyInsightsMockDataIntegrity', () => {
  const baseAdvisory = {
    id: 'adv-1',
    areaId: 'area-1',
    type: 'roadBlock' as const,
    priority: 'high' as const,
    titleMessageKey: 'resident.dashboard.greetingMorning',
    descriptionMessageKey: 'resident.dashboard.greetingEvening',
    shortSuggestionMessageKey: 'resident.dashboard.greetingAfternoon',
    reportedAtIso: new Date().toISOString(),
    source: 'facilityTeam' as const,
  };

  const baseSuggestion = {
    id: 'sug-1',
    priority: 'high' as const,
    iconName: 'warning-outline' as const,
    titleMessageKey: 'resident.dashboard.greetingMorning',
    oneLineMessageKey: 'resident.dashboard.greetingAfternoon',
    detailMessageKey: 'resident.dashboard.greetingEvening',
  };

  it('filters out expired suggestions based on validUntilIso', async () => {
    const expiredTime = new Date(Date.now() - 2 * 3600000).toISOString();
    
    const mockData: ResidentContextualInsightsResult = {
      activeAreaId: 'area-1',
      activeSocietyId: 'soc-1',
      activeUnitId: 'unit-1',
      weatherSnapshot: null,
      advisories: [],
      suggestions: [
        {
          ...baseSuggestion,
          id: 'sug-expired',
          advisory: {
            ...baseAdvisory,
            id: 'adv-expired',
            validUntilIso: expiredTime,
          },
        },
      ],
      topSuggestion: null,
      lastUpdatedIso: new Date().toISOString(),
      nextRefreshDueIso: new Date().toISOString(),
    };

    await renderWithProviders(
      <DailyInsightsBottomSheet
        visible={true}
        onClose={jest.fn()}
        data={mockData}
        onDismissSuggestion={jest.fn()}
      />
    );

    expect(screen.getByTestId('insight-empty-state')).toBeOnTheScreen();
  });

  it('does not filter out suggestions that have future validUntilIso', async () => {
    const futureTime = new Date(Date.now() + 2 * 3600000).toISOString();
    
    const mockData: ResidentContextualInsightsResult = {
      activeAreaId: 'area-1',
      activeSocietyId: 'soc-1',
      activeUnitId: 'unit-1',
      weatherSnapshot: null,
      advisories: [],
      suggestions: [
        {
          ...baseSuggestion,
          id: 'sug-active',
          advisory: {
            ...baseAdvisory,
            id: 'adv-active',
            validUntilIso: futureTime,
          },
        },
      ],
      topSuggestion: null,
      lastUpdatedIso: new Date().toISOString(),
      nextRefreshDueIso: new Date().toISOString(),
    };

    await renderWithProviders(
      <DailyInsightsBottomSheet
        visible={true}
        onClose={jest.fn()}
        data={mockData}
        onDismissSuggestion={jest.fn()}
      />
    );

    expect(screen.queryByTestId('insight-empty-state')).toBeNull();
  });
});
