import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { BillListScreen } from '../screens/BillListScreen';

jest.mock('../hooks/useResidentBills', () => ({
  useResidentBills: jest.fn(() => ({
    bills: [],
    summary: null,
    isInitialLoading: false,
    isLoadingMore: false,
    isRefreshing: false,
    hasMore: false,
    error: null,
    loadMore: jest.fn(),
    refresh: jest.fn(),
    retry: jest.fn(),
    activeResidenceKey: 'test-residence',
  })),
}));

describe('BillListScreen Header', () => {
  it('renders bills list header with correct subtitle and back button', async () => {
    const navigationMock = { navigate: jest.fn() };
    await renderWithProviders(
      <BillListScreen
        navigation={navigationMock}
      />
    );

    expect(screen.getByText('Bills & Payments')).toBeOnTheScreen();
    expect(screen.getByText('Maintenance, receipts and ledger')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Go back' })).toBeOnTheScreen();
  });
});
