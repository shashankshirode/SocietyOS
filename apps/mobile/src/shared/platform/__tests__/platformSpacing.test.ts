import { Platform } from 'react-native';
import { getPlatformBottomInset, getPlatformHeaderPadding } from '../platformSpacing';

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

describe('platform spacing helpers', () => {
  it('keeps iOS bottom and header spacing above platform minimums', () => {
    setPlatform('ios');

    expect(getPlatformBottomInset(4)).toBe(12);
    expect(getPlatformHeaderPadding(4)).toBe(12);
  });

  it('keeps Android bottom and header spacing above platform minimums', () => {
    setPlatform('android');

    expect(getPlatformBottomInset(4)).toBe(16);
    expect(getPlatformHeaderPadding(4)).toBe(8);
  });
});
