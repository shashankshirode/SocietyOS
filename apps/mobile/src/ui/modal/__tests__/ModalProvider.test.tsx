import React from 'react';
import { Pressable, Text } from 'react-native';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { AppAlert } from '../AppAlert';
import { ModalProvider } from '../ModalProvider';

describe('ModalProvider', () => {
  it('renders legacy resident alerts through the shared host and runs the action', async () => {
    const onConfirm = jest.fn();
    await renderWithProviders(
      <ModalProvider>
        <Pressable
          accessibilityLabel="Open alert"
          onPress={() => AppAlert.alert('Confirm action', 'Continue with this action?', [
            { text: 'Continue', onPress: onConfirm },
          ])}
        >
          <Text>Application content</Text>
        </Pressable>
      </ModalProvider>,
    );

    fireEvent.press(screen.getByLabelText('Open alert'));

    expect(await screen.findByText('Confirm action')).toBeTruthy();
    fireEvent.press(screen.getByText('Continue'));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
  });

  it('renders prompt input in the same modal system', async () => {
    const onSubmit = jest.fn();
    await renderWithProviders(
      <ModalProvider>
        <Pressable
          accessibilityLabel="Open prompt"
          onPress={() => AppAlert.prompt('Add note', 'Enter a note', [
            { text: 'Submit', onPress: onSubmit },
          ])}
        >
          <Text>Application content</Text>
        </Pressable>
      </ModalProvider>,
    );

    fireEvent.press(screen.getByLabelText('Open prompt'));

    fireEvent.changeText(await screen.findByLabelText('Add note'), 'Checked and verified');
    fireEvent.press(screen.getByText('Submit'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith('Checked and verified'));
  });
});
