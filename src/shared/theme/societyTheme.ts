import { darkPalette, lightPalette } from './colors';
import { iconTokens } from './iconTokens';
import { motionTokens } from './motion';

const createSemanticColors = (palette: typeof lightPalette | typeof darkPalette) => ({
  surface: {
    canvas: palette.background,
    base: palette.surface,
    soft: palette.backgroundSoft,
    raised: palette.surfaceRaised,
    inverse: darkPalette.background,
    focus: palette.surfaceAccent,
    attention: palette.warningSoft,
  },
  text: {
    primary: palette.textPrimary,
    secondary: palette.textSecondary,
    tertiary: palette.textMuted,
    muted: palette.textDisabled,
    inverse: darkPalette.textPrimary,
  },
  border: {
    subtle: palette.divider,
    default: palette.border,
    strong: palette.borderStrong,
  },
  accent: {
    sage: palette.accentTeal,
    moss: palette.primary,
    amber: palette.accentGold,
    coral: palette.accentRose,
    lavender: palette.accentIndigo,
  },
  status: {
    success: palette.success,
    successSurface: palette.successSoft,
    warning: palette.warning,
    warningSurface: palette.warningSoft,
    danger: palette.danger,
    dangerSurface: palette.dangerSoft,
    info: palette.info,
    infoSurface: palette.infoSoft,
    neutral: palette.textSecondary,
    neutralSurface: palette.surfaceMuted,
  },
} as const);

export const societySemanticLight = createSemanticColors(lightPalette);
export const societySemanticDark = createSemanticColors(darkPalette);

export const societyBorderWidths = {
  hairline: 0.5,
  subtle: 1,
  emphasis: 1.5,
  strong: 2,
} as const;

export const societyTouch = {
  minimum: 44,
  comfortable: 48,
  command: 56,
  critical: 64,
} as const;

export const societyNavigation = {
  headerHeight: 56,
  capsuleHeight: 68,
  capsuleInset: 16,
  internalPadding: 8,
  activeLensHeight: 52,
  dockBottomGap: 8,
  tabletMaxWidth: 720,
  itemMinimumWidth: 0,
  focusedFlowHidden: true,
  motionDuration: 190,
} as const;

export const societyContent = {
  phonePadding: 16,
  largePhonePadding: 20,
  tabletPadding: 24,
  readableWidth: 680,
  wideWidth: 1120,
  formWidth: 560,
} as const;

export const societyIcons = iconTokens;
export const societyMotion = motionTokens;

export const societyIdentityTokens = {
  light: {
    background: lightPalette.primarySoft,
    foreground: lightPalette.textPrimary,
    border: lightPalette.borderStrong,
    cachedIndicator: lightPalette.accentTeal,
  },
  dark: {
    background: darkPalette.surfaceRaised,
    foreground: darkPalette.textPrimary,
    border: darkPalette.borderStrong,
    cachedIndicator: darkPalette.accentTeal,
  },
} as const;

export const societyDismissTokens = {
  light: {
    defaultBackground: lightPalette.surfaceMuted,
    defaultForeground: lightPalette.textPrimary,
    inverseBackground: darkPalette.surfaceRaised,
    inverseForeground: darkPalette.textPrimary,
    criticalBackground: lightPalette.dangerSoft,
    criticalForeground: lightPalette.danger,
  },
  dark: {
    defaultBackground: darkPalette.surfaceRaised,
    defaultForeground: darkPalette.textPrimary,
    inverseBackground: darkPalette.surfaceRaised,
    inverseForeground: darkPalette.textPrimary,
    criticalBackground: darkPalette.dangerSoft,
    criticalForeground: darkPalette.danger,
  },
} as const;

export const societySelectionTokens = {
  light: {
    background: lightPalette.primary,
    foreground: darkPalette.textPrimary,
    border: lightPalette.primary,
  },
  dark: {
    background: darkPalette.primary,
    foreground: darkPalette.background,
    border: darkPalette.primary,
  },
} as const;

export const societySkeletonTokens = {
  light: {
    surface: lightPalette.surfaceMuted,
    highlight: lightPalette.backgroundSoft,
    radius: 8,
    minOpacity: 0.35,
    maxOpacity: 0.7,
    durationMs: 1200,
  },
  dark: {
    surface: darkPalette.surfaceRaised,
    highlight: darkPalette.surface,
    radius: 8,
    minOpacity: 0.3,
    maxOpacity: 0.65,
    durationMs: 1200,
  },
} as const;

export type SocietySemanticColors = typeof societySemanticLight;
export type SocietyBorderWidths = typeof societyBorderWidths;
export type SocietyTouch = typeof societyTouch;
export type SocietyNavigation = typeof societyNavigation;
export type SocietyContent = typeof societyContent;
export type SocietySkeletonTokens = typeof societySkeletonTokens;

