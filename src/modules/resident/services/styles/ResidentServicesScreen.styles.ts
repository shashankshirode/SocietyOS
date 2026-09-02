import { StyleSheet } from 'react-native';
import { Radius, Spacing, Typography } from '../../../../shared/theme';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  residence: {
    borderRadius: Radius.surface,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.xxs,
  },
  eyebrow: {
    ...Typography.tiny,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  heading: { gap: Spacing.xs },
  commandSurface: {
    borderRadius: Radius.feature,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.xxs,
  },
  commandRow: {
    minHeight: 68,
    borderRadius: Radius.control,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  primaryCommand: {
    minHeight: 92,
    marginBottom: Spacing.sm,
  },
  commandIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commandCopy: { flex: 1, gap: Spacing.xxs },
  divider: { height: 1, marginLeft: 64 },
});

export const createRootStyle = (backgroundColor: string) => ({ backgroundColor });
export const createContentStyle = (top: number, bottom: number) => ({ paddingTop: top + Spacing.md, paddingBottom: bottom + 28 });
export const createSurfaceStyle = (backgroundColor: string, borderColor?: string) => ({ backgroundColor, borderColor });
export const createTextStyle = (color: string) => ({ color });
