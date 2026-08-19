import { TextStyle, Platform } from 'react-native';

const fontFamily = 'Inter';
const fontFamilyFallback = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const FONT_FAMILY = fontFamily;
export const FONT_FAMILY_FALLBACK = fontFamilyFallback;

export const typographyScale = {
  display: {
    fontFamily,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,
  h1: {
    fontFamily,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: -0.4,
  } as TextStyle,
  h2: {
    fontFamily,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.3,
  } as TextStyle,
  h3: {
    fontFamily,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.2,
  } as TextStyle,
  title: {
    fontFamily,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 26,
    letterSpacing: -0.15,
  } as TextStyle,
  body: {
    fontFamily,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0,
  } as TextStyle,
  bodyStrong: {
    fontFamily,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: 0,
  } as TextStyle,
  caption: {
    fontFamily,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    letterSpacing: 0,
  } as TextStyle,
  tiny: {
    fontFamily,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.1,
  } as TextStyle,
  displayLarge: {
    fontFamily,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: -0.6,
  } as TextStyle,
  displayMedium: {
    fontFamily,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.4,
  } as TextStyle,
  screenTitle: {
    fontFamily,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    letterSpacing: -0.3,
  } as TextStyle,
  screenSubtitle: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0.1,
  } as TextStyle,
  sectionTitle: {
    fontFamily,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.15,
  } as TextStyle,
  cardTitle: {
    fontFamily,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.1,
  } as TextStyle,
  bodyLarge: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,
  bodyMedium: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  } as TextStyle,
  bodySmall: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  } as TextStyle,
  label: {
    fontFamily,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  } as TextStyle,
  button: {
    fontFamily,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
  } as TextStyle,
  tabLabel: {
    fontFamily,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    letterSpacing: 0.2,
  } as TextStyle,
  statusBadge: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
    letterSpacing: 0.3,
  } as TextStyle,
  formLabel: {
    fontFamily,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.1,
  } as TextStyle,
  formError: {
    fontFamily,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  } as TextStyle,
  largeAmount: {
    fontFamily,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  } as TextStyle,
  metric: {
    fontFamily,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    letterSpacing: -0.4,
  } as TextStyle,
  subtitle: {
    fontFamily,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    letterSpacing: -0.1,
  } as TextStyle,
} as const;

export type TypographyScale = typeof typographyScale;
export type TypographyToken = keyof TypographyScale;
export const Typography = typographyScale;
export type TextStyleToken = TypographyToken;
