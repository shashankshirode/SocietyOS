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
  scrollContent: {
    paddingHorizontal: Layout.screenHorizontalPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  sectionCard: {
    borderRadius: Layout.borderRadius.md,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTextLarge: {
    color: Colors.white,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    color: Colors.textPrimary,
  },
  statusRow: {
    marginTop: Spacing.xs,
  },
  statusBadge: {
    alignSelf: 'flex-start',
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
  emptyDocs: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
  },
  docsList: {
    gap: Spacing.sm,
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  docItemMissing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    opacity: 0.6,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    color: Colors.textPrimary,
  },
  docMeta: {
    color: Colors.textSecondary,
  },
  docBadge: {
    marginLeft: Spacing.md,
  },
  rejectionCard: {
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  rejectionText: {
    color: Colors.danger,
  },
  actionsContainer: {
    paddingTop: Spacing.md,
    gap: Spacing.sm,
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
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  modalTitle: {
    color: Colors.textPrimary,
  },
  modalText: {
    color: Colors.textSecondary,
  },
  modalTextArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
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
});

export function createTextColorStyle(color: string) {
  return { color };
}

export function createViewBackgroundColorStyle(color: string) {
  return { backgroundColor: color };
}