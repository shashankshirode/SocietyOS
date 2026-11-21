import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { ResidentAppHeader } from '../ResidentAppHeader';
import { resolveResidentHeaderTextLines } from '../ResidentHeaderTitle';

describe('ResidentAppHeader Component', () => {
  it('renders title and subtitle correctly', async () => {
    await renderWithProviders(
      <ResidentAppHeader
        variant="list"
        titleKey="resident.navigation.visitors.title"
        subtitleKey="resident.navigation.visitors.subtitle"
        showBackButton={true}
      />
    );

    expect(screen.getByText('Visitor Passes')).toBeOnTheScreen();
    expect(screen.getByText('Manage flat gate access passes')).toBeOnTheScreen();
  });

  it('renders back button when showBackButton is true', async () => {
    await renderWithProviders(
      <ResidentAppHeader
        variant="list"
        titleKey="resident.navigation.visitors.title"
        showBackButton={true}
      />
    );

    expect(screen.getByRole('button', { name: 'Go back' })).toBeOnTheScreen();
  });

  it('does not render back button when showBackButton is false', async () => {
    await renderWithProviders(
      <ResidentAppHeader
        variant="dashboard"
        titleKey="resident.navigation.home.title"
        showBackButton={false}
      />
    );

    expect(screen.queryByRole('button', { name: 'Go back' })).toBeNull();
  });

  it('renders correctly on tablet width without crash', async () => {
    await renderWithProviders(
      <ResidentAppHeader
        variant="list"
        titleKey="resident.navigation.visitors.title"
        subtitleKey="resident.navigation.visitors.subtitle"
        showBackButton={true}
      />,
      
    );
    expect(screen.getByText('Visitor Passes')).toBeOnTheScreen();
  });

  it('does not render undefined or null text', async () => {
    await renderWithProviders(
      <ResidentAppHeader
        variant="list"
        titleKey="resident.navigation.visitors.title"
        showBackButton={true}
      />
    );
    expect(screen.queryByText('undefined')).toBeNull();
    expect(screen.queryByText('null')).toBeNull();
  });

  it('allows navigation text to use two lines at accessibility font sizes', () => {
    expect(resolveResidentHeaderTextLines(1)).toBe(1);
    expect(resolveResidentHeaderTextLines(1.3)).toBe(2);
    expect(resolveResidentHeaderTextLines(3.1)).toBe(2);
  });
});
