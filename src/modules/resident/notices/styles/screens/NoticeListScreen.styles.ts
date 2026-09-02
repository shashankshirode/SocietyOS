import { StyleSheet } from 'react-native';

export const createRootStyle = (backgroundColor: string) => ({ backgroundColor });
export const createColorStyle = (color: string) => ({ color });
export const createBorderStyle = (borderBottomColor: string) => ({ borderBottomColor });
export const createAccentSurfaceStyle = (backgroundColor: string, borderColor: string) => ({ backgroundColor, borderColor });

export const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { padding: 16 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 56, gap: 22 },
  intro: { maxWidth: 560 },
  section: { gap: 10 },
  sectionLabel: { textTransform: 'uppercase', letterSpacing: 0.85 },
  hero: { minHeight: 220, borderRadius: 28, borderWidth: 1, padding: 22, gap: 10, justifyContent: 'space-between' },
  heroFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 12 },
  row: { minHeight: 112, paddingVertical: 17, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowCopy: { flex: 1, gap: 5 },
  rowMeta: { alignItems: 'center', gap: 12 },
  emptyWrap: { minHeight: 300 },
});
