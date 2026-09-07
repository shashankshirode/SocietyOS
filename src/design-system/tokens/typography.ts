import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'SF Pro Display',
  android: 'Roboto',
  default: 'System',
});

export const typography = {
  fontFamily,
  fontFamilyMonospace: Platform.select({
    ios: 'SF Mono',
    android: 'monospace',
    default: 'monospace',
  }),

  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  size: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
    '7xl': 44,
    '8xl': 52,
    '9xl': 64,
  },

  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
    '6xl': 36,
    '7xl': 44,
    '8xl': 52,
    '9xl': 64,
  },

  lineHeight: {
    none: 1,
    tight: 1.15,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
} as const;

export const textStyles = {
  display: {
    large: {
      fontSize: typography.size['7xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.size['7xl'] * typography.lineHeight.tight,
      letterSpacing: typography.size['7xl'] * typography.letterSpacing.tighter,
    },
    medium: {
      fontSize: typography.size['6xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.size['6xl'] * typography.lineHeight.tight,
      letterSpacing: typography.size['6xl'] * typography.letterSpacing.tighter,
    },
    small: {
      fontSize: typography.size['5xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.size['5xl'] * typography.lineHeight.tight,
      letterSpacing: typography.size['5xl'] * typography.letterSpacing.tighter,
    },
  },
  heading: {
    h1: {
      fontSize: typography.size['5xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.size['5xl'] * typography.lineHeight.tight,
      letterSpacing: typography.size['5xl'] * typography.letterSpacing.tight,
    },
    h2: {
      fontSize: typography.size['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.size['4xl'] * typography.lineHeight.tight,
      letterSpacing: typography.size['4xl'] * typography.letterSpacing.tight,
    },
    h3: {
      fontSize: typography.size['3xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.size['3xl'] * typography.lineHeight.snug,
      letterSpacing: typography.size['3xl'] * typography.letterSpacing.tight,
    },
    h4: {
      fontSize: typography.size['2xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.size['2xl'] * typography.lineHeight.snug,
      letterSpacing: typography.size['2xl'] * typography.letterSpacing.normal,
    },
    h5: {
      fontSize: typography.size.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.size.xl * typography.lineHeight.snug,
      letterSpacing: typography.size.xl * typography.letterSpacing.normal,
    },
    h6: {
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.size.lg * typography.lineHeight.normal,
      letterSpacing: typography.size.lg * typography.letterSpacing.normal,
    },
  },
  body: {
    large: {
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.size.lg * typography.lineHeight.relaxed,
      letterSpacing: typography.letterSpacing.normal,
    },
    base: {
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.size.base * typography.lineHeight.relaxed,
      letterSpacing: typography.letterSpacing.normal,
    },
    small: {
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.size.sm * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    xsmall: {
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.size.xs * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },
  label: {
    large: {
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.size.base * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
    },
    base: {
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.size.sm * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
    },
    small: {
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.size.xs * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wider,
    },
  },
  button: {
    large: {
      fontSize: typography.size.lg,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.size.lg * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
    },
    base: {
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.size.base * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
    },
    small: {
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.size.sm * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.wide,
    },
  },
  caption: {
    base: {
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.size.sm * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
    small: {
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.size.xs * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },
  overline: {
    base: {
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.size.xs * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.widest,
      textTransform: 'uppercase' as const,
    },
  },
  number: {
    display: {
      fontSize: typography.size['6xl'],
      fontWeight: typography.fontWeight.black,
      lineHeight: typography.size['6xl'] * typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tighter,
    },
    large: {
      fontSize: typography.size['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.size['4xl'] * typography.lineHeight.tight,
      letterSpacing: typography.letterSpacing.tight,
    },
    base: {
      fontSize: typography.size.xl,
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.size.xl * typography.lineHeight.snug,
      letterSpacing: typography.letterSpacing.tight,
    },
    small: {
      fontSize: typography.size.base,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.size.base * typography.lineHeight.normal,
      letterSpacing: typography.letterSpacing.normal,
    },
  },
  monospace: {
    base: {
      fontSize: typography.size.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.size.sm * typography.lineHeight.normal,
      fontFamily: typography.fontFamilyMonospace,
    },
    small: {
      fontSize: typography.size.xs,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.size.xs * typography.lineHeight.normal,
      fontFamily: typography.fontFamilyMonospace,
    },
  },
} as const;

export type TextStyleKeys = keyof typeof textStyles;
export type TypographyTokens = typeof typography & { textStyles: typeof textStyles };