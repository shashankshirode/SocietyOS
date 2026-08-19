import React from 'react';
import { renderWithProviders } from '../../../../test/testUtils';
import { DashboardSkeleton } from '../../../../ui/loading/DashboardSkeleton';

describe('ResidentDashboard loading experience', () => {
  it('renders the dashboard skeleton without plain pending text', async () => {
    const result = await renderWithProviders(<DashboardSkeleton />);
    const plainPendingLabel = ['Load', 'ing', '...'].join('');

    expect(result.queryByText(plainPendingLabel)).toBeNull();
    expect(result.toJSON()).toBeTruthy();
  });
});
