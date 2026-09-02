import { StyleSheet } from 'react-native';
import { Radius, Spacing } from '../../../../shared/theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xxl,
  },
  narrativeBlock: {
    gap: Spacing.xxs,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  fieldContainer: {
    borderRadius: Radius.feature,
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.lg,
    overflow: 'hidden',
  },
  gateNode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignSelf: 'center',
    minWidth: 210,
  },
  gateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  gateDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  transitLane: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
  },
  transitLine: {
    width: 2,
    height: '100%',
  },
  spatialBaysContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  baySlot: {
    flex: 1,
    minHeight: 140,
    borderRadius: Radius.surface,
    borderWidth: 1.5,
    padding: Spacing.md,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  baySlotOccupied: {
    borderStyle: 'solid',
  },
  baySlotEmpty: {
    borderStyle: 'dashed',
  },
  baySlotCaution: {
    borderWidth: 2,
  },
  bayHeader: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bayBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  vehicleGlyphContainer: {
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  vehiclePlateBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.control,
    borderWidth: 1,
  },
  actionCard: {
    borderRadius: Radius.surface,
    borderWidth: 1,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionCopy: {
    flex: 1,
    gap: Spacing.xxs,
  },
  traceContainer: {
    gap: Spacing.md,
  },
  traceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  traceList: {
    gap: Spacing.sm,
  },
  traceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  traceNodeColumn: {
    alignItems: 'center',
    width: 24,
  },
  traceNodeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  traceLine: {
    width: 2,
    flex: 1,
    minHeight: 32,
    marginVertical: 4,
  },
  traceContent: {
    flex: 1,
    borderRadius: Radius.surface,
    borderWidth: 1,
    padding: Spacing.md,
    gap: Spacing.xxs,
  },
  fleetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
  },
});

export const createColorStyle = (color: string) => ({ color });
export const createBgStyle = (backgroundColor: string, borderColor?: string) => ({
  backgroundColor,
  ...(borderColor ? { borderColor } : {}),
});
export const createContentInset = (top: number, bottom: number) => ({
  paddingTop: top + Spacing.md,
  paddingBottom: bottom + Spacing.xxl,
});
