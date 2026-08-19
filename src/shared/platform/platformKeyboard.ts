import type { PlatformKeyboardConfig } from './platform.types';
import { platformSelect } from './platformSelect';

export function getPlatformKeyboardConfig(topInset = 0): PlatformKeyboardConfig {
  return platformSelect({
    ios: { behavior: 'padding', keyboardVerticalOffset: Math.max(topInset, 64) },
    android: { behavior: 'height', keyboardVerticalOffset: 0 },
    default: { behavior: undefined, keyboardVerticalOffset: 0 },
  });
}
