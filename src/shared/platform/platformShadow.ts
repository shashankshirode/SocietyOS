import type { PlatformShadowLevel, PlatformShadowStyle } from './platform.types';
import { platformSelect } from './platformSelect';

const iosShadows: Record<PlatformShadowLevel, PlatformShadowStyle> = {
  none: { shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 } },
  soft: { shadowColor: '#0F172A', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  medium: { shadowColor: '#0F172A', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  strong: { shadowColor: '#0F172A', shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 10 } },
  floating: { shadowColor: '#0F172A', shadowOpacity: 0.14, shadowRadius: 20, shadowOffset: { width: 0, height: 12 } },
};

const androidShadows: Record<PlatformShadowLevel, PlatformShadowStyle> = {
  none: { elevation: 0 },
  soft: { elevation: 1 },
  medium: { elevation: 3 },
  strong: { elevation: 6 },
  floating: { elevation: 8 },
};

export function getPlatformShadow(level: PlatformShadowLevel): PlatformShadowStyle {
  return platformSelect({
    ios: iosShadows[level],
    android: androidShadows[level],
    default: iosShadows[level],
  });
}
