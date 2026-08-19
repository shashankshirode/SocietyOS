import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { enMessages } from '../../../../messages/en';
import { ResidencePulsePanel } from '../../../../ui/patterns/ResidencePulsePanel';
import { residentDashboardMockData } from '../data/dashboard.mockData';
import { createResidentDashboardPersonalization } from '../hooks/useResidentDashboardPersonalization';

describe('ResidencePulsePanel', () => {
  it('renders key residence status values', async () => {
    const personalization = createResidentDashboardPersonalization({
      dashboard: residentDashboardMockData,
      messages: enMessages,
      role: 'RESIDENT_OWNER',
    });

    await renderWithProviders(<ResidencePulsePanel pulse={personalization.pulse} />);

    expect(screen.getByTestId('residence-pulse-panel')).toBeTruthy();
    expect(screen.getByText(enMessages.resident.pulse.gateAccess)).toBeTruthy();
    expect(screen.getByText(enMessages.resident.pulse.documents)).toBeTruthy();
    expect(screen.getByText(enMessages.resident.pulse.emergency)).toBeTruthy();
  });
});
