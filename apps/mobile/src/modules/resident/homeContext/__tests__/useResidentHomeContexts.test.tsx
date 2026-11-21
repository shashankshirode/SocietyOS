import React from 'react';
import { Text } from 'react-native';
import { waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { useResidentHomeContexts } from '../hooks/useResidentHomeContexts';
import { MockStoreProvider } from '../../../../core/mockStore/mockStoreProvider';

describe('useResidentHomeContexts Hook', () => {
  const TestComponent = () => {
    const list = useResidentHomeContexts();
    if (list.isLoading) {
      return <Text>Loading</Text>;
    }
    return <Text>Count: {list.data.length}</Text>;
  };

  it('should load all mock home contexts sorted', async () => {
    const { getByText, queryByText } = await renderWithProviders(
      <MockStoreProvider>
        <TestComponent />
      </MockStoreProvider>
    );

    expect(getByText('Loading')).toBeTruthy();

    await waitFor(() => {
      expect(queryByText('Loading')).toBeNull();
      expect(getByText('Count: 8')).toBeTruthy();
    });
  });
});
