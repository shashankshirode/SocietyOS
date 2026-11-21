import { AppTheme } from './theme.types';
import { darkPalette, palette } from './colors';
import { Spacing } from './spacing';
import { Typography } from './typography';
import { Radius } from './radius';
import { Shadows } from './shadows';
import { Layout } from './layout';
import { zIndex } from './zIndex';
import { societyBorderWidths, societyContent, societyIcons, societyMotion, societyNavigation, societySemanticDark, societyTouch } from './societyTheme';

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
    primaryText: '#111612',

    secondary: darkPalette.accentTeal,
    secondarySoft: '#1A2D1A',
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

    textPrimary: '#F5F5F7',
    textSecondary: '#A1A1AA',
    textMuted: '#71717A',
    textInverse: '#111612',

    border: darkPalette.border,
    divider: darkPalette.divider,
    inputBackground: darkPalette.surfaceMuted,
    inputBorder: darkPalette.borderStrong,
    inputText: darkPalette.textPrimary,
    inputPlaceholder: darkPalette.textMuted,

    disabled: darkPalette.textDisabled,
    overlay: 'rgba(0, 0, 0, 0.72)',
    shadow: '#000000',

    tabBarBackground: '#000000',
    tabBarActive: '#C2DCA5',
    tabBarInactive: darkPalette.textDisabled,

    headerBackground: '#0A0A0A',
    headerText: '#F5F5F7',

    statusBarStyle: 'light-content',
    
    primaryLight: darkPalette.primaryPressed,
    primaryDark: darkPalette.primarySoft,
    textTertiary: darkPalette.textMuted,
    textDisabled: darkPalette.textDisabled,
    textOnPrimary: '#111612',
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
    facility: '#9EA2EE',
    admin: darkPalette.accentSky,
    treasurer: darkPalette.accentGold,
    governance: darkPalette.primary,
    document: darkPalette.primary,
    billing: darkPalette.accentGold,
    parking: darkPalette.accentTeal,
    backdrop: 'rgba(0, 0, 0, 0.76)',
  },
  spacing: Spacing,
  typography: Typography,
  radius: Radius,
  shadows: Shadows,
  layout: Layout,
  zIndex: zIndex,
  semantic: societySemanticDark,
  borderWidths: societyBorderWidths,
  motion: societyMotion,
  touch: societyTouch,
  navigation: societyNavigation,
  content: societyContent,
  icons: societyIcons,
};
