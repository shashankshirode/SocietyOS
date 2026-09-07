export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,

  button: 12,
  buttonLarge: 16,
  input: 12,
  card: 16,
  cardLarge: 20,
  modal: 24,
  sheet: 24,
  avatar: 9999,
  badge: 9999,
  pill: 9999,
  fab: 28,
  tooltip: 8,
  popover: 12,
} as const;

export type RadiusTokens = typeof radius;