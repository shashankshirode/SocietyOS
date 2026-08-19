import React from 'react';
import { Text } from 'react-native';
import { act, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { useActiveResidentHome } from '../hooks/useActiveResidentHome';
import { activeHomeStore } from '../data/activeHomeStore';

describe('useActiveResidentHome Hook', () => {
  beforeEach(() => {
    activeHomeStore.setActiveContextId('context-001');
  });

  const TestComponent = () => {
    const active = useActiveResidentHome();
    return <Text>{active.activeId}</Text>;
  };

  it('should return context-001 by default', async () => {
    const { getByText } = await renderWithProviders(<TestComponent />);
    expect(getByText('context-001')).toBeTruthy();
  });

  it('should react reactively when active context updates', async () => {
    const { getByText } = await renderWithProviders(<TestComponent />);
    expect(getByText('context-001')).toBeTruthy();

    act(() => {
      activeHomeStore.setActiveContextId('context-003');
    });

    await waitFor(() => {
      expect(getByText('context-003')).toBeTruthy();
    });
  });
});
