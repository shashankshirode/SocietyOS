import React from 'react';
import {
  ScrollView,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { Spacing } from '../../../shared/theme/spacing';
import { ResidentAppHeader } from '../navigation/ResidentAppHeader';
import type { ResidentAppHeaderProps } from '../navigation/residentHeader.types';
import { resolveResidentTabBarObstruction } from '../navigation/useResidentTabBarLayout';
import { getAppPlatform } from '../../../shared/platform';

export interface SocietyPageShellProps {
  children: React.ReactNode;
  headerProps?: ResidentAppHeaderProps;
  showHeader?: boolean;
  stickyAction?: React.ReactNode;
  scrollable?: boolean;
  showDockClearance?: boolean;
  maxWidth?: number;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function SocietyPageShell({
  children,
  headerProps,
  showHeader = true,
  stickyAction,
  scrollable = true,
  showDockClearance = false,
  maxWidth = 1040,
  contentStyle,
  style,
  testID = 'society-page-shell',
}: SocietyPageShellProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const tabBarObstruction = showDockClearance
    ? resolveResidentTabBarObstruction(width, insets.bottom, getAppPlatform())
    : 0;

  const content = (
    <View
      style={[
        {
          width: '100%',
          maxWidth,
          alignSelf: 'center',
          paddingHorizontal: Spacing.lg,
          paddingBottom: Math.max(insets.bottom, Spacing.lg) + tabBarObstruction,
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <View
      testID={testID}
      style={[
        {
          flex: 1,
          backgroundColor: theme.semantic.surface.canvas,
        },
        style,
      ]}
    >
      {showHeader && headerProps ? <ResidentAppHeader {...headerProps} /> : null}

      {scrollable ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{content}</View>
      )}

      {stickyAction ? (
        <View
          style={{
            borderTopWidth: 1,
            borderColor: theme.semantic.border.default,
            backgroundColor: theme.semantic.surface.raised,
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.sm,
            paddingBottom: Math.max(insets.bottom, Spacing.md),
          }}
        >
          {stickyAction}
        </View>
      ) : null}
    </View>
  );
}
