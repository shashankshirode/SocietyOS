import React from 'react';
import { Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { AppButton } from '../AppButton';
import { AppCard } from '../../cards/AppCard';
import { StatusBadge } from '../StatusBadge';

describe('shared components', () => {
  it('renders and presses AppButton', async () => {
    const onPress = jest.fn();
    const screen = await renderWithProviders(<AppButton title="Save" onPress={onPress} />);
    fireEvent.press(screen.getByText('Save'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not press disabled AppButton', async () => {
    const onPress = jest.fn();
    const screen = await renderWithProviders(<AppButton title="Save" onPress={onPress} disabled />);
    fireEvent.press(screen.getByLabelText('Save'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders pressable AppCard children', async () => {
    const onPress = jest.fn();
    const screen = await renderWithProviders(
      <AppCard onPress={onPress}>
        <Text>Card body</Text>
      </AppCard>
    );
    fireEvent.press(screen.getByText('Card body'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders status labels from module status presentation', async () => {
    const screen = await renderWithProviders(<StatusBadge status="APPROVED" moduleType="visitor" />);
    expect(screen.getByText('Approved')).toBeOnTheScreen();
  });
});
