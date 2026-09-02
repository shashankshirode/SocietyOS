import { StyleSheet } from 'react-native';
import { Radius, Spacing, Typography } from '../../../../shared/theme';

export const styles = StyleSheet.create({
  sheet: {
    maxHeight: '88%',
    borderTopLeftRadius: Radius.hero,
    borderTopRightRadius: Radius.hero,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  eyebrow: {
    ...Typography.tiny,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  scroll: { flexGrow: 0 },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  identity: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  identityMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  section: { gap: Spacing.xs },
  sectionLabel: { marginTop: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.8 },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCopy: { minWidth: 0, flex: 1, gap: 2 },
  signOut: { marginTop: Spacing.sm },
  confirmation: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  confirmationActions: { gap: Spacing.sm },
});

export const createColorStyle = (color: string) => ({ color });
export const createBackgroundStyle = (backgroundColor: string) => ({ backgroundColor });
export const createBorderStyle = (borderBottomColor: string) => ({ borderBottomColor });
