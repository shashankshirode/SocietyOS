import { AppTheme } from './theme.types';
import { lightPalette, palette } from './colors';
import { Spacing } from './spacing';
import { Typography } from './typography';
import { Radius } from './radius';
import { Shadows } from './shadows';
import { Layout } from './layout';
import { zIndex } from './zIndex';
import { societyBorderWidths, societyContent, societyIcons, societyMotion, societyNavigation, societySemanticLight, societyTouch } from './societyTheme';

export const lightTheme: AppTheme = {
  dark: false,
  mode: 'light',
  colors: {
    
    background: lightPalette.background,
    backgroundSoft: lightPalette.backgroundSoft,
    surfaceAccent: lightPalette.surfaceAccent,
    shimmer: lightPalette.shimmer,
    surface: lightPalette.surface,
    surfaceElevated: lightPalette.surfaceRaised,
    surfaceRaised: lightPalette.surfaceRaised,
    surfaceGlass: lightPalette.surfaceGlass,
    surfaceMuted: lightPalette.surfaceMuted,
    card: lightPalette.surface,
    cardPressed: lightPalette.surfaceMuted,

    primary: lightPalette.primary,
    primarySoft: lightPalette.primarySoft,
    primaryPressed: lightPalette.primaryPressed,
    primaryText: '#FFFDF8',

    secondary: lightPalette.accentTeal,
    secondarySoft: '#DCE8DF',
    accentIndigo: lightPalette.accentIndigo,
    accentTeal: lightPalette.accentTeal,
    accentGold: lightPalette.accentGold,
    accentSky: lightPalette.accentSky,
    accentRose: lightPalette.accentRose,

    success: lightPalette.success,
    successSoft: lightPalette.successSoft,
    warning: lightPalette.warning,
    warningSoft: lightPalette.warningSoft,
    danger: lightPalette.danger,
    dangerSoft: lightPalette.dangerSoft,
    info: lightPalette.info,
    infoSoft: lightPalette.infoSoft,

    textPrimary: lightPalette.textPrimary,
    textSecondary: lightPalette.textSecondary,
    textMuted: lightPalette.textMuted,
    textInverse: '#FFFDF8',

    border: lightPalette.border,
    divider: lightPalette.divider,
    inputBackground: lightPalette.surface,
    inputBorder: lightPalette.borderStrong,
    inputText: lightPalette.textPrimary,
    inputPlaceholder: lightPalette.textDisabled,

    disabled: lightPalette.textDisabled,
    overlay: 'rgba(17, 22, 18, 0.58)',
    shadow: '#232820',

    tabBarBackground: '#171C18',
    tabBarActive: '#C2DCA5',
    tabBarInactive: '#A9ADA4',

    headerBackground: lightPalette.surface,
    headerText: lightPalette.textPrimary,

    statusBarStyle: 'dark-content',

    
    primaryLight: lightPalette.accentIndigo,
    primaryDark: lightPalette.primaryPressed,
    textTertiary: lightPalette.textMuted,
    textDisabled: lightPalette.textDisabled,
    textOnPrimary: palette.white,
    white: palette.white,
    black: palette.black,
    surfaceSoft: lightPalette.backgroundSoft,
    borderStrong: lightPalette.borderStrong,
    borderLight: lightPalette.border,
    successLight: lightPalette.successSoft,
    warningLight: lightPalette.warningSoft,
    dangerLight: lightPalette.dangerSoft,
    infoLight: lightPalette.infoSoft,
    neutral: lightPalette.textSecondary,
    neutralSoft: lightPalette.backgroundSoft,
    neutralLight: lightPalette.surfaceMuted,
    resident: lightPalette.accentIndigo,
    guard: lightPalette.accentTeal,
    facility: '#6873B8',
    admin: lightPalette.accentSky,
    treasurer: lightPalette.accentGold,
    governance: lightPalette.primary,
    document: lightPalette.primary,
    billing: lightPalette.accentGold,
    parking: lightPalette.accentTeal,
    backdrop: 'rgba(17, 22, 18, 0.62)',
  },
  spacing: Spacing,
  typography: Typography,
  radius: Radius,
  shadows: Shadows,
  layout: Layout,
  zIndex: zIndex,
  semantic: societySemanticLight,
  borderWidths: societyBorderWidths,
  motion: societyMotion,
  touch: societyTouch,
  navigation: societyNavigation,
  content: societyContent,
  icons: societyIcons,
};
