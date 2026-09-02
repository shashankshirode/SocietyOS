import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  canvas: {
    width: '100%',
    alignSelf: 'center',
  },
});

export function createPageLayoutStyle(paddingHorizontal: number, maxWidth?: number) {
  return maxWidth === undefined ? { paddingHorizontal } : { paddingHorizontal, maxWidth };
}
