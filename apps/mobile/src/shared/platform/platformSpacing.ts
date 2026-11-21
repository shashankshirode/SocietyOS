import { platformSelect } from './platformSelect';

export function getPlatformBottomInset(baseInset: number): number {
  return platformSelect({
    ios: Math.max(baseInset, 12),
    android: Math.max(baseInset, 16),
    default: baseInset,
  });
}

export function getPlatformHeaderPadding(topInset: number): number {
  return platformSelect({
    ios: Math.max(topInset, 12),
    android: Math.max(topInset, 8),
    default: topInset,
  });
}
