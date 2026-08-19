import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { createBill } from '../../../../test/factories/billFactory';
import { useResidentBills } from '../hooks/useResidentBills';
import { BillListScreen } from '../screens/BillListScreen';

jest.mock('../hooks/useResidentBills', () => ({ useResidentBills: jest.fn() }));

const mockedUseResidentBills = jest.mocked(useResidentBills);
const loadMore = jest.fn();
const refresh = jest.fn();
const retry = jest.fn();
const bill = createBill({ billingPeriod: '2026-01', dueDate: '2026-01-28', title: 'January 2026 Maintenance Bill' });

function renderScreen() {
  const navigation = { navigate: jest.fn() };
  return renderWithProviders(<BillListScreen navigation={navigation} />);
}

function mockHook(overrides: Partial<ReturnType<typeof useResidentBills>> = {}) {
  mockedUseResidentBills.mockReturnValue({
    bills: [bill],
    summary: { totalOutstanding: bill.amount, pendingBillCount: 1, latestBill: bill, currencyCode: 'INR' },
    isInitialLoading: false,
    isLoadingMore: false,
    isRefreshing: false,
    hasMore: true,
    error: null,
    loadMore,
    refresh,
    retry,
    activeResidenceKey: 'context-001',
    ...overrides,
  });
}

describe('BillsAndPayments pagination UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHook();
  });

  it('loads older bills when the list reaches its threshold', async () => {
    await renderScreen();
    fireEvent(screen.getByTestId('resident-bills-list'), 'onEndReached');
    expect(loadMore).toHaveBeenCalledTimes(1);
  });

  it('shows only a compact bottom loader while loading more', async () => {
    mockHook({ isLoadingMore: true });
    await renderScreen();
    expect(screen.getByText('Loading older bills…')).toBeOnTheScreen();
    expect(screen.getByText('January 2026 Maintenance Bill')).toBeOnTheScreen();
  });

  it('preserves filter state through the pagination hook and refreshes the first page', async () => {
    await renderScreen();
    fireEvent.press(screen.getByText('Paid'));
    await waitFor(() => expect(mockedUseResidentBills).toHaveBeenLastCalledWith('paid'));
    fireEvent(screen.getByTestId('resident-bills-list'), 'refresh');
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it('renders localized dates instead of raw billing values', async () => {
    await renderScreen();
    expect(screen.getAllByText(/Jan 2026/).length).toBeGreaterThan(0);
    expect(screen.getByText(/28 Jan 2026/)).toBeOnTheScreen();
    expect(screen.queryByText(/2026-01-28/)).toBeNull();
  });

  it('renders the filter-specific empty state and clear-filter action', async () => {
    mockHook({ bills: [], summary: null, hasMore: false });
    await renderScreen();
    fireEvent.press(screen.getByText('Overdue'));
    await waitFor(() => expect(mockedUseResidentBills).toHaveBeenLastCalledWith('overdue'));
    expect(screen.getByText('No bills found')).toBeOnTheScreen();
    expect(screen.getByText('Show all bills')).toBeOnTheScreen();
  });

  it('uses a content skeleton only for the first page load', async () => {
    mockHook({ bills: [], summary: null, isInitialLoading: true });
    await renderScreen();
    expect(screen.getByTestId('billing-list-skeleton', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.queryByText('Loading older bills…')).toBeNull();
  });
});
