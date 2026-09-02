import React from 'react';
import { ActivityIndicator, View, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { Spacing } from '../../shared/theme/spacing';
import { Radius } from '../../shared/theme/radius';
import { SafeText } from '../../shared/components/SafeText';
import { LoadingIntent } from '../../core/async/AsyncState';

export type SocietyIndicatorSize = 'sm' | 'md' | 'lg';

export interface SocietyLoadingIndicatorProps {
  readonly size?: SocietyIndicatorSize;
  readonly intent?: LoadingIntent;
  readonly message?: string;
  readonly color?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function SocietyLoadingIndicator({
  size = 'md',
  intent = LoadingIntent.SECTION,
  message,
  color,
  style,
  testID,
}: SocietyLoadingIndicatorProps) {
  const { semantic } = useAppTheme();
  const indicatorColor = color ?? semantic.accent.moss;
  const indicatorSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'small';

  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={message ?? `Loading ${intent.toLowerCase()}`}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          padding: size === 'sm' ? Spacing.xs : size === 'lg' ? Spacing.xl : Spacing.md,
          gap: Spacing.sm,
        },
        style,
      ]}
    >
      <ActivityIndicator size={indicatorSize} color={indicatorColor} />
      {message ? (
        <SafeText
          variant={size === 'sm' ? 'caption' : 'body'}
          color="secondary"
          align="center"
          numberOfLines={2}
        >
          {message}
        </SafeText>
      ) : null}
    </View>
  );
}

export interface SocietyInlineLoaderProps {
  readonly label?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function SocietyInlineLoader({ label, style, testID }: SocietyInlineLoaderProps) {
  const { semantic } = useAppTheme();

  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.sm,
          paddingVertical: Spacing.xs,
          paddingHorizontal: Spacing.sm,
        },
        style,
      ]}
    >
      <ActivityIndicator size="small" color={semantic.accent.moss} />
      {label ? (
        <SafeText variant="caption" color="secondary">
          {label}
        </SafeText>
      ) : null}
    </View>
  );
}

export interface SocietyRefreshIndicatorProps {
  readonly refreshing: boolean;
  readonly label?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function SocietyRefreshIndicator({
  refreshing,
  label = 'Updating...',
  style,
  testID,
}: SocietyRefreshIndicatorProps) {
  const { semantic } = useAppTheme();

  if (!refreshing) {
    return null;
  }

  return (
    <View
      testID={testID}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.xs,
          backgroundColor: semantic.surface.soft,
          borderRadius: Radius.pill,
          paddingVertical: 4,
          paddingHorizontal: Spacing.md,
          alignSelf: 'center',
          marginVertical: Spacing.xs,
          borderWidth: 1,
          borderColor: semantic.border.subtle,
        },
        style,
      ]}
    >
      <ActivityIndicator size="small" color={semantic.accent.moss} />
      <SafeText variant="caption" color="secondary" style={{ fontSize: 11 }}>
        {label}
      </SafeText>
    </View>
  );
}

export interface SocietyActionProgressProps {
  readonly color?: string;
  readonly size?: 'small' | 'large';
  readonly testID?: string;
}

export function SocietyActionProgress({
  color,
  size = 'small',
  testID,
}: SocietyActionProgressProps) {
  const { semantic } = useAppTheme();
  return (
    <ActivityIndicator
      testID={testID}
      size={size}
      color={color ?? semantic.text.inverse}
    />
  );
}
