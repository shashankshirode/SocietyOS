import { StyleSheet } from 'react-native';
import { Layout, Radius, Spacing } from '../../../../shared/theme';
import type { ResidentTheme } from '../../../../ui/foundation/residentTheme';

export function createMyFacilityBookingsStyles(theme: ResidentTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
    },
    list: {
      width: '100%',
      maxWidth: Layout.maxTabletContentWidth,
      alignSelf: 'center',
      paddingHorizontal: Spacing.screenPaddingPhone,
      paddingVertical: Spacing.md,
      gap: Spacing.md,
    },
    contentContainer: {
      width: '100%',
      maxWidth: Layout.maxTabletContentWidth,
      alignSelf: 'center',
      paddingHorizontal: Spacing.screenPaddingPhone,
      paddingVertical: Spacing.md,
      gap: Spacing.md,
      paddingBottom: Spacing.xxxl,
    },
    emptyContentContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    card: {
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      padding: Spacing.lg,
      gap: Spacing.sm,
      overflow: 'hidden',
    },
    skeletonCard: {
      opacity: 0.6,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: Spacing.sm,
    },
    info: {
      flex: 1,
      gap: Spacing.xxs,
    },
    title: {
      color: theme.textPrimary,
    },
    skeletonTitle: {
      width: '60%',
      height: 16,
    },
    skeletonSubtitle: {
      width: '40%',
      height: 12,
    },
    skeletonBadge: {
      width: 60,
      height: 20,
      borderRadius: Radius.sm,
    },
    skeletonFooter: {
      width: '50%',
      height: 12,
    },
    skeletonIcon: {
      width: 16,
      height: 16,
    },
    skeletonLine: {
      borderRadius: Radius.xs,
      marginVertical: Spacing.xxs,
      backgroundColor: theme.border,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    tabsContainer: {
      width: '100%',
      maxWidth: Layout.maxTabletContentWidth,
      alignSelf: 'center',
      flexDirection: 'row',
      paddingHorizontal: Spacing.screenPaddingPhone,
      gap: Spacing.sm,
      marginVertical: Spacing.sm,
      flexWrap: 'wrap',
    },
    tab: {
      minHeight: Layout.minimumTouchTarget,
      minWidth: Layout.minimumTouchTarget,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
      borderRadius: Radius.pill,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
      borderColor: theme.border,
    },
    activeTab: {
      backgroundColor: theme.accent,
      borderColor: theme.accent,
    },
    activeTabText: {
      color: theme.textInverse,
      fontWeight: '700',
    },
    inactiveTabText: {
      color: theme.textSecondary,
      fontWeight: '700',
    },
    center: {
      flex: 1,
      width: '100%',
      maxWidth: Layout.maxTabletContentWidth,
      alignSelf: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.screenPaddingPhone,
    },
    footerLoader: {
      paddingVertical: Spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
