export const iconTokens = {
  size: {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
  },
  bubble: {
    sm: 36,
    md: 48,
    lg: 60,
  },
  stroke: {
    regular: 1.75,
    bold: 2.25,
  },
} as const;

export type IconTokenScale = typeof iconTokens;
export const IconTokens = iconTokens;
