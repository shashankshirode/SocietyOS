import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
  command: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});

export function createContentStyle(paddingBottom: number) {
  return { paddingBottom } as const;
}

export function createCommandStyle(paddingBottom: number) {
  return { paddingBottom } as const;
}
