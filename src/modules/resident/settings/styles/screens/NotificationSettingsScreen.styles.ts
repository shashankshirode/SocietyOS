import { StyleSheet } from 'react-native';
import { Radius, Spacing, Typography } from '../../../../../shared/theme';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  deviceSection: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.tiny,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  deviceBody: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  deviceCopy: { flex: 1, minWidth: 0, gap: Spacing.xs },
  deviceCommand: {
    minHeight: 44,
    flexShrink: 0,
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  sections: { width: '100%' },
  sectionsWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    columnGap: Spacing.xxl,
  },
  section: {
    width: '100%',
    borderTopWidth: 1,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  sectionWide: {
    width: '48%',
    flexGrow: 1,
    flexBasis: 320,
  },
  settingRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  settingCopy: { flex: 1, minWidth: 0, gap: 2 },
  requiredState: {
    minHeight: 34,
    flexShrink: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
  },
  helpSection: {
    borderTopWidth: 1,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  helpTrigger: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  helpCopy: { maxWidth: 620, paddingBottom: Spacing.lg },
});

export const createScrollInsetStyle = (bottomInset: number) => ({ paddingBottom: bottomInset + Spacing.xxxl });
export const createBorderStyle = (borderColor: string) => ({ borderColor, borderBottomWidth: 1 });
export const createMutedSurfaceStyle = (backgroundColor: string) => ({ backgroundColor });
