import React from 'react';
import { renderWithProviders } from '../../../../test/testUtils';
import { VisitorListScreen } from '../screens/VisitorListScreen';

jest.mock('../data/useVisitors', () => ({
  useVisitors: jest.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
    refetch: jest.fn(() => Promise.resolve()),
  })),
}));

describe('VisitorListScreen Component', () => {
  it('renders visitor listing surface correctly', async () => {
    const navigationMock = { navigate: jest.fn(), goBack: jest.fn() };
    const screen = await renderWithProviders(
      <VisitorListScreen
        navigation={navigationMock as never}
        route={{ params: {} } as never}
      />
    );
    expect(screen.getByText('Visitor Passes')).toBeOnTheScreen();
  });
});
