import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme/useAppTheme';
import { Spacing } from '../theme/spacing';
import { SafeText } from './SafeText';
import { PressableScale } from '../motion/PressableScale';

export interface ActionRowProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  iconName?: keyof typeof Ionicons.glyphMap;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ActionRow({
  title,
  subtitle,
  icon,
  iconName,
  trailing,
  showChevron = true,
  onPress,
  disabled = false,
  style,
  testID,
}: ActionRowProps) {
  const theme = useAppTheme();

  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled || !onPress}
      onPress={onPress}
      style={[
        {
          minHeight: 56,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.md,
          backgroundColor: theme.semantic.surface.soft,
          borderColor: theme.semantic.border.default,
          borderWidth: 1,
          borderRadius: 12,
          gap: Spacing.md,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1, minWidth: 0 }}>
        {icon ? (
          icon
        ) : iconName ? (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: theme.semantic.surface.raised,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={iconName} size={20} color={theme.semantic.accent.moss} />
          </View>
        ) : null}

        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <SafeText variant="bodyStrong" numberOfLines={1} style={{ color: theme.semantic.text.primary }}>
            {title}
          </SafeText>
          {subtitle ? (
            <SafeText variant="caption" color="secondary" numberOfLines={1}>
              {subtitle}
            </SafeText>
          ) : null}
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
        {trailing}
        {showChevron && onPress ? (
          <Ionicons name="chevron-forward" size={18} color={theme.semantic.text.tertiary} />
        ) : null}
      </View>
    </PressableScale>
  );
}
