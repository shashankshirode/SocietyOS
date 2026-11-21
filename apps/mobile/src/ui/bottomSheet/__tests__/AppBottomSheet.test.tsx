import React from 'react';
import { Text } from 'react-native';
import { screen, fireEvent } from '@testing-library/react-native';
import { AppBottomSheet } from '../AppBottomSheet';
import { renderWithProviders } from '../../../test/testUtils';

describe('AppBottomSheet', () => {
  it('renders children when visible is true', async () => {
    await renderWithProviders(
      <AppBottomSheet visible={true} onClose={jest.fn()}>
        <Text>Test Content</Text>
      </AppBottomSheet>
    );

    expect(screen.getByText('Test Content')).toBeTruthy();
  });

  it('triggers onClose when backdrop is tapped', async () => {
    const handleClose = jest.fn();
    await renderWithProviders(
      <AppBottomSheet visible={true} onClose={handleClose}>
        <Text>Test Content</Text>
      </AppBottomSheet>
    );

    const backdrop = screen.getByTestId('bottom-sheet-backdrop');
    expect(backdrop).toBeTruthy();

    fireEvent.press(backdrop);
    expect(handleClose).toHaveBeenCalled();
  });

  it('does not render content when visible is false and closed', async () => {
    await renderWithProviders(
      <AppBottomSheet visible={false} onClose={jest.fn()}>
        <Text>Hidden Content</Text>
      </AppBottomSheet>
    );

    expect(screen.queryByText('Hidden Content')).toBeNull();
  });
});
