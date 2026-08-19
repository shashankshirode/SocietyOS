import { screen } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { renderContactRequestScreen } from './contactRequestTestHarness';
import { getPlatformKeyboardConfig } from '../../../../shared/platform';

const originalPlatform = Platform.OS;

afterEach(() => {
  Object.defineProperty(Platform, 'OS', { configurable: true, get: () => originalPlatform });
});

describe('contact request keyboard safety', () => {
  it.each([
    ['ios', 'padding'],
    ['android', 'height'],
  ] as const)('uses the platform keyboard configuration on %s', async (platform, behavior) => {
    Object.defineProperty(Platform, 'OS', { configurable: true, get: () => platform });
    await renderContactRequestScreen();

    expect(getPlatformKeyboardConfig(0).behavior).toBe(behavior);
    expect(screen.getByTestId('contact-request-keyboard-container')).toBeTruthy();
    expect(screen.getByTestId('contact-request-scroll-view').props.keyboardShouldPersistTaps).toBe('handled');
  });
});
