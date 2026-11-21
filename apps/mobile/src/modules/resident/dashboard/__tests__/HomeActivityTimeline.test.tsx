import React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { HomeActivityTimeline } from '../components/HomeActivityTimeline';
import type { HomeActivityItem } from '../data/dashboard.types';

describe('HomeActivityTimeline', () => {
  it('renders activity items and dispatches interaction callbacks', async () => {
    const mockActivities: HomeActivityItem[] = [
      {
        id: 'act-1',
        title: 'Milk Delivery (Amul) checked in',
        description: 'Inside society · Main Gate',
        module: 'visitor',
        timestampLabel: 'Today, 8:30 AM',
      },
      {
        id: 'act-2',
        title: 'July Maintenance ₹4,850 recorded',
        description: 'Payment successful via UPI',
        module: 'billing',
        timestampLabel: 'Yesterday',
      },
    ];

    const onItemPress = jest.fn();
    const onViewAll = jest.fn();

    await renderWithProviders(
      <HomeActivityTimeline
        activities={mockActivities}
        onItemPress={onItemPress}
        onViewAll={onViewAll}
      />,
    );

    expect(screen.getByText('Around your home')).toBeTruthy();
    expect(screen.getByText('View all activity ›')).toBeTruthy();
    expect(screen.getByText('Milk Delivery (Amul) checked in')).toBeTruthy();
    expect(screen.getByText('July Maintenance ₹4,850 recorded')).toBeTruthy();

    fireEvent.press(screen.getByText('Milk Delivery (Amul) checked in'));
    expect(onItemPress).toHaveBeenCalledWith(mockActivities[0]);

    fireEvent.press(screen.getByLabelText('View all home activities'));
    expect(onViewAll).toHaveBeenCalledTimes(1);
  });
});
