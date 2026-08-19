import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ComplaintListScreen } from '../screens/ComplaintListScreen';

jest.mock('../data/useComplaints', () => ({
  useComplaints: jest.fn(() => ({
    data: [],
    isLoading: false,
  })),
}));

describe('ComplaintListScreen Header', () => {
  it('renders the complaints header with a back button', async () => {
    const navigationMock = { navigate: jest.fn(), goBack: jest.fn() };
    await renderWithProviders(
      <ComplaintListScreen
        navigation={navigationMock as never}
        route={{ params: {} } as never}
      />
    );

    expect(screen.getByText('Complaints')).toBeOnTheScreen();
    expect(screen.getByText('Track service requests and SLA')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Go back' })).toBeOnTheScreen();
  });
});
