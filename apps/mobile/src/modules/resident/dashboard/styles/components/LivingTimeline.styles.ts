import { StyleSheet } from 'react-native';

export const createTimeStyle = (color: string) => ({ color });
export const createNodeStyle = (backgroundColor: string) => ({ backgroundColor });
export const createLineStyle = (backgroundColor: string) => ({ backgroundColor });

export const styles = StyleSheet.create({
  section: { gap: 12 },
  timeline: { paddingTop: 2 },
  row: { minHeight: 68, flexDirection: 'row' },
  time: { width: 62, paddingTop: 1 },
  rail: { width: 24, alignItems: 'center' },
  node: { width: 9, height: 9, borderRadius: 5, marginTop: 5, zIndex: 2 },
  line: { position: 'absolute', width: 1, top: 13, bottom: -5 },
  copy: { flex: 1, gap: 2, paddingBottom: 18 },
  quietState: { minHeight: 126, justifyContent: 'center', gap: 4 },
});

