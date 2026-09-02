import React from 'react';
import {
  ActivityIndicator,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useAppTheme } from '../theme/useAppTheme';
import { Spacing } from '../theme/spacing';
import { SafeText } from './SafeText';
import { PressableScale } from '../motion/PressableScale';

export type SocietyButtonVariant =
  | 'primary'
  | 'secondary'
  | 'quiet'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'outline';

export type SocietyButtonSize = 'sm' | 'md' | 'lg';

export interface SocietyButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: SocietyButtonVariant;
  size?: SocietyButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export function SocietyButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}: SocietyButtonProps) {
  const theme = useAppTheme();

  const minHeight = size === 'sm' ? 36 : size === 'lg' ? 52 : 44;
  const paddingHorizontal = size === 'sm' ? Spacing.md : size === 'lg' ? Spacing.xl : Spacing.lg;
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 16 : 14;

  const getVariantStyles = (): { container: ViewStyle; textColor: string; iconColor: string } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.semantic.surface.raised,
            borderWidth: 1,
            borderColor: theme.semantic.border.default,
          },
          textColor: theme.semantic.text.primary,
          iconColor: theme.semantic.text.primary,
        };
      case 'quiet':
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 0,
          },
          textColor: theme.semantic.accent.moss,
          iconColor: theme.semantic.accent.moss,
        };
      case 'danger':
        return {
          container: {
            backgroundColor: theme.semantic.status.danger,
            borderWidth: 0,
          },
          textColor: theme.semantic.text.inverse,
          iconColor: theme.semantic.text.inverse,
        };
      case 'success':
        return {
          container: {
            backgroundColor: theme.semantic.status.success,
            borderWidth: 0,
          },
          textColor: theme.semantic.text.inverse,
          iconColor: theme.semantic.text.inverse,
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.semantic.border.default,
          },
          textColor: theme.semantic.text.primary,
          iconColor: theme.semantic.text.primary,
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: theme.semantic.accent.moss,
            borderWidth: 0,
          },
          textColor: theme.semantic.text.inverse,
          iconColor: theme.semantic.text.inverse,
        };
    }
  };

  const { container: variantContainer, textColor } = getVariantStyles();

  const handlePress = () => {
    if (disabled || loading) return;
    void onPress();
  };

  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={handlePress}
      style={[
        {
          minHeight,
          paddingHorizontal,
          borderRadius: size === 'sm' ? 8 : 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.sm,
          opacity: disabled ? 0.45 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        variantContainer,
        style,
      ]}
    >
      {loading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm }}>
          <ActivityIndicator size="small" color={textColor} />
          <SafeText
            variant={size === 'sm' ? 'caption' : 'bodyStrong'}
            style={[{ color: textColor, fontSize, fontWeight: '600' }, textStyle]}
          >
            {title}
          </SafeText>
        </View>
      ) : (
        <>
          {iconLeft}
          <SafeText
            variant={size === 'sm' ? 'caption' : 'bodyStrong'}
            style={[{ color: textColor, fontSize, fontWeight: '600' }, textStyle]}
          >
            {title}
          </SafeText>
          {iconRight}
        </>
      )}
    </PressableScale>
  );
}
