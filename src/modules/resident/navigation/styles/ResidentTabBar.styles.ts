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
      height: 64,
      borderRadius: Radius.pill,
      borderWidth: 1,
      backgroundColor: '#071F1A',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.28,
          shadowRadius: 16,
        },
        android: {
          elevation: 12,
        },
      }),
    },
    activeLens: {
      position: 'absolute',
      top: theme.navigation.internalPadding,
      bottom: theme.navigation.internalPadding,
      left: theme.navigation.internalPadding,
      borderRadius: Radius.pill,
      backgroundColor: 'transparent',
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
    activeDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#FFFFFF',
      marginTop: 2,
    },
    centerActionItem: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
      top: -12,
    },
    centerActionButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#0E362C',
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    centerActionLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: 'rgba(255, 255, 255, 0.75)',
      marginTop: 2,
    },
    label: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 2,
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
