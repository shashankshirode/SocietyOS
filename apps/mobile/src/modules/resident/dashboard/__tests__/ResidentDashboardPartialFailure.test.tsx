import React from 'react';
import { Text, View } from 'react-native';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { AsyncContentBoundary } from '../components/AsyncContentBoundary';

const boundaryCopy = {
  emptyTitle: 'Nothing here',
  emptyDescription: 'No records are available.',
  errorTitle: 'Section unavailable',
  errorDescription: 'Other home information is still available.',
  offlineTitle: 'Offline section',
  offlineDescription: 'Reconnect to refresh.',
  retryLabel: 'Retry section',
};

describe('Resident dashboard partial failures', () => {
  it('keeps healthy sections interactive when one section fails', async () => {
    const retry = jest.fn();
    await renderWithProviders(
      <View>
        <AsyncContentBoundary {...boundaryCopy} status="error" skeletonVariant="timeline" onRetry={retry} testID="failed-section">
          <Text>Hidden failed content</Text>
        </AsyncContentBoundary>
        <AsyncContentBoundary {...boundaryCopy} status="ready" skeletonVariant="finance" onRetry={retry} testID="healthy-section">
          <Text>Healthy financial snapshot</Text>
        </AsyncContentBoundary>
      </View>,
    );

    expect(screen.getByText('Healthy financial snapshot')).toBeTruthy();
    fireEvent.press(screen.getByText('Retry section'));
    expect(retry).toHaveBeenCalledTimes(1);
  });
});
