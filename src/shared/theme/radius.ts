export const radiusScale = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
  xxl: 32,
  card: 20,
  button: 14,
  input: 14,
  sheet: 24,
  hero: 28,
} as const;

export type RadiusScale = typeof radiusScale;
export type RadiusToken = keyof RadiusScale;
export const Radius = radiusScale;
export type RadiusScaleToken = RadiusToken;
