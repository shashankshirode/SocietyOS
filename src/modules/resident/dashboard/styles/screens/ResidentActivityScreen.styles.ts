import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export const createRootStyle = (backgroundColor: string) => ({ backgroundColor });
