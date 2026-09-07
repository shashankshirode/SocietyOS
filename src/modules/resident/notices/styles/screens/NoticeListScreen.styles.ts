import { StyleSheet } from 'react-native';

export const createRootStyle = (backgroundColor: string) => ({ backgroundColor });
export const createColorStyle = (color: string) => ({ color });
export const createBorderStyle = (borderBottomColor: string) => ({ borderBottomColor });
export const createAccentSurfaceStyle = (backgroundColor: string, borderColor: string) => ({ backgroundColor, borderColor });

export const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { padding: 16 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 40, gap: 12 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  section: { gap: 8 },
  sectionLabel: { textTransform: 'uppercase', letterSpacing: 0.85, fontSize: 11, fontWeight: '700' },
  hero: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  heroHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
  row: { minHeight: 76, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowCopy: { flex: 1, gap: 4 },
  rowMeta: { alignItems: 'center', gap: 10 },
  emptyWrap: { minHeight: 220, justifyContent: 'center' },
});

