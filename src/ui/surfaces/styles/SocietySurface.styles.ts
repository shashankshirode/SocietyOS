import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  base: { minWidth: 0, overflow: 'hidden' },
});

export function createSurfaceStyle(backgroundColor: string, borderColor: string, borderWidth: number, borderRadius: number) {
  return { backgroundColor, borderColor, borderWidth, borderRadius } as const;
}
