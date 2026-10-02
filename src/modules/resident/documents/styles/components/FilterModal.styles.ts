import { StyleSheet } from 'react-native';
import { Colors } from '../../../../../shared/constants/colors';
import { Layout } from '../../../../../shared/constants/layout';
import { Spacing } from '../../../../../shared/constants/spacing';
import { Typography } from '../../../../../shared/constants/typography';

export const styles = StyleSheet.create({
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
    ...StyleSheet.absoluteFillObject,
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
  content: {
    paddingBottom: Spacing.lg,
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