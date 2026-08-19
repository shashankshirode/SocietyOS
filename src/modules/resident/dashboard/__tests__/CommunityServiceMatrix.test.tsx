import React from 'react';
import { screen } from '@testing-library/react-native';
import { enMessages } from '../../../../messages/en';
import { renderWithProviders } from '../../../../test/testUtils';
import { CommunityServiceMatrix } from '../components/CommunityServiceMatrix';
import { RESIDENT_DASHBOARD_LIMITS } from '../hooks/useResidentDashboardPersonalization';
import { dashboardNoop, getDashboardFixture } from './dashboardTestFixtures';

describe('CommunityServiceMatrix', () => {
  it('renders a bounded service matrix with verification semantics', async () => {
    const services = getDashboardFixture().communityServices.slice(0, RESIDENT_DASHBOARD_LIMITS.communityServices);
    await renderWithProviders(
      <CommunityServiceMatrix
        services={services}
        onServicePress={dashboardNoop}
        verifiedLabel={enMessages.resident.dashboard.status.societyVerified}
        independentLabel={enMessages.resident.dashboard.status.independentProvider}
      />,
    );
    expect(screen.getAllByText(enMessages.resident.dashboard.status.societyVerified).length).toBeGreaterThan(0);
    expect(screen.getByText(enMessages.resident.dashboard.status.independentProvider)).toBeTruthy();
  });
});
