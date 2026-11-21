export const spacingScale = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,

  
  xxs: 2,
  xxl: 24,
  xxxl: 32,

  
  screenPaddingPhone: 16,
  screenPaddingTablet: 24,
  cardPadding: 16,
  sectionGap: 24,
  cardGap: 16,
  formGap: 16,
  listGap: 12,
} as const;

export type SpacingScale = typeof spacingScale;
export type SpacingToken = keyof SpacingScale;
export const Spacing = spacingScale;
export type SpacingScaleToken = SpacingToken;
