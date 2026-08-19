export type HapticFeedbackKind = 'selection' | 'success' | 'warning' | 'error';

export function getHapticFallbackMessageKey(): string {
  return 'resident.platform.hapticsUnavailable';
}

export function triggerOptionalHaptic(_kind: HapticFeedbackKind): boolean {
  return false;
}
