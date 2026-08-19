import React from 'react';
import { Text } from 'react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { FeatureGate } from '../FeatureGate';
import { PermissionGate } from '../../../core/permissions/PermissionGate';

describe('FeatureGate', () => {
  it('renders enabled feature content', async () => {
    const screen = await renderWithProviders(
      <FeatureGate flag="visitorManagement">
        <Text>Visitors enabled</Text>
      </FeatureGate>
    );
    expect(screen.getByText('Visitors enabled')).toBeOnTheScreen();
  });

  it('renders fallback for disabled feature content', async () => {
    const screen = await renderWithProviders(
      <FeatureGate flag="eVoting" fallback={<Text>Unavailable</Text>}>
        <Text>Voting enabled</Text>
      </FeatureGate>
    );
    expect(screen.getByText('Unavailable')).toBeOnTheScreen();
    expect(screen.queryByText('Voting enabled')).toBeNull();
  });
});

describe('PermissionGate', () => {
  it('renders content when mock user has permission', async () => {
    const screen = await renderWithProviders(
      <PermissionGate permission="VISITOR_CREATE">
        <Text>Create visitor</Text>
      </PermissionGate>
    );
    expect(screen.getByText('Create visitor')).toBeOnTheScreen();
  });

  it('renders fallback when mock user lacks permission', async () => {
    const screen = await renderWithProviders(
      <PermissionGate permission="GATE_ENTRY_RECORD" fallback={<Text>Restricted</Text>}>
        <Text>Gate entry</Text>
      </PermissionGate>
    );
    expect(screen.getByText('Restricted')).toBeOnTheScreen();
    expect(screen.queryByText('Gate entry')).toBeNull();
  });
});
