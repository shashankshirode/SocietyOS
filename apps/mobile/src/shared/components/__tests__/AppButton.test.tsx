import React from 'react';
import { renderWithProviders } from '../../../test/testUtils';
import { AppButton } from '../AppButton';

describe('AppButton Component Extra Tests', () => {
  it('renders loading indicator state', async () => {
    const onPress = jest.fn();
    const screen = await renderWithProviders(<AppButton title="Submit" onPress={onPress} loading />);
    expect(screen.queryByText('Submit')).toBeNull();
  });

  it('renders different visual button variants correctly', async () => {
    const screenPrimary = await renderWithProviders(<AppButton title="Primary Btn" variant="primary" onPress={jest.fn()} />);
    expect(screenPrimary.getByText('Primary Btn')).toBeOnTheScreen();

    const screenOutline = await renderWithProviders(<AppButton title="Outline Btn" variant="outline" onPress={jest.fn()} />);
    expect(screenOutline.getByText('Outline Btn')).toBeOnTheScreen();
  });

  it('allows long action labels to scale and wrap for large-font users', async () => {
    const title = 'Restore household staff access for this residence';
    const screen = await renderWithProviders(<AppButton title={title} onPress={jest.fn()} fullWidth />);
    const label = screen.getByText(title);

    expect(label.props.allowFontScaling).not.toBe(false);
    expect(label.props.numberOfLines).toBeUndefined();
    expect(screen.getByRole('button', { name: title })).toBeOnTheScreen();
  });
});
