export interface ThemeColors {
  
  background: string;
  backgroundSoft: string;
  surfaceAccent: string;
  shimmer: string;
  surface: string;
  surfaceElevated: string;
  surfaceRaised: string;
  surfaceMuted: string;
  surfaceGlass: string;
  card: string;
  cardPressed: string;

  primary: string;
  primarySoft: string;
  primaryPressed: string;
  primaryText: string;

  secondary: string;
  secondarySoft: string;
  accentIndigo: string;
  accentTeal: string;
  accentGold: string;
  accentSky: string;
  accentRose: string;

  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  info: string;
  infoSoft: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  border: string;
  divider: string;
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;

  disabled: string;
  overlay: string;
  shadow: string;

  tabBarBackground: string;
  tabBarActive: string;
  tabBarInactive: string;

  headerBackground: string;
  headerText: string;

  statusBarStyle: 'light-content' | 'dark-content';

  
  primaryLight: string;
  primaryDark: string;
  textTertiary: string;
  textDisabled: string;
  textOnPrimary: string;
  white: string;
  black: string;
  surfaceSoft: string;
  borderStrong: string;
  borderLight: string;
  successLight: string;
  warningLight: string;
  dangerLight: string;
  infoLight: string;
  neutral: string;
  neutralSoft: string;
  neutralLight: string;
  resident: string;
  guard: string;
  facility: string;
  admin: string;
  treasurer: string;
  governance: string;
  document: string;
  billing: string;
  parking: string;
  backdrop: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AppTheme {
  dark: boolean;
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: typeof import('./spacing').Spacing;
  typography: typeof import('./typography').Typography;
  radius: typeof import('./radius').Radius;
  shadows: typeof import('./shadows').Shadows;
  layout: typeof import('./layout').Layout;
  zIndex: typeof import('./zIndex').zIndex;
}
