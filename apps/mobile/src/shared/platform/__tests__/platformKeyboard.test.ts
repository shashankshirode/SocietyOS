import { Platform } from 'react-native';
import { getPlatformKeyboardConfig } from '../platformKeyboard';

const originalPlatform = Platform.OS;

function setPlatform(os: 'ios' | 'android') {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => os,
  });
}

afterEach(() => {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => originalPlatform,
  });
});

describe('getPlatformKeyboardConfig', () => {
  it('uses padding behavior and a safe vertical offset on iOS', () => {
    setPlatform('ios');

    expect(getPlatformKeyboardConfig(24)).toEqual({
      behavior: 'padding',
      keyboardVerticalOffset: 64,
    });
  });

  it('uses height behavior without vertical offset on Android', () => {
    setPlatform('android');

    expect(getPlatformKeyboardConfig(24)).toEqual({
      behavior: 'height',
      keyboardVerticalOffset: 0,
    });
  });
});
