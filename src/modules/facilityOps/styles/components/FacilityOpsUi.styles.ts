import { StyleSheet } from 'react-native';
import { Colors } from '../../../../shared/constants/colors';
import { Layout } from '../../../../shared/constants/layout';
import { Spacing } from '../../../../shared/constants/spacing';
import { Typography } from '../../../../shared/constants/typography';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.screenTitle,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  contentWithFooter: {
    paddingBottom: Spacing.xxl + 20,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  actionTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.primaryLight ?? '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  actionIconDanger: {
    backgroundColor: Colors.dangerLight ?? '#FEF2F2',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
  },
  actionSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metricCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  metricValue: {
    ...Typography.h2,
    color: Colors.primary,
  },
  metricLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  metricNote: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  detailCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailCardTitle: {
    ...Typography.subtitle,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  detailCardContent: {
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailRowLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    flex: 1,
  },
  detailRowValue: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: Spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  ioniconsMarginRight: {
    marginRight: Spacing.xs,
  },
  ioniconsMarginRight2: {
    marginRight: Spacing.sm,
  },
  warningText: {
    ...Typography.bodySmall,
    color: '#92400E',
    flex: 1,
  },
  pickerContainer: {
    marginBottom: Spacing.md,
  },
  pickerLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pickerText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
    flex: 1,
  },
  selectorContainer: {
    marginBottom: Spacing.md,
  },
  selectorLabel: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  optionButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    ...Typography.bodySmall,
    color: Colors.textPrimary,
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: Spacing.xs,
  },
  footerActions: {
    marginTop: Spacing.md,
  },
  appButtonWidth: {
    width: '100%',
  },
});
