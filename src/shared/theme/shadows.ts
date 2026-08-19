import { ViewStyle, Platform } from 'react-native';
import { elevation } from './elevation';

export const shadowPresets = {
  none: Platform.select({
    ios: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0 },
    android: { elevation: 0 },
  }) as ViewStyle,
  soft: Platform.select({
    ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
    android: { elevation: 1 },
  }) as ViewStyle,
  medium: Platform.select({
    ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 8 },
    android: { elevation: 3 },
  }) as ViewStyle,
  strong: Platform.select({
    ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15 },
    android: { elevation: 6 },
  }) as ViewStyle,
  card: Platform.select({
    ios: { shadowColor: '#101828', shadowOpacity: 0.08, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } },
    android: { elevation: 4 },
  }) as ViewStyle,
  cardHover: Platform.select({
    ios: { shadowColor: '#101828', shadowOpacity: 0.12, shadowRadius: 24, shadowOffset: { width: 0, height: 10 } },
    android: { elevation: 6 },
  }) as ViewStyle,
  floating: Platform.select({
    ios: { shadowColor: '#101828', ...elevation.floating },
    android: { elevation: 8 },
  }) as ViewStyle,
  sticky: Platform.select({
    ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
    android: { elevation: 3 },
  }) as ViewStyle,
} as const;

export type ShadowPresets = typeof shadowPresets;
export type ShadowToken = keyof ShadowPresets;
export const Shadows = shadowPresets;
export type ShadowPresetsToken = ShadowToken;
