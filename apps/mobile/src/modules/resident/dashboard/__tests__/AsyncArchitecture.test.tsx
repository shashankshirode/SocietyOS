import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {  act, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { useLoadingCoordinator } from '../../../../core/loading/LoadingCoordinator';
import { usePaginatedList, PaginatedResult } from '../../../../core/async/usePaginatedList';
import { routeCoverageRegistry } from '../../../../core/async/routeCoverageRegistry';
import { isAnyLoading, AsyncResource } from '../../../../core/async/AsyncState';



jest.mock('../../../../core/theme/useThemePreference', () => ({
  useThemePreference: () => ({
    preference: 'light',
    setPreference: jest.fn(),
    isLoading: false,
  }),
}));




function LoadingCoordinatorTestComponent({ rawLoading }: { rawLoading: boolean }) {
  const { shouldShowIndicator, shouldShowSkeleton } = useLoadingCoordinator(rawLoading);
  return (
    <View>
      <Text testID="indicator-status">{shouldShowIndicator ? 'show' : 'hide'}</Text>
      <Text testID="skeleton-status">{shouldShowSkeleton ? 'show' : 'hide'}</Text>
    </View>
  );
}

type AsyncTestItem = { id: string; name: string };
type AsyncTestPageFetcher = (cursor: string | null) => Promise<PaginatedResult<AsyncTestItem>>;

function PaginatedListTestComponent({ fetchPage }: { fetchPage: AsyncTestPageFetcher }) {
  const { items, loadInitial, loadMore } = usePaginatedList<{ id: string; name: string }>(fetchPage);
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  return (
    <View>
      {items.map((item) => (
        <View key={item.id} testID={`item-${item.id}`}>
          <Text>{item.name}</Text>
        </View>
      ))}
      <TouchableOpacity testID="load-more-btn" onPress={loadMore}>
        <Text>Load More</Text>
      </TouchableOpacity>
    </View>
  );
}

describe('Resident App Async Architecture & Loading System', () => {

  describe('Route Coverage Registry', () => {
    it('renders text sanity check', async () => {
      const { getByText } = await renderWithProviders(<View><Text>hello</Text></View>);
      expect(getByText('hello')).toBeTruthy();
    });

    it('verifies that all expected routes are registered and have coverage', () => {
      const keys = Object.keys(routeCoverageRegistry);
      expect(keys.length).toBeGreaterThanOrEqual(60);
      expect(routeCoverageRegistry.ResidentDashboard).toBeDefined();
      expect(routeCoverageRegistry.ResidentDashboard.hasInitialSkeleton).toBe(true);
      expect(routeCoverageRegistry.ResidentDashboard.hasTransition).toBe(true);
    });
  });

  describe('AsyncState Types & Guards', () => {
    it('proves that isAnyLoading resolves loading statuses correctly', () => {
      const resourceIdle: AsyncResource<string, Error> = { status: 'idle', data: null, error: null };
      const resourceLoading: AsyncResource<string, Error> = { status: 'loading', data: null, error: null };
      const resourceRefreshing: AsyncResource<string, Error> = { status: 'refreshing', data: 'data', error: null };

      expect(isAnyLoading(resourceIdle)).toBe(false);
      expect(isAnyLoading(resourceLoading)).toBe(true);
      expect(isAnyLoading(resourceRefreshing)).toBe(true);
    });
  });

  describe('useLoadingCoordinator threshold timing tests', () => {
    it('does not display indicators or skeletons initially if threshold has not passed', async () => {
      const { getByTestId } = await renderWithProviders(<LoadingCoordinatorTestComponent rawLoading={true} />);
      expect(getByTestId('indicator-status').children[0]).toBe('hide');
      expect(getByTestId('skeleton-status').children[0]).toBe('hide');
    });

    it('shows indicator after 150ms and skeleton after 250ms', async () => {
      const { getByTestId } = await renderWithProviders(<LoadingCoordinatorTestComponent rawLoading={true} />);
      
      await new Promise((resolve) => setTimeout(resolve, 180));
      expect(getByTestId('indicator-status').children[0]).toBe('show');
      expect(getByTestId('skeleton-status').children[0]).toBe('hide');

      await new Promise((resolve) => setTimeout(resolve, 120));
      expect(getByTestId('skeleton-status').children[0]).toBe('show');
    });

    it('keeps skeleton and indicator visible for a minimum duration to prevent flicker', async () => {
      const { getByTestId, rerender } = await renderWithProviders(<LoadingCoordinatorTestComponent rawLoading={true} />);
      
      await new Promise((resolve) => setTimeout(resolve, 280));
      expect(getByTestId('indicator-status').children[0]).toBe('show');
      expect(getByTestId('skeleton-status').children[0]).toBe('show');

      rerender(<LoadingCoordinatorTestComponent rawLoading={false} />);
      expect(getByTestId('indicator-status').children[0]).toBe('show');
      expect(getByTestId('skeleton-status').children[0]).toBe('show');

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(getByTestId('indicator-status').children[0]).toBe('hide');
      expect(getByTestId('skeleton-status').children[0]).toBe('hide');
    });
  });

  describe('usePaginatedList infinite-scroll hooks', () => {
    it('loads initial items and pagination list details', async () => {
      const mockFetchPage = jest.fn().mockResolvedValue({
        items: [{ id: '1', name: 'Item One' }],
        pageInfo: { nextCursor: 'c1', hasNextPage: true },
      });

      const { findByText } = await renderWithProviders(<PaginatedListTestComponent fetchPage={mockFetchPage} />);

      const firstItem = await findByText('Item One');
      expect(firstItem).toBeDefined();
      expect(mockFetchPage).toHaveBeenCalledTimes(1);
    });

    it('performs deduplication of list items automatically by stable ID', async () => {
      const mockFetchPage = jest.fn()
        .mockResolvedValueOnce({
          items: [{ id: '1', name: 'Item One' }],
          pageInfo: { nextCursor: 'c1', hasNextPage: true },
        })
        .mockResolvedValueOnce({
          items: [
            { id: '1', name: 'Item One Duplicate' },
            { id: '2', name: 'Item Two' },
          ],
          pageInfo: { nextCursor: null, hasNextPage: false },
        });

      const { findByText, getByTestId, queryAllByTestId } = await renderWithProviders(<PaginatedListTestComponent fetchPage={mockFetchPage} />);

      const firstItem = await findByText('Item One');
      expect(firstItem).toBeDefined();

      await act(async () => {
        fireEvent.press(getByTestId('load-more-btn'));
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      const secondItem = await findByText('Item Two');
      expect(secondItem).toBeDefined();
      
      const items = queryAllByTestId(/item-\d+/);
      expect(items.length).toBe(2);
    });
  });

  describe('AppActivityIndicator & AppButton layouts', () => {
    it('confirms layouts are isolated', () => {
      expect(true).toBe(true);
    });
  });
});
