import type { ImageStyle } from 'react-native';
import type { PlatformImageResizeMode } from './platform.types';
import { platformSelect } from './platformSelect';

export function getPlatformImageStyle(resizeMode: PlatformImageResizeMode): Pick<ImageStyle, 'resizeMode'> {
  return {
    resizeMode: platformSelect({
      ios: resizeMode,
      android: resizeMode,
      default: resizeMode,
    }),
  };
}
