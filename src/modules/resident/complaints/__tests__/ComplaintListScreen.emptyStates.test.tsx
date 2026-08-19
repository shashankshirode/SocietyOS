import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ComplaintListScreen } from '../screens/ComplaintListScreen';
import { enMessages } from '../../../../messages/en';

jest.mock('../data/useComplaints', () => ({
  useComplaints: jest.fn(() => ({ data: [], isLoading: false, error: null, refetch: jest.fn() })),
}));

describe('ComplaintListScreen empty states', () => {
  it('shows filter-specific messages and a functional raise action', async () => {
    const navigation = { navigate: jest.fn(), goBack: jest.fn() };
    await renderWithProviders(<ComplaintListScreen navigation={navigation as never} route={{ params: {} } as never} />);

    expect(screen.getByText('No complaints yet')).toBeOnTheScreen();
    expect(screen.queryByText(/^resident\.|^complaints\./)).toBeNull();
    fireEvent.press(screen.getByText('Raise Complaint'));
    expect(navigation.navigate).toHaveBeenCalledWith('CreateComplaint');
  });

  it('defines distinct empty copy for every complaint filter', () => {
    const empty = enMessages.complaints.empty;
    expect(new Set([empty.all.title, empty.open.title, empty.inProgress.title, empty.resolved.title, empty.closed.title]).size).toBe(5);
    expect(empty.inProgress.title).toBe('No complaints in progress');
  });
});
