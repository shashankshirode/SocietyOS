import { StyleSheet } from 'react-native';
import type { AppTheme } from '../../../shared/theme';
import { Layout, Radius, Spacing } from '../../../shared/theme';

export function createLanguageSettingsStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      width: '100%',
      maxWidth: Layout.maxTabletContentWidth,
      alignSelf: 'center',
      paddingHorizontal: Spacing.screenPaddingPhone,
      paddingVertical: Spacing.lg,
      gap: Spacing.md,
    },
    languageItem: {
      width: '100%',
      minHeight: 44,
    },
    card: {
      borderWidth: 1.5,
    },
    selectedCard: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
    },
    unselectedCard: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    cardContent: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Spacing.md,
      gap: Spacing.md,
    },
    label: {
      flex: 1,
      color: theme.colors.textPrimary,
    },
    overlay: {
      ...StyleSheet.absoluteFill,
      backgroundColor: theme.colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: Radius.md,
    },
  });
}
