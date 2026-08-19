import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { enMessages } from '../../../../messages/en';
import { ResidentTodayPriorityPanel } from '../../../../ui/patterns/ResidentTodayPriorityPanel';

describe('TodayCommandCentreEmptyState', () => {
  it('displays correct empty state titles and does not display count badge when items are empty', async () => {
    const copy = enMessages.resident.dashboard;

    await renderWithProviders(
      <ResidentTodayPriorityPanel
        title={copy.todayCommandCentre.title}
        subtitle={copy.todayCommandCentre.subtitle}
        viewAllLabel={copy.todayCommandCentre.viewAll}
        emptyTitle={copy.todayCommandCentre.noPrioritiesTitle}
        emptyDescription={copy.todayCommandCentre.noPrioritiesMessage}
        items={[]}
        summary={{ label: 'All calm', value: '0' }}
        onActionPress={jest.fn()}
        onViewAllPress={jest.fn()}
      />
    );

    
    expect(screen.getByText(copy.todayCommandCentre.noPrioritiesTitle)).toBeTruthy();
    expect(screen.getByText(copy.todayCommandCentre.noPrioritiesMessage)).toBeTruthy();

    
    expect(screen.queryByText('0')).toBeNull();
    expect(screen.queryByText('0 need attention')).toBeNull();
  });
});
