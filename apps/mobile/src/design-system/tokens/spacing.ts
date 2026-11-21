export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  none: 0,
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  '4xl': 36,
  '5xl': 48,

  screenPadding: {
    mobile: 16,
    tablet: 24,
    desktop: 32,
  },
  cardPadding: {
    mobile: 16,
    tablet: 20,
    desktop: 24,
  },
  sectionGap: {
    mobile: 24,
    tablet: 32,
    desktop: 40,
  },
  cardGap: {
    mobile: 12,
    tablet: 16,
    desktop: 20,
  },
  formGap: {
    mobile: 16,
    tablet: 20,
    desktop: 24,
  },
  listGap: {
    mobile: 8,
    tablet: 12,
    desktop: 16,
  },
  inlineGap: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
} as const;

export type SpacingTokens = typeof spacing;

export const spacingScale = {
  none: spacing[0],
  xxs: spacing[1],
  xs: spacing[2],
  sm: spacing[3],
  md: spacing[4],
  lg: spacing[5],
  xl: spacing[6],
  '2xl': spacing[8],
  '3xl': spacing[10],
  '4xl': spacing[12],
} as const;