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
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenHorizontalPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircleCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  progressCircleActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  progressNumber: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  progressLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
  },
  progressLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  progressLine: {
    position: 'absolute',
    top: 16,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: Colors.border,
    zIndex: -1,
  },
  progressLineCompleted: {
    backgroundColor: Colors.success,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: Layout.screenHorizontalPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  stepContent: {
    gap: Spacing.lg,
  },
  stepTitle: {
    color: Colors.textPrimary,
  },
  stepSubtitle: {
    color: Colors.textSecondary,
  },
  unitList: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  unitCard: {
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  unitNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  unitMeta: {
    color: Colors.textSecondary,
  },
  unitStatus: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyText: {
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  relationshipOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  relationshipOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    minWidth: '45%',
    alignItems: 'center',
  },
  relationshipOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  relationshipOptionText: {
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  relationshipOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  subTypeSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  subTypeTitle: {
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  formFields: {
    gap: Spacing.md,
  },
  duplicateWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.warningSoft,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  duplicateText: {
    color: Colors.warningDark,
    flex: 1,
  },
  reviewCard: {
    padding: Spacing.md,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reviewLabel: {
    color: Colors.textSecondary,
  },
  reviewValue: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  footer: {
    padding: Layout.screenHorizontalPadding,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backButton: {
    marginTop: Spacing.sm,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Layout.screenHorizontalPadding,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
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
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
    marginTop: Spacing.sm,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function createTextColorStyle(color: string) {
  return { color };
}

export function createViewBackgroundColorStyle(color: string) {
  return { backgroundColor: color };
}