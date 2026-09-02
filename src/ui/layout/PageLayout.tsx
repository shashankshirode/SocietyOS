import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { responsiveLayoutTokens, type PageLayoutMode, type ResponsiveClass } from './responsiveTokens';
import { useResponsiveLayout } from './useResponsiveLayout';
import { createPageLayoutStyle, styles } from './styles/PageLayout.styles';

export type PageLayoutProps = {
  children: ReactNode;
  mode?: PageLayoutMode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function resolvePageLayoutMetrics(mode: PageLayoutMode, layoutClass: ResponsiveClass, viewportWidth: number) {
  const paddingHorizontal = responsiveLayoutTokens.gutter[layoutClass];
  if (mode === 'full') return { paddingHorizontal, maxWidth: viewportWidth, columns: 1 as const };
  if (mode === 'focus') return { paddingHorizontal, maxWidth: Math.min(viewportWidth, responsiveLayoutTokens.focusWidth[layoutClass]), columns: 1 as const };
  if (mode === 'split') return {
    paddingHorizontal,
    maxWidth: Math.min(viewportWidth, responsiveLayoutTokens.maxContentWidth[layoutClass]),
    columns: (layoutClass === 'tablet' || layoutClass === 'wide' ? 2 : 1) as 1 | 2,
  };
  return { paddingHorizontal, maxWidth: Math.min(viewportWidth, responsiveLayoutTokens.readingWidth[layoutClass]), columns: 1 as const };
}

export function PageLayout({ children, mode = 'reading', style, testID }: PageLayoutProps) {
  const responsive = useResponsiveLayout();
  const metrics = resolvePageLayoutMetrics(mode, responsive.layoutClass, responsive.width);
  return (
    <View
      testID={testID}
      style={[styles.canvas, createPageLayoutStyle(metrics.paddingHorizontal, mode === 'full' ? undefined : metrics.maxWidth), style]}
    >
      {children}
    </View>
  );
}

export default PageLayout;
