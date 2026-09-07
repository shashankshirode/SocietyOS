import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({});

export function createViewBackgroundColorStyle(backgroundColorValue: string) {
  return { backgroundColor: backgroundColorValue } as const;
}