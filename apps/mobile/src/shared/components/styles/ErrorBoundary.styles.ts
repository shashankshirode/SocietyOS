import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  stack: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 24,
    textAlign: 'center',
    maxWidth: '90%',
  },
  buttonContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    textAlign: 'center',
  },
  offlineContainer: {
    padding: 16,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    margin: 16,
  },
  offlineText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    textAlign: 'center',
    marginBottom: 4,
  },
  offlineSubtext: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
});

export function createTextColorStyle(colorValue: string) {
  return { color: colorValue } as const;
}

export function createViewBackgroundColorStyle(backgroundColorValue: string) {
  return { backgroundColor: backgroundColorValue } as const;
}