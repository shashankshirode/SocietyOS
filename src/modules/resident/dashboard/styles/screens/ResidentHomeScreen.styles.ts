import { StyleSheet } from 'react-native';
import { Radius } from '../../../../../shared/theme/radius';
import { Spacing } from '../../../../../shared/theme/spacing';

export const createRootStyle = (backgroundColor: string) => ({ backgroundColor });
export const createScrollContentStyle = (topInset: number, bottomInset: number) => ({
  paddingTop: topInset + 2,
  paddingBottom: bottomInset + 56,
});
export const createContextBarStyle = (backgroundColor: string, borderColor: string) => ({ backgroundColor, borderColor });
export const createContextSocietyStyle = (color: string) => ({ color });
export const createRolePillStyle = (backgroundColor: string) => ({ backgroundColor });
export const createCommunityBorderStyle = (borderTopColor: string) => ({ borderTopColor });

export const styles = StyleSheet.create({
  root: { flex: 1 },
  centeredState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.xl },
  scrollContent: { paddingHorizontal: 20, gap: 24 },
  contextBar: { minHeight: 68, borderWidth: 1, borderRadius: Radius.lg, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  contextCopy: { flex: 1, gap: 2 },
  contextSociety: { letterSpacing: 0.55, textTransform: 'uppercase' },
  rolePill: { borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 7 },
  greetingBlock: { gap: 4, paddingTop: 2, paddingBottom: 2 },
  communityRow: { borderTopWidth: 1, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
