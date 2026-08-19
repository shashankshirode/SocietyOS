import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { NocRequestListScreen } from '../screens/NocRequestListScreen';
import { enMessages } from '../../../../messages/en';

jest.mock('../data/useNocRequests', () => ({
  useNocRequests: jest.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  })),
}));

describe('NocRequestListScreen navigation and empty states', () => {
  it('shows a shared back button and a meaningful default action', async () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };
    await renderWithProviders(<NocRequestListScreen navigation={navigation as never} route={{ params: {} } as never} />);

    expect(screen.getByRole('button', { name: 'Go back' })).toBeOnTheScreen();
    expect(screen.getByText('No NOC or certificate requests yet')).toBeOnTheScreen();
    expect(screen.queryByText(/^resident\.|^noc\./)).toBeNull();
    fireEvent.press(screen.getByText('Request NOC or Certificate'));
    expect(navigation.navigate).toHaveBeenCalledWith('CreateNocRequest');
  });

  it('defines distinct empty copy for every filter', () => {
    const empty = enMessages.resident.noc.empty;
    expect(new Set([empty.all.title, empty.inProgress.title, empty.approved.title, empty.rejected.title]).size).toBe(4);
    expect(empty.approved.title).toBe('No approved certificates yet');
    expect(empty.rejected.title).toBe('No rejected requests');
  });
});
