import React from 'react';
import { screen } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { ThemeProvider } from '../../../core/theme/ThemeProvider';
import { FocusTransition } from '../FocusTransition';
import { AnimatedScreen } from '../AnimatedScreen';
import { MotionIntent } from '../../../shared/theme/motion';
import { SafeText } from '../../../shared/components/SafeText';

describe('FocusTransition & AnimatedScreen motion system', () => {
  it('renders FocusTransition with children', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <FocusTransition testID="focus-transition-test" intent={MotionIntent.FOCUS_ENTER}>
          <SafeText>Focused Screen Content</SafeText>
        </FocusTransition>
      </ThemeProvider>
    );
    expect(screen.getByTestId('focus-transition-test')).toBeTruthy();
    expect(screen.getByText('Focused Screen Content')).toBeTruthy();
  });

  it('renders AnimatedScreen with WORLD_TRANSITION intent', async () => {
    await renderWithProviders(
      <ThemeProvider>
        <AnimatedScreen testID="animated-screen-test" intent={MotionIntent.WORLD_TRANSITION}>
          <SafeText>World Tab Content</SafeText>
        </AnimatedScreen>
      </ThemeProvider>
    );
    expect(screen.getByTestId('animated-screen-test')).toBeTruthy();
    expect(screen.getByText('World Tab Content')).toBeTruthy();
  });
});
