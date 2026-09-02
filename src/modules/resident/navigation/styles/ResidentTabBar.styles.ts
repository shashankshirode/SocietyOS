import { Platform, StyleSheet } from 'react-native';
import { Radius, Spacing, Typography } from '../../../../shared/theme';
import type { AppTheme } from '../../../../shared/theme';

export const createResidentTabBarStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.navigation.internalPadding,
      height: theme.navigation.capsuleHeight,
      borderRadius: Radius.pill,
      borderWidth: theme.borderWidths.subtle,
      backgroundColor: theme.semantic.surface.inverse,
      borderColor: theme.semantic.border.strong,
      ...Platform.select({
        ios: {
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: Spacing.sm },
          shadowOpacity: 0.16,
          shadowRadius: Spacing.xxl,
        },
        android: {
          elevation: 10,
        },
      }),
    },
    activeLens: {
      position: 'absolute',
      top: theme.navigation.internalPadding,
      bottom: theme.navigation.internalPadding,
      left: theme.navigation.internalPadding,
      borderRadius: Radius.pill,
      backgroundColor: theme.colors.tabBarActive,
    },
    tabItem: {
      flex: 1,
      minWidth: 0,
      height: theme.navigation.activeLensHeight,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.xs,
    },
    label: {
      ...Typography.tabLabel,
      marginTop: Spacing.xxs,
    },
    badge: {
      position: 'absolute',
      top: -Spacing.xs,
      right: -Spacing.sm,
      minWidth: Spacing.lg,
      height: Spacing.lg,
      borderRadius: Radius.pill,
      backgroundColor: theme.semantic.status.danger,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xs,
    },
    badgeText: {
      ...Typography.statusBadge,
      color: theme.semantic.text.inverse,
    },
  });

export const createColorStyle = (color: string) => ({ color });
export const createBottomStyle = (bottom: number) => ({ bottom });
export const createLensWidthStyle = (width: number) => ({ width });
export const createDockHorizontalStyle = (screenWidth: number, inset: number, maxWidth: number) => {
  const available = Math.max(0, screenWidth - inset * 2);
  const width = Math.min(available, maxWidth);
  return { width, left: Math.max(inset, (screenWidth - width) / 2) };
};
