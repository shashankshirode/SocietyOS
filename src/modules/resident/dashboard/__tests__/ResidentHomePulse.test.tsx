import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentHomePulse } from '../components/ResidentHomePulse';
import { getDashboardFixture } from './dashboardTestFixtures';

describe('ResidentHomePulse', () => {
  it('renders 4 operational signals and handles navigation', async () => {
    const fixture = getDashboardFixture();
    const onOpenVisitors = jest.fn();
    const onOpenBills = jest.fn();
    const onOpenComplaints = jest.fn();
    const onOpenFacilities = jest.fn();
    const onExpandPulse = jest.fn();

    await renderWithProviders(
      <ResidentHomePulse
        dashboard={fixture}
        canManageBills={true}
        onOpenVisitors={onOpenVisitors}
        onOpenBills={onOpenBills}
        onOpenComplaints={onOpenComplaints}
        onOpenFacilities={onOpenFacilities}
        onExpandPulse={onExpandPulse}
      />,
    );

    expect(screen.getByText('Home Pulse')).toBeTruthy();
    expect(screen.getByText('See details ›')).toBeTruthy();
    expect(screen.getByText('Gate Access')).toBeTruthy();
    expect(screen.getByText('Helpdesk')).toBeTruthy();
    expect(screen.getByText('Amenities')).toBeTruthy();

    fireEvent.press(screen.getByLabelText(/Gate and Visitors/));
    expect(onOpenVisitors).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByLabelText(/Maintenance balance/));
    expect(onOpenBills).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByLabelText(/Complaints/));
    expect(onOpenComplaints).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByLabelText(/Amenities/));
    expect(onOpenFacilities).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByLabelText('See detailed pulse view'));
    expect(onExpandPulse).toHaveBeenCalledTimes(1);
  });
});

