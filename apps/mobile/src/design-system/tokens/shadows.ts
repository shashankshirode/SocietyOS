import { ViewStyle, Platform } from 'react-native';

export const elevation = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 6,
  6: 8,
  7: 10,
  8: 12,
  9: 14,
  10: 16,
  11: 18,
  12: 20,
  13: 22,
  14: 24,
  15: 26,
  16: 28,
  17: 30,
  18: 32,
  19: 34,
  20: 36,
  21: 38,
  22: 40,
  23: 42,
  24: 44,
  25: 46,
  floating: 10,
  sticky: 3,
} as const;

const createShadow = (
  color: string,
  offsetX: number,
  offsetY: number,
  blur: number,
  spread: number,
  opacity: number
): ViewStyle => {
  const iosStyle: ViewStyle = {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur / 2,
  };

  const androidElevation = Math.round((blur + Math.abs(offsetY)) / 2);
  const androidStyle: ViewStyle = {
    elevation: androidElevation,
  };

  return Platform.select({ ios: iosStyle, android: androidStyle }) as ViewStyle;
};

export const shadows = {
  none: Platform.select({
    ios: { shadowColor: 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0 },
    android: { elevation: 0 },
  }) as ViewStyle,

  xs: createShadow('#000000', 0, 1, 2, 0, 0.05),
  sm: createShadow('#000000', 0, 1, 3, 0, 0.08),
  md: createShadow('#000000', 0, 4, 6, -1, 0.1),
  lg: createShadow('#000000', 0, 10, 15, -3, 0.1),
  xl: createShadow('#000000', 0, 20, 25, -5, 0.1),
  '2xl': createShadow('#000000', 0, 25, 50, -12, 0.15),

  inner: createShadow('#000000', 0, 2, 4, 0, 0.06),

  card: createShadow('#000000', 0, 4, 16, 0, 0.08),
  cardHover: createShadow('#000000', 0, 12, 24, -4, 0.12),
  cardPressed: createShadow('#000000', 0, 2, 8, 0, 0.06),

  floating: createShadow('#000000', 0, 20, 40, -10, 0.15),
  modal: createShadow('#000000', 0, 25, 50, -12, 0.2),
  popover: createShadow('#000000', 0, 8, 16, -2, 0.1),
  tooltip: createShadow('#000000', 0, 4, 8, -2, 0.08),

  focus: createShadow('#6366F1', 0, 0, 0, 3, 0.4),
  focusError: createShadow('#EF4444', 0, 0, 0, 3, 0.4),
  focusSuccess: createShadow('#22C55E', 0, 0, 0, 3, 0.4),

  sticky: createShadow('#000000', 0, 2, 6, 0, 0.06),
  navBar: createShadow('#000000', 0, 1, 3, 0, 0.08),
  tabBar: createShadow('#000000', 0, -1, 3, 0, 0.06),
  sheet: createShadow('#000000', 0, -4, 12, 0, 0.1),
} as const;

export type ShadowTokens = typeof shadows;
export type ShadowKey = keyof ShadowTokens;