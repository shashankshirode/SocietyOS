import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentQuickActions } from '../components/ResidentQuickActions';

describe('ResidentQuickActions', () => {
  it('renders authorized actions and handles interactions correctly', async () => {
    const onInviteGuest = jest.fn();
    const onPayOrBilling = jest.fn();
    const onRaiseRequest = jest.fn();
    const onBookFacility = jest.fn();

    await renderWithProviders(
      <ResidentQuickActions
        canManageBills={true}
        hasUnpaidBill={true}
        onInviteGuest={onInviteGuest}
        onPayOrBilling={onPayOrBilling}
        onRaiseRequest={onRaiseRequest}
        onBookFacility={onBookFacility}
      />,
    );

    expect(screen.getByText('Invite Guest')).toBeTruthy();
    expect(screen.getByText('Pay Bill')).toBeTruthy();
    expect(screen.getByText('Raise Issue')).toBeTruthy();
    expect(screen.getByText('Book Facility')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Invite Guest: Create a visitor pass'));
    expect(onInviteGuest).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByLabelText('Pay Maintenance: Unpaid bill pending'));
    expect(onPayOrBilling).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByLabelText('Raise Request: Report a maintenance issue or complaint'));
    expect(onRaiseRequest).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByLabelText('Book Facility: Reserve clubhouse or sports amenities'));
    expect(onBookFacility).toHaveBeenCalledTimes(1);
  });
});
