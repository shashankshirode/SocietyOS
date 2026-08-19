import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react-native';
import { useWindowDimensions } from 'react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { DailyInsightsBottomSheet } from '../../dashboard/components/insights/DailyInsightsBottomSheet';
import type { ResidentContextualInsightsResult } from '../data/residentContextualInsights.types';
import { dailyInsightMessages } from '../../../../messages/en/residentDashboard.messages';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    width: 375,
    height: 812,
    scale: 1,
    fontScale: 1,
  })),
}));

const mockData: ResidentContextualInsightsResult = {
  activeAreaId: 'area-1',
  activeSocietyId: 'soc-1',
  activeUnitId: 'unit-1',
  weatherSnapshot: null,
  advisories: [
    {
      id: 'adv-1',
      areaId: 'Tower B',
      type: 'liftOutage',
      priority: 'high',
      titleMessageKey: 'resident.dashboard.greeting',
      descriptionMessageKey: 'resident.dashboard.GreetingMorning',
      shortSuggestionMessageKey: 'resident.dashboard.GreetingMorning',
      reportedAtIso: new Date(Date.now() - 12 * 60000).toISOString(), 
      validUntilIso: new Date(Date.now() + 2 * 3600000).toISOString(),
      source: 'facilityTeam',
    },
  ],
  suggestions: [
    {
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
        reportedAtIso: new Date(Date.now() - 12 * 60000).toISOString(), 
        validUntilIso: new Date(Date.now() + 2 * 3600000).toISOString(),
        source: 'facilityTeam',
      },
      action: {
        labelMessageKey: 'resident.dashboard.payNow',
        actionType: 'openNotices',
      },
    },
  ],
  topSuggestion: null,
  lastUpdatedIso: new Date().toISOString(),
  nextRefreshDueIso: new Date().toISOString(),
};

describe('DailyInsightsBottomSheet', () => {
  it('renders the details card correctly on successful data fetch', async () => {
    await renderWithProviders(
      <DailyInsightsBottomSheet
        visible={true}
        onClose={jest.fn()}
        data={mockData}
        onDismissSuggestion={jest.fn()}
      />
    );

    
    expect(screen.getByText(dailyInsightMessages.sheet.title)).toBeOnTheScreen();
    expect(screen.getByText(dailyInsightMessages.sheet.subtitle)).toBeOnTheScreen();

    
    expect(screen.getByText('Utility update')).toBeOnTheScreen();
    expect(screen.getByText('Important')).toBeOnTheScreen();
  });

  it('renders loading state skeleton view correctly', async () => {
    await renderWithProviders(
      <DailyInsightsBottomSheet
        visible={true}
        onClose={jest.fn()}
        data={null}
        isLoading={true}
        onDismissSuggestion={jest.fn()}
      />
    );

    expect(screen.getByTestId('insight-loading-state')).toBeOnTheScreen();
  });

  it('renders empty state view correctly when suggestions array is empty', async () => {
    const emptyData = { ...mockData, suggestions: [] };
    await renderWithProviders(
      <DailyInsightsBottomSheet
        visible={true}
        onClose={jest.fn()}
        data={emptyData}
        onDismissSuggestion={jest.fn()}
      />
    );

    expect(screen.getByTestId('insight-empty-state')).toBeOnTheScreen();
    expect(screen.getByText(dailyInsightMessages.sheet.clearTitle)).toBeOnTheScreen();
  });

  it('renders error state view correctly with a Retry option', async () => {
    const onRetry = jest.fn();
    await renderWithProviders(
      <DailyInsightsBottomSheet
        visible={true}
        onClose={jest.fn()}
        data={null}
        error={new Error('Network fail')}
        onRetry={onRetry}
        onDismissSuggestion={jest.fn()}
      />
    );

    expect(screen.getByTestId('insight-error-state')).toBeOnTheScreen();
    expect(screen.getByText(dailyInsightMessages.sheet.loadErrorTitle)).toBeOnTheScreen();

    const retryBtn = screen.getByText(dailyInsightMessages.sheet.retry);
    fireEvent.press(retryBtn);
    expect(onRetry).toHaveBeenCalled();
  });

  it('triggers the primary action correctly', async () => {
    const onDismiss = jest.fn();
    const onClose = jest.fn();
    await renderWithProviders(
      <DailyInsightsBottomSheet
        visible={true}
        onClose={onClose}
        data={mockData}
        onDismissSuggestion={onDismiss}
      />
    );

    const actionBtn = screen.getByTestId('insight-action-openNotice');
    fireEvent.press(actionBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('toggles explanation visibility when why shown is clicked', async () => {
    await renderWithProviders(
      <DailyInsightsBottomSheet
        visible={true}
        onClose={jest.fn()}
        data={mockData}
        onDismissSuggestion={jest.fn()}
      />
    );

    const toggleText = dailyInsightMessages.sheet.whyShown;
    const regex = new RegExp(toggleText, 'i');
    const toggleLink = screen.getByText(regex);
    
    
    expect(screen.queryByTestId('insight-explanation-panel')).toBeNull();
    
    fireEvent.press(toggleLink);

    
    await waitFor(() => {
      expect(screen.getByTestId('insight-explanation-panel')).toBeOnTheScreen();
    });

    
    fireEvent.press(toggleLink);
    await waitFor(() => {
      expect(screen.queryByTestId('insight-explanation-panel')).toBeNull();
    });
  });

  it('uses message-driven accessibility labels for close and explain', async () => {
    await renderWithProviders(
      <DailyInsightsBottomSheet
        visible={true}
        onClose={jest.fn()}
        data={mockData}
        onDismissSuggestion={jest.fn()}
      />
    );

    expect(
      screen.getByRole('button', {
        name: dailyInsightMessages.sheet.close,
      })
    ).toBeOnTheScreen();
  });

  it('renders tablet mode layouts properly when width is wider', async () => {
    (useWindowDimensions as jest.Mock).mockReturnValue({
      width: 800,
      height: 1200,
    });

    await renderWithProviders(
      <DailyInsightsBottomSheet
        visible={true}
        onClose={jest.fn()}
        data={mockData}
        onDismissSuggestion={jest.fn()}
      />
    );

    expect(screen.getByTestId('daily-insights-bottom-sheet')).toHaveStyle({ maxWidth: 760 });
  });

  it('triggers onClose when close button is tapped', async () => {
    const onClose = jest.fn();
    await renderWithProviders(
      <DailyInsightsBottomSheet
        visible={true}
        onClose={onClose}
        data={mockData}
        onDismissSuggestion={jest.fn()}
      />
    );

    const closeBtn = screen.getByTestId('daily-insights-close-btn');
    fireEvent.press(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
