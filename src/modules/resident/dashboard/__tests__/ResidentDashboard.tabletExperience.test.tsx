import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { enMessages } from '../../../../messages/en';
import { ResidentTodayPriorityPanel } from '../../../../ui/patterns/ResidentTodayPriorityPanel';
import { ResidencePulsePanel } from '../../../../ui/patterns/ResidencePulsePanel';
import { residentDashboardMockData } from '../data/dashboard.mockData';
import { createResidentDashboardPersonalization } from '../hooks/useResidentDashboardPersonalization';

const noop = () => undefined;

describe('ResidentDashboard tablet experience', () => {
  it('renders priority and pulse panels as separate composable dashboard regions', async () => {
    const personalization = createResidentDashboardPersonalization({
      dashboard: residentDashboardMockData,
      messages: enMessages,
      role: 'RESIDENT_OWNER',
    });

    await renderWithProviders(
      <>
        <ResidentTodayPriorityPanel
          title={enMessages.resident.priority.title}
          subtitle={enMessages.resident.priority.subtitle}
          viewAllLabel={enMessages.resident.priority.viewAll}
          emptyTitle={enMessages.resident.priority.emptyTitle}
          emptyDescription={enMessages.resident.priority.emptyDescription}
          items={personalization.priorities}
          summary={personalization.prioritySummary}
          onActionPress={noop}
          onViewAllPress={noop}
        />
        <ResidencePulsePanel pulse={personalization.pulse} />
      </>
    );

    expect(screen.getByTestId('resident-today-priority-panel')).toBeTruthy();
    expect(screen.getByTestId('residence-pulse-panel')).toBeTruthy();
  });
});
