import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { enMessages } from '../../../../messages/en';
import { ResidentTodayPriorityPanel } from '../../../../ui/patterns/ResidentTodayPriorityPanel';

jest.mock('../../../../ui/layout/useResponsiveLayout', () => ({
  useResponsiveLayout: () => ({
    isTablet: false,
    width: 320,
    height: 568,
    screenPadding: 16,
    isSmall: true,
    isNormal: false,
  }),
}));

describe('TodayCommandCentreCompactPhone', () => {
  it('renders correctly on compact phone screen sizes', async () => {
    const copy = enMessages.resident.dashboard;
    const items = [
      { id: '1', title: 'P1', description: 'D1', metaLabel: 'Today', actionLabel: 'Do', tone: 'danger' as const, iconName: 'alert-circle-outline' as const },
      { id: '2', title: 'P2', description: 'D2', metaLabel: 'Today', actionLabel: 'Do', tone: 'warning' as const, iconName: 'alert-circle-outline' as const },
      { id: '3', title: 'P3', description: 'D3', metaLabel: 'Today', actionLabel: 'Do', tone: 'info' as const, iconName: 'alert-circle-outline' as const },
      { id: '4', title: 'P4', description: 'D4', metaLabel: 'Today', actionLabel: 'Do', tone: 'success' as const, iconName: 'alert-circle-outline' as const },
    ];

    await renderWithProviders(
      <ResidentTodayPriorityPanel
        title={copy.todayCommandCentre.title}
        subtitle={copy.todayCommandCentre.subtitle}
        viewAllLabel={copy.todayCommandCentre.viewAll}
        emptyTitle={copy.todayCommandCentre.noPrioritiesTitle}
        emptyDescription={copy.todayCommandCentre.noPrioritiesMessage}
        items={items}
        summary={{ label: 'Needs attention', value: '4' }}
        onActionPress={jest.fn()}
        onViewAllPress={jest.fn()}
      />
    );

    
    expect(screen.getByText(copy.todayCommandCentre.title)).toBeTruthy();
    expect(screen.getByText(copy.todayCommandCentre.subtitle)).toBeTruthy();

    
    expect(screen.getByText('4')).toBeTruthy();

    
    expect(screen.getByText(copy.todayCommandCentre.viewAll)).toBeTruthy();
  });
});
