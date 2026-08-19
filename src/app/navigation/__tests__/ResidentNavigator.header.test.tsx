import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { ResidentAppHeader } from '../../../modules/resident/navigation/ResidentAppHeader';

import { enMessages } from '../../../messages/en';

describe('ResidentNavigator Header Configurations', () => {
  it('renders dashboard variant with no back button for Resident Dashboard', async () => {
    await renderWithProviders(
      <ResidentAppHeader
        variant="dashboard"
        titleKey="resident.navigation.home.title"
        showBackButton={false}
      />
    );

    expect(screen.queryByRole('button', { name: enMessages.common.back })).toBeNull();
  });

  it('renders with back button for child and list screens', async () => {
    await renderWithProviders(
      <ResidentAppHeader
        variant="list"
        titleKey="resident.navigation.visitors.title"
        showBackButton={true}
      />
    );

    expect(screen.getByRole('button', { name: enMessages.common.back })).toBeOnTheScreen();
  });
});
