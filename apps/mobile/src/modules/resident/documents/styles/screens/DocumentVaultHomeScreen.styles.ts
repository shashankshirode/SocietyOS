import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48, gap: 30 },
  hero: { minHeight: 218, borderRadius: 30, padding: 24, paddingRight: 72, justifyContent: 'flex-end', gap: 10, overflow: 'hidden' },
  archiveMark: { position: 'absolute', right: 22, top: 24, width: 54, height: 96, justifyContent: 'space-between' },
  archiveLine: { width: 2, height: 96, opacity: 0.26 },
  archiveLineShort: { position: 'absolute', right: 14, top: 20, width: 2, height: 58, opacity: 0.18 },
  section: { gap: 0 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { letterSpacing: 1.25, marginBottom: 10 },
  documentRow: { minHeight: 86, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth },
  documentCopy: { flex: 1, gap: 4 },
  command: { minHeight: 86, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderWidth: 1, borderRadius: 22 },
  commandIcon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  commandCopy: { flex: 1, gap: 3 },
  securityNote: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingHorizontal: 4 },
  securityCopy: { flex: 1, gap: 3 },
});

export function createRootStyle(backgroundColor: string) { return { backgroundColor } as const; }
export function createSurfaceStyle(backgroundColor: string) { return { backgroundColor } as const; }
export function createAccentStyle(backgroundColor: string) { return { backgroundColor } as const; }
export function createBorderStyle(borderColor: string) { return { borderColor } as const; }
export function createColorStyle(color: string) { return { color } as const; }
