import React from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { Spacing } from '../../../shared/theme/spacing';
import { KeyboardAwareForm } from '../../../shared/forms/KeyboardAwareForm';
import { useResponsiveLayout } from '../../../ui/layout/useResponsiveLayout';
import { SafeText } from '../../../shared/components/SafeText';

export interface AdaptiveFlowComposerProps {
  title?: string;
  subtitle?: string;
  command?: React.ReactNode;
  summary?: React.ReactNode;
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export function AdaptiveFlowComposer({
  title,
  subtitle,
  command,
  summary,
  children,
  contentStyle,
  testID = 'adaptive-flow-composer',
}: AdaptiveFlowComposerProps) {
  const theme = useAppTheme();
  const layout = useResponsiveLayout();
  const splitLayout = (layout.isTablet || layout.isFold) && Boolean(summary);

  return (
    <KeyboardAwareForm
      testID={testID}
      command={
        command ? (
          <View
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderColor: theme.semantic.border.default,
              backgroundColor: theme.semantic.surface.raised,
              paddingHorizontal: Spacing.lg,
              paddingVertical: Spacing.sm,
            }}
          >
            {command}
          </View>
        ) : undefined
      }
      contentStyle={StyleSheet.flatten([
        {
          paddingHorizontal: Spacing.lg,
          paddingBottom: Spacing.xl,
        },
        contentStyle,
      ])}
    >
      <View
        style={{
          width: '100%',
          maxWidth: layout.contentMaxWidth || 1040,
          alignSelf: 'center',
          gap: Spacing.lg,
          flexDirection: splitLayout ? 'row' : 'column',
          alignItems: splitLayout ? 'flex-start' : 'stretch',
        }}
      >
        <View style={{ flex: 1, minWidth: 0, gap: Spacing.md }}>
          {title ? (
            <SafeText variant="display" numberOfLines={2}>
              {title}
            </SafeText>
          ) : null}
          {subtitle ? (
            <SafeText variant="body" color="secondary">
              {subtitle}
            </SafeText>
          ) : null}
          {children}
        </View>

        {summary ? (
          <View style={{ width: splitLayout ? 360 : '100%', minWidth: 0 }}>
            {summary}
          </View>
        ) : null}
      </View>
    </KeyboardAwareForm>
  );
}
