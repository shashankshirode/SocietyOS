import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { styles, createSurfaceStyle } from './styles/SocietySurface.styles';

export type SocietySurfaceVariant =
  | 'quiet'
  | 'focus'
  | 'command'
  | 'attention'
  | 'inverse'
  | 'editorial'
  | 'floating';

export interface SocietySurfaceProps {
  children: ReactNode;
  variant?: SocietySurfaceVariant;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export function SocietySurface({ children, variant = 'quiet', style, accessibilityLabel, testID }: SocietySurfaceProps) {
  const { semantic, borderWidths, radius, shadows } = useAppTheme();
  const variants: Record<SocietySurfaceVariant, ViewStyle> = {
    quiet: createSurfaceStyle(semantic.surface.base, semantic.border.subtle, borderWidths.subtle, radius.surface),
    focus: createSurfaceStyle(semantic.surface.focus, semantic.border.default, borderWidths.subtle, radius.feature),
    command: createSurfaceStyle(semantic.surface.inverse, semantic.surface.inverse, borderWidths.subtle, radius.feature),
    attention: createSurfaceStyle(semantic.surface.attention, semantic.status.warning, borderWidths.subtle, radius.feature),
    inverse: createSurfaceStyle(semantic.surface.inverse, semantic.border.strong, borderWidths.subtle, radius.feature),
    editorial: createSurfaceStyle('transparent', 'transparent', 0, radius.control),
    floating: {
      ...createSurfaceStyle(semantic.surface.raised, semantic.border.subtle, borderWidths.subtle, radius.sheet),
      ...shadows.floating,
    },
  };

  return <View accessibilityLabel={accessibilityLabel} style={[styles.base, variants[variant], style]} testID={testID}>{children}</View>;
}

export default SocietySurface;
