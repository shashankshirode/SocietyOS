import { StyleSheet } from 'react-native';
import { Radius, Spacing, Typography } from '../../../../shared/theme';

export const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: 144,
    gap: Spacing.xxl,
  },
  feature: {
    minHeight: 184,
    borderRadius: Radius.feature,
    padding: Spacing.xl,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  eyebrow: {
    ...Typography.tiny,
    textTransform: 'uppercase',
    letterSpacing: 0.75,
  },
  section: { gap: Spacing.md },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  utilityList: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  utilityRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    position: 'relative',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  utilityTitle: { flex: 1 },
  divider: {
    position: 'absolute',
    left: 56,
    right: 0,
    bottom: 0,
    height: 1,
  },
  activityRow: {
    minHeight: 64,
    borderTopWidth: 1,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  postCard: {
    padding: Spacing.lg,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  postCategoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  postActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  eventCard: {
    padding: Spacing.lg,
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  eventHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rsvpBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
  },
  rsvpBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
});

export const createBackgroundStyle = (backgroundColor: string) => ({ backgroundColor });
export const createBorderStyle = (borderColor: string) => ({ borderColor });
export const createColorStyle = (color: string) => ({ color });
