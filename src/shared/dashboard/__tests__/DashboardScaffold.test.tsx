import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { DashboardScaffold } from '../DashboardScaffold';

describe('DashboardScaffold', () => {
  it('renders hero, metrics, actions and feed items', async () => {
    const onPress = jest.fn();
    const screen = await renderWithProviders(
      <DashboardScaffold
        eyebrow="Green Valley Heights"
        title="Good evening, A-1204"
        subtitle="Everything important is visible here."
        heroImage="residentHero"
        heroIcon="resident"
        metrics={[
          { id: 'm1', label: 'Guests Today', value: 2, icon: 'visitor' },
          { id: 'm2', label: 'Active Complaints', value: 1, icon: 'complaint' },
        ]}
        actions={[
          { id: 'a1', label: 'Pre-Approve Guest', description: 'Create a pass.', icon: 'visitor', onPress },
        ]}
        feedTitle="Today in your flat"
        feedItems={[
          { id: 'f1', title: 'Water leakage update', subtitle: 'Vendor assigned', status: 'OPEN' },
        ]}
      />
    );

    expect(screen.getByText('Good evening, A-1204')).toBeTruthy();
    expect(screen.getByText('Guests Today')).toBeTruthy();
    expect(screen.getByText('Pre-Approve Guest')).toBeTruthy();
    expect(screen.getByText('Water leakage update')).toBeTruthy();

    fireEvent.press(screen.getByText('Pre-Approve Guest'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders the illustrated empty state when no feed items exist', async () => {
    const screen = await renderWithProviders(
      <DashboardScaffold
        eyebrow="Platform"
        title="Super Admin Console"
        subtitle="No current feed."
        heroImage="superAdminHero"
        metrics={[]}
        actions={[]}
        feedTitle="Watchlist"
        feedItems={[]}
        emptyTitle="Queue is clear"
        emptyMessage="No pending activity."
      />
    );

    expect(screen.getByText('Queue is clear')).toBeTruthy();
    expect(screen.getByText('No pending activity.')).toBeTruthy();
  });
});
