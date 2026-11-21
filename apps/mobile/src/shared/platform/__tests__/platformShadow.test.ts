import { Platform } from 'react-native';
import { getPlatformShadow } from '../platformShadow';

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

describe('getPlatformShadow', () => {
  it('returns iOS shadow tokens on iOS', () => {
    setPlatform('ios');

    expect(getPlatformShadow('medium')).toMatchObject({
      shadowColor: '#0F172A',
      shadowOpacity: 0.07,
      shadowRadius: 10,
    });
  });

  it('returns Android elevation tokens on Android', () => {
    setPlatform('android');

    expect(getPlatformShadow('medium')).toEqual({ elevation: 3 });
  });
});
