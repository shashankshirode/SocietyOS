import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { enMessages } from '../../../../messages/en';
import { AsyncContentBoundary } from '../components/AsyncContentBoundary';

describe('TodayCommandCentreLoadingState', () => {
  it('renders section loading state skeleton matches correctly', async () => {
    const copy = enMessages.resident.dashboard;

    await renderWithProviders(
      <AsyncContentBoundary
        status="loading"
        skeletonVariant="priority"
        emptyTitle={copy.todayCommandCentre.noPrioritiesTitle}
        emptyDescription={copy.todayCommandCentre.noPrioritiesMessage}
        errorTitle="Error"
        errorDescription="Error description"
        offlineTitle="Offline"
        offlineDescription="Offline description"
        retryLabel="Retry"
        onRetry={jest.fn()}
        testID="dashboard-priorities"
      >
        <React.Fragment />
      </AsyncContentBoundary>
    );

    
    expect(screen.getByTestId('dashboard-priorities-loading', { includeHiddenElements: true })).toBeTruthy();
  });
});
