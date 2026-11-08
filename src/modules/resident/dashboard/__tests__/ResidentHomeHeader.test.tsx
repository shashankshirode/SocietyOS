import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentHomeHeader } from '../components/ResidentHomeHeader';

describe('ResidentHomeHeader', () => {
  it('displays society, unit, greeting, resident name and handles interactions', async () => {
    const onSwitchResidence = jest.fn();
    const onOpenNotifications = jest.fn();
    const onOpenProfile = jest.fn();

    await renderWithProviders(
      <ResidentHomeHeader
        societyName="Greenwood Heights"
        unitName="A-1204 • Tower A"
        greeting="Good afternoon"
        residentName="Shashank Shirode"
        topInset={20}
        statusText="All caught up at home"
        statusTone="calm"
        onSwitchResidence={onSwitchResidence}
        onOpenNotifications={onOpenNotifications}
        onOpenProfile={onOpenProfile}
      />,
    );

    expect(screen.getByText('Greenwood Heights')).toBeTruthy();
    expect(screen.getByText('A-1204 • Tower A')).toBeTruthy();
    expect(screen.getByText('Good afternoon,')).toBeTruthy();
    expect(screen.getByTestId('resident-dashboard-name')).toBeTruthy();
    expect(screen.getByText('Shashank')).toBeTruthy();
    expect(screen.getByText('All caught up at home')).toBeTruthy();

    const switchBtn = screen.getByLabelText(
      'Current residence: Greenwood Heights, Unit A-1204 • Tower A. Tap to switch residence.',
    );
    fireEvent.press(switchBtn);
    expect(onSwitchResidence).toHaveBeenCalledTimes(1);

    const profileBtn = screen.getByLabelText('Resident Profile');
    fireEvent.press(profileBtn);
    expect(onOpenProfile).toHaveBeenCalledTimes(1);

    const notifBtn = screen.getByLabelText(/Notifications/);
    fireEvent.press(notifBtn);
    expect(onOpenNotifications).toHaveBeenCalledTimes(1);
  });
});

