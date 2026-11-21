import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '../theme/useAppTheme';
import { Spacing } from '../theme/spacing';
import { SafeText } from './SafeText';
import { SocietyButton } from './SocietyButton';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryTitle?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryTitle = 'Try again',
  style,
  testID,
}: ErrorStateProps) {
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
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="alert-circle-outline" size={28} color={theme.semantic.status.danger} />
      </View>

      <View style={{ alignItems: 'center', gap: Spacing.xs }}>
        <SafeText variant="bodyStrong" style={{ textAlign: 'center', color: theme.semantic.text.primary }}>
          {title}
        </SafeText>
        <SafeText variant="caption" color="secondary" style={{ textAlign: 'center' }}>
          {message}
        </SafeText>
      </View>

      {onRetry ? (
        <SocietyButton
          title={retryTitle}
          onPress={onRetry}
          variant="secondary"
          size="sm"
          style={{ marginTop: Spacing.xs }}
        />
      ) : null}
    </View>
  );
}
