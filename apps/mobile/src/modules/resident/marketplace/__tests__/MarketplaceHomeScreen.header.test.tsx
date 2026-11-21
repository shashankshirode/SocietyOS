import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { MarketplaceHomeScreen } from '../screens/MarketplaceHomeScreen';


jest.mock('../../../community/data/communityHooks', () => ({
  useBorrowRequests: jest.fn(() => ({
    data: [],
    isLoading: false,
  })),
}));

describe('MarketplaceHomeScreen Header', () => {
  it('uses the shared ResidentAppHeader with correct title and subtitle keys', async () => {
    const navigationMock = { navigate: jest.fn(), goBack: jest.fn() };
    await renderWithProviders(
      <MarketplaceHomeScreen navigation={navigationMock} />
    );

    
    expect(screen.getByText('Borrow & Lend')).toBeOnTheScreen();
    expect(screen.getByText('Share tools, appliances and books with your neighbors')).toBeOnTheScreen();
  });

  it('does not render a duplicate local header', async () => {
    const navigationMock = { navigate: jest.fn(), goBack: jest.fn() };
    await renderWithProviders(
      <MarketplaceHomeScreen navigation={navigationMock} />
    );

    
    
    const headers = screen.queryAllByRole('button', { name: 'Go back' });
    expect(headers.length).toBeLessThanOrEqual(1);
  });
});
