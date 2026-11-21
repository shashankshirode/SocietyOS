import { Platform, ViewStyle } from 'react-native';

export const elevation = {
  card: Platform.select({
    ios: {
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
    },
    android: { elevation: 4 },
    default: {},
  }) as ViewStyle,
  floating: Platform.select({
    ios: {
      shadowOpacity: 0.14,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 16 },
    },
    android: { elevation: 8 },
    default: {},
  }) as ViewStyle,
} as const;

export type Elevation = typeof elevation;
