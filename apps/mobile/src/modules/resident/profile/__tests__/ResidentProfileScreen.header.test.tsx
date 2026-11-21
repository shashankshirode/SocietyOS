import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentProfileScreen } from '../screens/ResidentProfileScreen';

jest.mock('../hooks/useResidentProfile', () => ({
  useResidentProfile: jest.fn(() => ({
    data: {
      name: 'John Doe',
      flatNumber: '101',
      tower: 'A',
      email: 'john@example.com',
      phone: '1234567890',
    },
    isLoading: false,
  })),
}));

describe('ResidentProfileScreen Header', () => {
  it('renders profile header with correct subtitle and back button', async () => {
    const navigationMock = { navigate: jest.fn(), goBack: jest.fn(), getParent: jest.fn() };
    await renderWithProviders(
      <ResidentProfileScreen
        navigation={navigationMock as never}
        route={{ params: {} } as never}
      />
    );

    expect(screen.getByText('Profile')).toBeOnTheScreen();
    expect(screen.getByText('Your unit, family and access')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Go back' })).toBeOnTheScreen();
  });
});
