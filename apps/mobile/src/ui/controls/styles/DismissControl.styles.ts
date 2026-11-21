import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  control: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export function createControlStyle(backgroundColor: string, opacity: number) {
  return { backgroundColor, opacity } as const;
}
