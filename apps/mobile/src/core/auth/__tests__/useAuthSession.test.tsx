import React from 'react';
import { Text, Pressable } from 'react-native';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { logoutCurrentSession } from '../logout';
import { useAuthSession } from '../useAuthSession';

function SessionProbe() {
  const { session, startMockSessionForRoute, logout } = useAuthSession();

  return (
    <>
      <Text>{session?.role ?? 'signed-out'}</Text>
      <Pressable onPress={() => startMockSessionForRoute('GuardApp')}>
        <Text>Start guard</Text>
      </Pressable>
      <Pressable onPress={logout}>
        <Text>Logout session</Text>
      </Pressable>
    </>
  );
}

describe('useAuthSession', () => {
  afterEach(async () => {
    await logoutCurrentSession();
  });

  it('starts and clears mock sessions', async () => {
    const screen = await renderWithProviders(<SessionProbe />);

    expect(screen.getByText('signed-out')).toBeOnTheScreen();

    await act(async () => {
      fireEvent.press(screen.getByText('Start guard'));
    });
    await waitFor(() => expect(screen.getByText('SECURITY_GUARD')).toBeOnTheScreen());

    await act(async () => {
      fireEvent.press(screen.getByText('Logout session'));
    });
    await waitFor(() => expect(screen.getByText('signed-out')).toBeOnTheScreen());
  });
});
