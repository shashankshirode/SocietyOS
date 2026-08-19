import { Layout as LayoutTheme } from '../theme/layout';
import { Radius as RadiusTheme } from '../theme/radius';

export const Layout = {
  borderRadius: {
    sm: RadiusTheme.sm,
    md: RadiusTheme.md,
    lg: RadiusTheme.lg,
    xl: RadiusTheme.xl,
    full: RadiusTheme.pill,
  },

  cardRadius: RadiusTheme.card,

  buttonHeight: LayoutTheme.buttonHeight,

  minimumTouchTarget: LayoutTheme.minimumTouchTarget,

  screenHorizontalPadding: LayoutTheme.screenHorizontalPadding,

  maxTabletContentWidth: LayoutTheme.maxTabletContentWidth,

  inputHeight: LayoutTheme.inputHeight,

  tabBarHeight: LayoutTheme.tabBarHeight,

  iconSize: LayoutTheme.iconSize,
} as const;
