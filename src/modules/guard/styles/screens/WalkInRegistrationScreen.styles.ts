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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  typeCard: {
    padding: Spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    minWidth: '30%',
    alignItems: 'center',
    flex: 1,
  },
  typeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  typeCardText: {
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontWeight: '500',
  },
  typeCardTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  formFields: {
    gap: Spacing.md,
  },
  conditionalSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.infoSoft,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.info,
  },
  infoText: {
    color: Colors.info,
    flex: 1,
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
  formFields: {
    gap: Spacing.md,
  },
  confirmCard: {
    padding: Spacing.md,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  confirmLabel: {
    color: Colors.textSecondary,
  },
  confirmValue: {
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