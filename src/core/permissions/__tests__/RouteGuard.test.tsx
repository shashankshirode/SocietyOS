import React from 'react';
import { Text } from 'react-native';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { RouteGuard } from '../RouteGuard';
import { ThemeProvider } from '../../theme/ThemeProvider';
import { setCurrentSession } from '../../auth/sessionStore';

describe('RouteGuard Access Verification', () => {
  it('blocks access and renders AccessRestrictedState when role lacks permission', async () => {
    
    await setCurrentSession({
      userId: 'test-user',
      name: 'Test Resident',
      role: 'RESIDENT_OWNER',
      isMockSession: true,
    });

    await renderWithProviders(
      <ThemeProvider>
        <RouteGuard permission="GATE_ENTRY_RECORD">
          <Text>Protected Content</Text>
        </RouteGuard>
      </ThemeProvider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeOnTheScreen();
    expect(screen.getByText('Access restricted')).toBeOnTheScreen();
  });

  it('permits access and renders children when role has permission', async () => {
    
    await setCurrentSession({
      userId: 'test-user',
      name: 'Test Guard',
      role: 'SECURITY_GUARD',
      isMockSession: true,
    });

    await renderWithProviders(
      <ThemeProvider>
        <RouteGuard permission="GATE_ENTRY_RECORD">
          <Text>Protected Content</Text>
        </RouteGuard>
      </ThemeProvider>
    );

    expect(screen.getByText('Protected Content')).toBeOnTheScreen();
    expect(screen.queryByText('Access restricted')).not.toBeOnTheScreen();
  });
});
