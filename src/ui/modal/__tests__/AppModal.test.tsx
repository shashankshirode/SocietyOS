import React from 'react';
import { Text } from 'react-native';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { AppModal } from '../AppModal';

describe('AppModal', () => {
  it('renders accessible content and requests backdrop dismissal once', async () => {
    const onClose = jest.fn();
    await renderWithProviders(
      <AppModal visible onClose={onClose} testID="app-modal">
        <Text>Shared modal content</Text>
      </AppModal>,
    );

    expect(screen.getByText('Shared modal content')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Dismiss dialog'));
    fireEvent.press(screen.getByLabelText('Dismiss dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not expose content while closed', async () => {
    await renderWithProviders(
      <AppModal visible={false} onClose={jest.fn()}>
        <Text>Hidden modal content</Text>
      </AppModal>,
    );

    expect(screen.queryByText('Hidden modal content')).toBeNull();
  });
});
