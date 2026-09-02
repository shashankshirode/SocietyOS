import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { AsyncStatus } from '../../../core/async/AsyncState';
import { AsyncBoundary } from '../AsyncBoundary';
import { SafeText } from '../../../shared/components/SafeText';

describe('AsyncBoundary', () => {
  it('renders structure-aware skeleton for initial loading', async () => {
    await renderWithProviders(<AsyncBoundary status={AsyncStatus.INITIAL_LOADING} data={null} testID="boundary" skeletonVariant="list">{(value: string) => <>{value}</>}</AsyncBoundary>);
    expect(screen.getByTestId('boundary')).toBeTruthy();
  });

  it('keeps existing content visible during refresh', async () => {
    await renderWithProviders(<AsyncBoundary status={AsyncStatus.REFRESHING} data="cached" testID="boundary">{(value: string) => <SafeText>{value}</SafeText>}</AsyncBoundary>);
    expect(screen.getByText('cached')).toBeTruthy();
    expect(screen.getByTestId('async-boundary-refresh')).toBeTruthy();
  });

  it('separates empty and error states from loading', async () => {
    await renderWithProviders(<AsyncBoundary status={AsyncStatus.SUCCESS} data={null} emptyTitle="No bookings" emptyDescription="Try another date.">{(value: string) => <SafeText>{value}</SafeText>}</AsyncBoundary>);
    expect(screen.getByText('No bookings')).toBeTruthy();
  });
});