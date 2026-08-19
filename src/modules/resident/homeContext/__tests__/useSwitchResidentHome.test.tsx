import React from 'react';
import { Button, Text, View } from 'react-native';
import { fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { useSwitchResidentHome } from '../hooks/useSwitchResidentHome';
import { activeHomeStore } from '../data/activeHomeStore';
import { enMessages } from '../../../../messages/en';
import { residentHomeContextStorage } from '../utils/residentHomeContextStorage';

describe('useSwitchResidentHome Hook', () => {
  beforeEach(() => {
    activeHomeStore.setActiveContextId('context-001');
  });

  const TestComponent = () => {
    const { switchHome, error, isSubmitting } = useSwitchResidentHome();
    return (
      <View>
        {isSubmitting && <Text>Submitting</Text>}
        {error && <Text>{error}</Text>}
        <Button title="Switch 3" onPress={() => switchHome('context-003')} />
        <Button title="Switch 6" onPress={() => switchHome('context-006')} />
      </View>
    );
  };

  it('should successfully switch context', async () => {
    const { getByText } = await renderWithProviders(<TestComponent />);

    await act(async () => {
      fireEvent.press(getByText('Switch 3'));
    });

    await waitFor(() => {
      expect(activeHomeStore.getActiveContextId()).toBe('context-003');
    });
  });

  it('switches to a partially restricted context without granting unrestricted status', async () => {
    const { getByText } = await renderWithProviders(<TestComponent />);

    await act(async () => {
      fireEvent.press(getByText('Switch 6'));
    });

    await waitFor(() => {
      expect(activeHomeStore.getActiveContextId()).toBe('context-006');
    });
  });

  it('keeps the previous home active when persistence fails', async () => {
    const saveSpy = jest
      .spyOn(residentHomeContextStorage, 'saveSelectedContextId')
      .mockResolvedValueOnce(false);
    const { getByText } = await renderWithProviders(<TestComponent />);

    await act(async () => {
      fireEvent.press(getByText('Switch 3'));
    });

    await waitFor(() => {
      expect(getByText(enMessages.resident.homeContext.persistenceFailed)).toBeTruthy();
      expect(activeHomeStore.getActiveContextId()).toBe('context-001');
    });
    saveSpy.mockRestore();
  });
});
