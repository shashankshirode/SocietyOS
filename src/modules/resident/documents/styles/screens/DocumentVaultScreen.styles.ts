import { StyleSheet } from 'react-native';
import { Colors } from '../../../../../shared/constants/colors';
import { Layout } from '../../../../../shared/constants/layout';
import { Spacing } from '../../../../../shared/constants/spacing';
import { Typography } from '../../../../../shared/constants/typography';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  scrollContent: {
    paddingHorizontal: Layout.screenHorizontalPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  searchBar: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: Typography.body.fontSize,
    color: Colors.textPrimary,
  },
  sectionCard: {
    borderRadius: Layout.borderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: Layout.screenHorizontalPadding,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: Colors.accentSoft,
  },
  tabButtonText: {
    fontSize: Typography.caption.fontSize,
  },
  tabButtonTextActive: {
    color: Colors.accent,
    fontWeight: '600',
  },
  tabButtonTextInactive: {
    color: Colors.textMuted,
  },
  tabContent: {
    paddingHorizontal: Layout.screenHorizontalPadding,
    gap: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
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
    fontSize: Typography.tiny.fontSize,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: Typography.caption.fontSize,
    color: Colors.textPrimary,
  },
  expiryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryItem: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.accentSoft,
  },
  tagRemove: {
    padding: 2,
  },
  actionRow: {
    flexDirection: 'column',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  uploadButton: {
    marginTop: Spacing.md,
  },
  versionsList: {
    gap: Spacing.sm,
  },
  versionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.md,
  },
  versionItemLast: {
    borderBottomWidth: 0,
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  versionMeta: {
    gap: Spacing.xs,
  },
  versionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  accessLogList: {
    gap: Spacing.sm,
  },
  accessLogItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Layout.borderRadius.md,
  },
  accessLogMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  accessLogDetails: {
    gap: Spacing.xs,
  },
  downloadSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderTopLeftRadius: Layout.borderRadius.lg,
    borderTopRightRadius: Layout.borderRadius.lg,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  downloadSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sensitivityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  tagsSection: {
    gap: Spacing.sm,
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addTagButton: {
    padding: Spacing.xs,
  },
  tagInput: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.card,
    color: Colors.textPrimary,
    fontSize: Typography.body.fontSize,
  },
  errorContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.dangerSoft,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Spacing.md,
  },
  fileDropZone: {
    padding: Spacing.xl,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  fileDropZoneDefault: {
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceMuted,
  },
  fileDropZoneSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSoft,
  },
  dropZoneContent: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  selectedFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  fileIcon: {
    width: 56,
    height: 56,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileError: {
    marginTop: Spacing.sm,
  },
  checksumSpinner: {
    marginLeft: Spacing.sm,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderTopLeftRadius: Layout.borderRadius.xl,
    borderTopRightRadius: Layout.borderRadius.xl,
    maxHeight: '80%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Layout.screenHorizontalPadding,
  },
  sectionLabel: {
    marginBottom: Spacing.md,
    color: Colors.textMuted,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Layout.borderRadius.md,
  },
  chipInactive: {
    backgroundColor: Colors.surfaceMuted,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.accentSoft,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  chipText: {
    fontSize: Typography.caption.fontSize,
  },
  chipTextInactive: {
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.accent,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Layout.screenHorizontalPadding,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});

export function createRootStyle(color: string) {
  return { backgroundColor: color };
}

export function createSurfaceStyle(color: string) {
  return { backgroundColor: color };
}

export function createColorStyle(color: string) {
  return { color };
}

export function createBorderStyle(color: string) {
  return { borderColor: color };
}