import { Platform } from 'react-native';
import type { AppPlatform, PlatformSelectValue } from './platform.types';

export function getAppPlatform(): AppPlatform {
  if (Platform.OS === 'ios' || Platform.OS === 'android' || Platform.OS === 'web') {
    return Platform.OS;
  }

  return 'native';
}

export function platformSelect<T>(values: PlatformSelectValue<T>): T {
  const platform = getAppPlatform();
  return values[platform] ?? values.native ?? values.default;
}
