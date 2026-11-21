import type { ReactNode } from 'react';
import { ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { styles, createCanvasStyle, createContentStyle } from './styles/SocietyScreen.styles';
import { useResponsiveLayout } from './useResponsiveLayout';
import type { PageLayoutMode } from './responsiveTokens';
import { resolvePageLayoutMetrics } from './PageLayout';

export interface SocietyScreenProps {
  children: ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
  layoutMode?: PageLayoutMode;
}

export function SocietyScreen({ children, scroll = false, edges = ['top', 'left', 'right'], contentStyle, testID, layoutMode = 'reading' }: SocietyScreenProps) {
  const responsive = useResponsiveLayout();
  const { semantic } = useAppTheme();
  const metrics = resolvePageLayoutMetrics(layoutMode, responsive.layoutClass, responsive.width);
  const resolvedContentStyle = createContentStyle(metrics.paddingHorizontal, metrics.maxWidth);

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, createCanvasStyle(semantic.surface.canvas)]} testID={testID}>
      {scroll ? (
        <ScrollView contentContainerStyle={[styles.scrollContent, resolvedContentStyle, contentStyle]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, resolvedContentStyle, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export default SocietyScreen;
