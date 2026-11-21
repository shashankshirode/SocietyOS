import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { BackNavigationButton } from '../BackNavigationButton';
import { HeaderRoleBadge } from '../HeaderRoleBadge';
import { HeaderTitleBlock } from '../HeaderTitleBlock';
import { RoleAwareAppHeader } from '../RoleAwareAppHeader';
import { ThemeProvider } from '../../../core/theme/ThemeProvider';

describe('Navigation Header Systems', () => {
  it('renders BackNavigationButton correctly', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <ThemeProvider>
        <BackNavigationButton onPress={onPress} />
      </ThemeProvider>
    );
    const btn = screen.getByRole('button', { name: 'Go back' });
    expect(btn).toBeOnTheScreen();
  });

  it('renders HeaderRoleBadge with correct labels', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <HeaderRoleBadge role="SUPER_ADMIN" />
      </ThemeProvider>
    );
    expect(screen.getByText('SUPER ADMIN')).toBeOnTheScreen();
  });

  it('renders HeaderTitleBlock correctly', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <HeaderTitleBlock title="Green Valley Heights" subtitle="Phase 2 Cooperative" />
      </ThemeProvider>
    );
    expect(screen.getByText('Green Valley Heights')).toBeOnTheScreen();
    expect(screen.getByText('Phase 2 Cooperative')).toBeOnTheScreen();
  });

  it('renders RoleAwareAppHeader completely', async () => {
    const onBack = jest.fn();
    await renderWithProviders(
      <ThemeProvider>
        <RoleAwareAppHeader
          role="RESIDENT_OWNER"
          title="Resident Owner Panel"
          showBack
          onBack={onBack}
        />
      </ThemeProvider>
    );
    expect(screen.getByText('RESIDENT OWNER')).toBeOnTheScreen();
    expect(screen.getByText('Resident Owner Panel')).toBeOnTheScreen();
  });
});
