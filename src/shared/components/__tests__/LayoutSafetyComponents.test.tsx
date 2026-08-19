import React from 'react';
import { Text } from 'react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { logoutCurrentSession } from '../../../core/auth/logout';
import { setCurrentSession } from '../../../core/auth/sessionStore';
import { FeatureGate } from '../FeatureGate';
import { PermissionGate } from '../../../core/permissions/PermissionGate';
import { EmptyState } from '../../feedback/EmptyState';
import { ErrorState } from '../../feedback/ErrorState';
import { LogoutButton } from '../LogoutButton';

describe('Milestone 30 shared components', () => {
  it('renders LogoutButton without firing logout prematurely', async () => {
    const onConfirmLogout = jest.fn();
    const screen = await renderWithProviders(<LogoutButton onConfirmLogout={onConfirmLogout} />);

    expect(screen.getByText('Logout')).toBeOnTheScreen();
    expect(onConfirmLogout).not.toHaveBeenCalled();
  });

  it('hides disabled advanced FeatureGate content', async () => {
    const screen = await renderWithProviders(
      <FeatureGate flag="smartAutomation" fallback={<Text>Hidden</Text>}>
        <Text>Marketplace</Text>
      </FeatureGate>
    );

    expect(screen.getByText('Hidden')).toBeOnTheScreen();
    expect(screen.queryByText('Marketplace')).toBeNull();
  });

  it('protects permission-gated content for the active mock role', async () => {
    await setCurrentSession({
      userId: 'resident-test',
      name: 'Test Resident',
      role: 'RESIDENT_OWNER',
      isMockSession: true,
    });

    const screen = await renderWithProviders(
      <PermissionGate permission="SYSTEM_ADMIN" fallback={<Text>Restricted</Text>}>
        <Text>Admin only</Text>
      </PermissionGate>
    );

    expect(screen.getByText('Restricted')).toBeOnTheScreen();
    expect(screen.queryByText('Admin only')).toBeNull();

    screen.unmount();
    await logoutCurrentSession();
  });

  it('renders empty and error state copy', async () => {
    const screen = await renderWithProviders(
      <>
        <EmptyState
          title="No visitors yet"
          description="Create your first visitor pass."
          actionLabel="Create"
          onAction={jest.fn()}
        />
        <ErrorState message="Unable to load." onRetry={jest.fn()} />
      </>
    );

    expect(screen.getByText('No visitors yet')).toBeOnTheScreen();
    expect(screen.getByText('Create your first visitor pass.')).toBeOnTheScreen();
    expect(screen.getByText('Unable to load.')).toBeOnTheScreen();
  });
});
