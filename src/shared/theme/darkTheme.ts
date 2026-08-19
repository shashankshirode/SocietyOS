import { AppTheme } from './theme.types';
import { darkPalette, palette } from './colors';
import { Spacing } from './spacing';
import { Typography } from './typography';
import { Radius } from './radius';
import { Shadows } from './shadows';
import { Layout } from './layout';
import { zIndex } from './zIndex';

export const darkTheme: AppTheme = {
  dark: true,
  mode: 'dark',
  colors: {
    
    background: darkPalette.background,
    backgroundSoft: darkPalette.backgroundSoft,
    surfaceAccent: darkPalette.surfaceAccent,
    shimmer: darkPalette.shimmer,
    surface: darkPalette.surface,
    surfaceElevated: darkPalette.surfaceRaised,
    surfaceRaised: darkPalette.surfaceRaised,
    surfaceGlass: darkPalette.surfaceGlass,
    surfaceMuted: darkPalette.surfaceMuted,
    card: darkPalette.surface,
    cardPressed: darkPalette.surfaceRaised,

    primary: darkPalette.primary,
    primarySoft: darkPalette.primarySoft,
    primaryPressed: darkPalette.primaryPressed,
    primaryText: '#08111F',

    secondary: darkPalette.accentTeal,
    secondarySoft: '#134E4A',
    accentIndigo: darkPalette.accentIndigo,
    accentTeal: darkPalette.accentTeal,
    accentGold: darkPalette.accentGold,
    accentSky: darkPalette.accentSky,
    accentRose: darkPalette.accentRose,

    success: darkPalette.success,
    successSoft: darkPalette.successSoft,
    warning: darkPalette.warning,
    warningSoft: darkPalette.warningSoft,
    danger: darkPalette.danger,
    dangerSoft: darkPalette.dangerSoft,
    info: darkPalette.info,
    infoSoft: darkPalette.infoSoft,

    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#94A3B8',
    textInverse: '#0F172A',

    border: darkPalette.border,
    divider: darkPalette.divider,
    inputBackground: darkPalette.surfaceMuted,
    inputBorder: darkPalette.borderStrong,
    inputText: darkPalette.textPrimary,
    inputPlaceholder: darkPalette.textMuted,

    disabled: darkPalette.textDisabled,
    overlay: 'rgba(0, 0, 0, 0.64)',
    shadow: '#000000',

    tabBarBackground: 'rgba(15,23,42,0.92)',
    tabBarActive: darkPalette.accentIndigo,
    tabBarInactive: darkPalette.textDisabled,

    headerBackground: '#0F172A',
    headerText: '#F8FAFC',

    statusBarStyle: 'light-content',

    
    primaryLight: darkPalette.primaryPressed,
    primaryDark: darkPalette.primarySoft,
    textTertiary: darkPalette.textMuted,
    textDisabled: darkPalette.textDisabled,
    textOnPrimary: '#0F172A',
    white: palette.white,
    black: palette.black,
    surfaceSoft: darkPalette.surfaceRaised,
    borderStrong: darkPalette.borderStrong,
    borderLight: darkPalette.border,
    successLight: darkPalette.successSoft,
    warningLight: darkPalette.warningSoft,
    dangerLight: darkPalette.dangerSoft,
    infoLight: darkPalette.infoSoft,
    neutral: darkPalette.textSecondary,
    neutralSoft: darkPalette.surfaceMuted,
    neutralLight: darkPalette.backgroundSoft,
    resident: darkPalette.accentIndigo,
    guard: darkPalette.accentTeal,
    facility: '#A78BFA',
    admin: darkPalette.accentSky,
    treasurer: darkPalette.accentGold,
    governance: darkPalette.primary,
    document: darkPalette.primary,
    billing: darkPalette.accentGold,
    parking: darkPalette.accentTeal,
    backdrop: 'rgba(0, 0, 0, 0.7)',
  },
  spacing: Spacing,
  typography: Typography,
  radius: Radius,
  shadows: Shadows,
  layout: Layout,
  zIndex: zIndex,
};
