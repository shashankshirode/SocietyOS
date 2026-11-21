import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, width: '100%', alignSelf: 'center' },
  scrollContent: { flexGrow: 1, width: '100%', alignSelf: 'center' },
});

export function createCanvasStyle(backgroundColor: string) {
  return { backgroundColor } as const;
}

export function createContentStyle(paddingHorizontal: number, maxWidth: number) {
  return { paddingHorizontal, maxWidth } as const;
}
