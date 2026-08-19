import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import { screen, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import {
  ResidentHomeContextProvider,
  useResidentHomeContext,
} from '../state/ResidentHomeContextProvider';
import { activeHomeStore } from '../data/activeHomeStore';
import { RESIDENT_HOME_CONTEXT_STORAGE_KEY } from '../utils/residentHomeContextStorage';

function ActiveHomeProbe() {
  const home = useResidentHomeContext();
  return <Text>{`${home.homeContextId}|${home.dataScopeKey}`}</Text>;
}

describe('ResidentHomeContextProvider persistence restore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    activeHomeStore.setActiveContextId('context-001');
  });

  it('restores a valid persisted homeContextId after restart', async () => {
    await AsyncStorage.setItem(RESIDENT_HOME_CONTEXT_STORAGE_KEY, 'context-004');
    await renderWithProviders(
      <ResidentHomeContextProvider>
        <ActiveHomeProbe />
      </ResidentHomeContextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/context-004\|/)).toBeTruthy();
    });
  });

  it('falls back to the primary active home when persisted context is missing', async () => {
    await AsyncStorage.setItem(RESIDENT_HOME_CONTEXT_STORAGE_KEY, 'context-removed');
    activeHomeStore.setActiveContextId('context-003');
    const rendered = await renderWithProviders(
      <ResidentHomeContextProvider>
        <ActiveHomeProbe />
      </ResidentHomeContextProvider>
    );

    await waitFor(() => {
      expect(rendered.getByText(/context-001\|/)).toBeTruthy();
    });
    expect(await AsyncStorage.getItem(RESIDENT_HOME_CONTEXT_STORAGE_KEY)).toBe('context-001');
  });
});
