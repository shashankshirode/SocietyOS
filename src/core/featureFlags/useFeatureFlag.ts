import { useFeatureFlags, type FeatureFlagKey } from './featureFlags';

export function useFeatureFlag(flag: FeatureFlagKey): boolean {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(flag);
}
export { useFeatureFlags, type FeatureFlagKey } from './featureFlags';
