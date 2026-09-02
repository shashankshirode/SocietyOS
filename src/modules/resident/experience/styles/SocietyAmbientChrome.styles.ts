import { StyleSheet } from 'react-native';
import { Radius, Spacing, Typography } from '../../../../shared/theme';

export const styles = StyleSheet.create({
  chrome: {
    paddingHorizontal: 20,
    paddingBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  controls: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  beacon: {
    minWidth: 0,
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.control,
  },
  beaconEyebrow: {
    ...Typography.tiny,
    textTransform: 'uppercase',
    letterSpacing: 0.65,
  },
  beaconContext: { flexShrink: 1, minWidth: 0 },
  beaconMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  identityOrb: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
    flexShrink: 0,
  },
  identityImage: { width: '100%', height: '100%' },
  identityInitials: { fontWeight: '800', letterSpacing: 0.3 },
  identityCached: { position: 'absolute', right: 2, bottom: 2, width: 9, height: 9, borderRadius: 5 },
  edgeReturn: {
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 0,
  },
  narrative: {
    maxWidth: 680,
    gap: Spacing.xs,
  },
  narrativeEyebrow: {
    ...Typography.tiny,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: { flexShrink: 1 },
  subtitle: { maxWidth: 560 },
  contextualActions: {
    alignSelf: 'flex-start',
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.xs,
  },
  frame: { flex: 1 },
  frameContent: { flex: 1 },
});

export const createChromeInsetStyle = (paddingTop: number) => ({ paddingTop });
export const createBackgroundStyle = (backgroundColor: string) => ({ backgroundColor });
export const createBorderStyle = (borderColor: string) => ({ borderColor });
export const createColorStyle = (color: string) => ({ color });
