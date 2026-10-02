import { StyleSheet } from "react-native";
import { Colors } from "../../../../shared/constants/colors";
import { Layout } from "../../../../shared/constants/layout";
import { Spacing } from "../../../../shared/constants/spacing";
import { Typography } from "../../../../shared/constants/typography";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: Layout.screenHorizontalPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  requestCard: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  visitorMeta: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
  },
  detailLabel: {
    color: Colors.textMuted,
    fontSize: Typography.tiny.fontSize,
    marginBottom: 2,
  },
  detailValue: {
    color: Colors.textPrimary,
    fontSize: Typography.caption.fontSize,
    fontWeight: '500',
  },
  escalationBanner: {
    padding: Spacing.sm,
    borderRadius: Layout.borderRadius.md,
    marginTop: Spacing.sm,
  },
  escalationTypeBanner: {
    backgroundColor: Colors.infoSoft,
    borderLeftWidth: 3,
    borderLeftColor: Colors.info,
  },
  escalationLabel: {
    color: Colors.info,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  escalationReason: {
    color: Colors.textSecondary,
  },
  actionsSection: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
  },
  actionButtons: {
    gap: Spacing.sm,
  },
  denialCard: {
    borderWidth: 1,
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerSoft,
  },
  denialTitle: {
    color: Colors.danger,
    marginBottom: Spacing.xs,
  },
  denialReasonText: {
    color: Colors.dangerDark,
  },
  escalationCard: {
    borderWidth: 1,
    borderColor: Colors.info,
    backgroundColor: Colors.infoSoft,
  },
  escalationTitle: {
    color: Colors.info,
    marginBottom: Spacing.md,
  },
  escalationDetails: {
    gap: Spacing.md,
  },
  expiredCard: {
    backgroundColor: Colors.warningSoft,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  expiredText: {
    color: Colors.warningDark,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  retryButton: {
    marginTop: Spacing.md,
    minWidth: 200,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Layout.screenHorizontalPadding,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.xl,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  modalTitle: {
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  modalText: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  modalTextArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    padding: Spacing.md,
    backgroundColor: Colors.background,
    color: Colors.textPrimary,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
});

export function createTextColorStyle(color: string) {
  return { color };
}

export function createViewBackgroundColorStyle(color: string) {
  return { backgroundColor: color };
}