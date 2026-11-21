import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';
import { Spacing } from '../theme/spacing';
import { SafeText } from './SafeText';

export type SemanticStatusTone =
  | 'active'
  | 'waiting'
  | 'pending'
  | 'warning'
  | 'critical'
  | 'danger'
  | 'resolved'
  | 'completed'
  | 'neutral'
  | 'info';

export interface StatusIndicatorProps {
  label: string;
  tone?: SemanticStatusTone;
  showDot?: boolean;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function StatusIndicator({
  label,
  tone = 'neutral',
  showDot = true,
  size = 'md',
  style,
  testID,
}: StatusIndicatorProps) {
  const theme = useAppTheme();

  const getToneColors = (): { background: string; text: string; dot: string; border: string } => {
    switch (tone) {
      case 'active':
      case 'resolved':
      case 'completed':
        return {
          background: 'rgba(34, 197, 94, 0.12)',
          text: theme.semantic.status.success,
          dot: theme.semantic.status.success,
          border: 'rgba(34, 197, 94, 0.25)',
        };
      case 'waiting':
      case 'pending':
      case 'warning':
        return {
          background: 'rgba(245, 158, 11, 0.12)',
          text: theme.semantic.status.warning,
          dot: theme.semantic.status.warning,
          border: 'rgba(245, 158, 11, 0.25)',
        };
      case 'critical':
      case 'danger':
        return {
          background: 'rgba(239, 68, 68, 0.12)',
          text: theme.semantic.status.danger,
          dot: theme.semantic.status.danger,
          border: 'rgba(239, 68, 68, 0.25)',
        };
      case 'info':
        return {
          background: 'rgba(59, 130, 246, 0.12)',
          text: theme.semantic.accent.moss,
          dot: theme.semantic.accent.moss,
          border: 'rgba(59, 130, 246, 0.25)',
        };
      case 'neutral':
      default:
        return {
          background: theme.semantic.surface.soft,
          text: theme.semantic.text.secondary,
          dot: theme.semantic.text.tertiary,
          border: theme.semantic.border.default,
        };
    }
  };

  const colors = getToneColors();
  const isSm = size === 'sm';

  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 16,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 8 : 10,
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {showDot ? (
        <View
          style={{
            width: isSm ? 6 : 8,
            height: isSm ? 6 : 8,
            borderRadius: 4,
            backgroundColor: colors.dot,
          }}
        />
      ) : null}
      <SafeText
        variant={isSm ? 'tiny' : 'caption'}
        style={{
          color: colors.text,
          fontWeight: '600',
          textTransform: 'capitalize',
        }}
      >
        {label}
      </SafeText>
    </View>
  );
}
