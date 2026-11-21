import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  hero: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  heroIcon: {
    marginTop: 12,
  },
  sectionCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    letterSpacing: 1.5,
  },
  buttonRow: {
    gap: 12,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  securityCopy: {
    flex: 1,
  },
  resultCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  certCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
});

export function createRootStyle(backgroundColor: string) {
  return { backgroundColor } as const;
}

export function createSurfaceStyle(backgroundColor: string) {
  return { backgroundColor } as const;
}

export function createColorStyle(color: string) {
  return { color } as const;
}

export function createBorderStyle(borderColor: string) {
  return { borderColor } as const;
}

export function createViewBackgroundColorStyle(backgroundColorValue: string) {
  return { backgroundColor: backgroundColorValue } as const;
}

