export const layoutScale = {
  buttonHeight: 48,
  inputHeight: 48,
  minimumTouchTarget: 44,
  screenHorizontalPadding: 16,
  maxTabletContentWidth: 680,
  tabBarHeight: 60,
  headerHeight: 56,
  iconSize: {
    sm: 16,
    md: 20,
    lg: 28,
  },
} as const;

export type LayoutScale = typeof layoutScale;
export const Layout = layoutScale;
