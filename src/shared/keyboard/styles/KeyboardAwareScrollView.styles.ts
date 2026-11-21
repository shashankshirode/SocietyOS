import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});

export function createContentPaddingBottomStyle(paddingBottom: number) {
  return { paddingBottom } as const;
}
