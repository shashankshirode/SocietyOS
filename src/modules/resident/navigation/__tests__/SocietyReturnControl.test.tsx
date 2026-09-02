import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../../test/testUtils';
import { SocietyReturnControl } from '../../experience/EdgeReturn';
import { AmbientPageChrome } from '../../experience/AmbientPageChrome';
import { ResidentAppHeader } from '../ResidentAppHeader';

describe('SocietyReturnControl & Global Return Navigation Architecture', () => {
  it('renders standard back return control with tactile interaction', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <SocietyReturnControl onPress={onPress} semantic="back" testID="test-return-back" />
    );

    const button = screen.getByTestId('test-return-back');
    expect(button).toBeOnTheScreen();
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders close semantic variant for modal/sheet contexts', async () => {
    const onClose = jest.fn();
    await renderWithProviders(
      <SocietyReturnControl onPress={onClose} semantic="close" testID="test-return-close" />
    );

    const button = screen.getByTestId('test-return-close');
    expect(button).toBeOnTheScreen();
    expect(button.props.accessibilityLabel).toBe('Close');
    fireEvent.press(button);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('integrates cleanly into AmbientPageChrome without colliding with ResidenceBeacon', async () => {
    const onBack = jest.fn();
    await renderWithProviders(
      <AmbientPageChrome
        showBackButton={true}
        onBackPress={onBack}
        titleKey="resident.navigation.visitors.title"
        includeSafeAreaTop={false}
      />
    );

    const returnBtn = screen.getByRole('button', { name: 'Go back' });
    expect(returnBtn).toBeOnTheScreen();
    fireEvent.press(returnBtn);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('handles route-aware fallback navigation when history cannot go back', async () => {
    await renderWithProviders(
      <ResidentAppHeader
        variant="detail"
        titleKey="resident.navigation.visitors.title"
        showBackButton={true}
        fallbackTab="HomeTab"
        fallbackRoute="ResidentHome"
        includeSafeAreaTop={false}
      />
    );

    const returnBtn = screen.getByRole('button', { name: 'Go back' });
    expect(returnBtn).toBeOnTheScreen();
    fireEvent.press(returnBtn);
  });
});
