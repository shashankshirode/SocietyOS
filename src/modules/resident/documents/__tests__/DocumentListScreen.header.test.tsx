import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { DocumentVaultHomeScreen } from '../screens/DocumentVaultHomeScreen';

import { MockStoreProvider } from '../../../../core/mockStore/mockStoreProvider';

import { enMessages } from '../../../../messages/en';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('DocumentVaultHomeScreen Header Integration', () => {
  it('renders correct header with translation title and subtitle without crash', async () => {
    await renderWithProviders(
      <MockStoreProvider>
        <DocumentVaultHomeScreen navigation={mockNavigation} />
      </MockStoreProvider>
    );

    
    expect(screen.getByText(enMessages.documents.archiveTitle)).toBeOnTheScreen();
    expect(screen.getByText(enMessages.documents.archiveSubtitle)).toBeOnTheScreen();
  });
});
