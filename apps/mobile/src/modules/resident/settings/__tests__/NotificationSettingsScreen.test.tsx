import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { NotificationSettingsScreen } from '../screens/NotificationSettingsScreen';
import { ThemeProvider } from '../../../../core/theme/ThemeProvider';

jest.mock('../../../../core/notifications/useNotificationPermission', () => ({
  useNotificationPermission: jest.fn(() => ({
    status: 'granted',
    loading: false,
    askPermission: jest.fn(() => Promise.resolve({ status: 'granted', message: '' })),
  })),
}));

const mockTriggerTest = jest.fn(() => Promise.resolve({ success: true }));

jest.mock('../../../../core/notifications/useLocalNotificationTest', () => ({
  useLocalNotificationTest: jest.fn(() => ({
    triggerTest: mockTriggerTest,
    isSending: false,
  })),
}));

jest.mock('../../../../core/notifications/notificationPreferences', () => ({
  getCachedNotificationPreferences: jest.fn(() => [
    { key: 'emergencyAlerts', label: 'Emergency Alerts', enabled: true, important: true },
    { key: 'visitorAlerts', label: 'Visitor alerts', enabled: true, important: false },
    { key: 'billingReminders', label: 'Billing Reminders', enabled: false, important: false },
  ]),
  updateNotificationPreference: jest.fn(),
}));

describe('NotificationSettingsScreen', () => {
  it('renders status information and toggle states', async () => {
    const navigation = { goBack: jest.fn() };
    await renderWithProviders(
      <ThemeProvider>
        <NotificationSettingsScreen navigation={navigation} />
      </ThemeProvider>
    );

    expect(screen.getByText('Notifications')).toBeOnTheScreen();
    expect(screen.getByText('Notifications are on.')).toBeOnTheScreen();
    expect(screen.getByText('Visitors')).toBeOnTheScreen();
    expect(screen.getByText('Always on')).toBeOnTheScreen();
  });

  it('triggers send test notification action', async () => {
    const navigation = { goBack: jest.fn() };
    await renderWithProviders(
      <ThemeProvider>
        <NotificationSettingsScreen navigation={navigation} />
      </ThemeProvider>
    );

    const testBtn = screen.getByRole('button', { name: /Test notification/ });
    expect(testBtn).toBeOnTheScreen();
    fireEvent.press(testBtn);

    expect(mockTriggerTest).toHaveBeenCalled();
  });
});
