import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { ResidentAppHeader } from '../../../modules/resident/navigation/ResidentAppHeader';
import { SharedResidentTopBar } from '../../../modules/resident/navigation/SharedResidentTopBar';
import {
  residentScreenDefaults,
  isScreenHeaderVisible,
} from '../residentScreenConfiguration';

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

  it('has showHeader true by default in residentScreenDefaults', () => {
    expect(residentScreenDefaults.showHeader).toBe(true);
    expect(isScreenHeaderVisible()).toBe(true);
    expect(isScreenHeaderVisible({ showHeader: false })).toBe(false);
  });

  it('renders SharedResidentTopBar with society, unit, notifications and NO Lab button', async () => {
    await renderWithProviders(
      <SharedResidentTopBar
        societyName="Palm Heights"
        unitName="B-402"
        topInset={20}
      />
    );

    expect(screen.getByText('Palm Heights')).toBeTruthy();
    expect(screen.getByText('B-402')).toBeTruthy();
    expect(screen.getByLabelText(/Notifications/)).toBeTruthy();
    expect(screen.getByLabelText('Resident Profile')).toBeTruthy();
    expect(screen.queryByText('Lab')).toBeNull();
    expect(screen.queryByLabelText(/Scenario Lab/i)).toBeNull();
  });

  it('hides SharedResidentTopBar when visible is false', async () => {
    await renderWithProviders(
      <SharedResidentTopBar
        societyName="Palm Heights"
        unitName="B-402"
        visible={false}
      />
    );

    expect(screen.queryByTestId('shared-resident-top-bar')).toBeNull();
  });
});
