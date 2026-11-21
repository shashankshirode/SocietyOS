import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { enMessages } from '../../../../messages/en';
import { ResidentTodayPriorityPanel } from '../../../../ui/patterns/ResidentTodayPriorityPanel';

describe('TodayCommandCentreAccessibility', () => {
  it('implements correct accessibility roles, labels, and hitSlops', async () => {
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

    
    const container = screen.getByTestId('resident-today-priority-panel');
    expect(container.props.accessibilityRole).toBe('summary');

    
    const badge = screen.getByLabelText('4 items need attention');
    expect(badge).toBeTruthy();

    
    const viewAllCta = screen.getByRole('button', { name: 'View all 4 priorities' });
    expect(viewAllCta).toBeTruthy();
    expect(viewAllCta.props.hitSlop).toBe(12);
  });
});
