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
    gap: Spacing.md,
  },
  invitationCard: {
    borderRadius: Layout.borderRadius.md,
  },
  cardTitle: {
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
  },
  infoLabel: {
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    color: Colors.textPrimary,
  },
  stepCard: {
    borderRadius: Layout.borderRadius.md,
  },
  stepTitle: {
    marginBottom: Spacing.xs,
    color: Colors.textPrimary,
  },
  stepSubtitle: {
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  codeBox: {
    width: 48,
    height: 56,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeChar: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  errorText: {
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  codeInputs: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  hiddenInput: {
    width: 0,
    height: 0,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  resendText: {
    color: Colors.textSecondary,
  },
  formFields: {
    gap: Spacing.md,
  },
  docsPlaceholder: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Spacing.md,
  },
  docsText: {
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  docsSubtext: {
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  completionContent: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  completionTitle: {
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  completionText: {
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
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