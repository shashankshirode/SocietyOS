import { darkPalette, lightPalette } from './colors';
import { societyNavigation } from './societyTheme';

export const navigationTokens = {
  light: {
    headerBackground: lightPalette.surface,
    headerText: lightPalette.textPrimary,
    tabBarBackground: darkPalette.backgroundSoft,
    tabBarActive: darkPalette.primary,
    tabBarInactive: darkPalette.textSecondary,
  },
  dark: {
    headerBackground: darkPalette.backgroundSoft,
    headerText: darkPalette.textPrimary,
    tabBarBackground: darkPalette.backgroundSoft,
    tabBarActive: darkPalette.primary,
    tabBarInactive: darkPalette.textMuted,
  },
  dimensions: societyNavigation,
};
