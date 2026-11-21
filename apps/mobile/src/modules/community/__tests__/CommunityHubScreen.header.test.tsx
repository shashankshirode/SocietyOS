import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { CommunityHomeScreen } from '../screens/CommunityHomeScreen';


jest.mock('../data/communityHooks', () => ({
  useCommunityDashboard: jest.fn(() => ({
    data: {
      activeListingsCount: 5,
      skillsRegisteredCount: 12,
      activeBorrowsCount: 2,
      lostItemsActiveCount: 1,
      recentActivities: [],
    },
    isLoading: false,
  })),
}));

describe('CommunityHomeScreen Header', () => {
  it('uses the ResidentPageHeader/ResidentAppHeader with correct title and subtitle keys', async () => {
    const navigationMock = { navigate: jest.fn(), goBack: jest.fn() };
    await renderWithProviders(
      <CommunityHomeScreen navigation={navigationMock} />
    );

    expect(screen.getByText('Around your community')).toBeOnTheScreen();
    expect(screen.getByText('Useful, local and close to home.')).toBeOnTheScreen();
  });

  it('does not render duplicate local header', async () => {
    const navigationMock = { navigate: jest.fn(), goBack: jest.fn() };
    await renderWithProviders(
      <CommunityHomeScreen navigation={navigationMock} />
    );

    const backButtons = screen.queryAllByRole('button', { name: 'Go back' });
    expect(backButtons.length).toBe(1);
  });
});
