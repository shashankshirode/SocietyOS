import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme/useAppTheme';
import { Spacing } from '../theme/spacing';
import { SafeText } from './SafeText';
import { SocietyButton } from './SocietyButton';

export interface EmptyStateProps {
  title: string;
  description?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  actionTitle?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EmptyState({
  title,
  description,
  iconName = 'file-tray-outline',
  actionTitle,
  onAction,
  style,
  testID,
}: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <View
      testID={testID}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          padding: Spacing.xl,
          gap: Spacing.md,
          alignSelf: 'center',
          maxWidth: 420,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: theme.semantic.surface.soft,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={iconName} size={28} color={theme.semantic.text.tertiary} />
      </View>

      <View style={{ alignItems: 'center', gap: Spacing.xs }}>
        <SafeText variant="bodyStrong" style={{ textAlign: 'center', color: theme.semantic.text.primary }}>
          {title}
        </SafeText>
        {description ? (
          <SafeText variant="caption" color="secondary" style={{ textAlign: 'center' }}>
            {description}
          </SafeText>
        ) : null}
      </View>

      {actionTitle && onAction ? (
        <SocietyButton
          title={actionTitle}
          onPress={onAction}
          variant="secondary"
          size="sm"
          style={{ marginTop: Spacing.xs }}
        />
      ) : null}
    </View>
  );
}
