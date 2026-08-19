import { darkPalette, lightPalette } from './colors';

export const semanticColors = {
  light: {
    appBackground: lightPalette.background,
    cardBackground: lightPalette.surface,
    cardRaised: lightPalette.surfaceRaised,
    subtleSurface: lightPalette.surfaceMuted,
    readableText: lightPalette.textPrimary,
    secondaryText: lightPalette.textSecondary,
    mutedText: lightPalette.textMuted,
    focusRing: lightPalette.accentIndigo,
    criticalSurface: lightPalette.dangerSoft,
    safeSurface: lightPalette.successSoft,
  },
  dark: {
    appBackground: darkPalette.background,
    cardBackground: darkPalette.surface,
    cardRaised: darkPalette.surfaceRaised,
    subtleSurface: darkPalette.surfaceMuted,
    readableText: darkPalette.textPrimary,
    secondaryText: darkPalette.textSecondary,
    mutedText: darkPalette.textMuted,
    focusRing: darkPalette.accentIndigo,
    criticalSurface: darkPalette.dangerSoft,
    safeSurface: darkPalette.successSoft,
  },
} as const;

export type SemanticColors = typeof semanticColors;
