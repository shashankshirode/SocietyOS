import { Platform } from 'react-native';
import { getAppPlatform, platformSelect } from '../platformSelect';

const originalPlatform = Platform.OS;

function setPlatform(os: 'ios' | 'android' | 'web') {
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

describe('platformSelect', () => {
  it('returns the iOS branch when running on iOS', () => {
    setPlatform('ios');

    expect(getAppPlatform()).toBe('ios');
    expect(platformSelect({ ios: 'cupertino', android: 'material', default: 'base' })).toBe('cupertino');
  });

  it('returns the Android branch when running on Android', () => {
    setPlatform('android');

    expect(getAppPlatform()).toBe('android');
    expect(platformSelect({ ios: 'cupertino', android: 'material', default: 'base' })).toBe('material');
  });

  it('falls back to the default branch for unsupported branches', () => {
    setPlatform('web');

    expect(platformSelect({ ios: 'cupertino', android: 'material', default: 'base' })).toBe('base');
  });
});
