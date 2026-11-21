import React from 'react';
import { useFeatureFlags, type FeatureFlagKey } from '../../core/featureFlags/useFeatureFlag';

type FeatureGateProps = {
  flag: FeatureFlagKey;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export function FeatureGate({ flag, fallback = null, children }: FeatureGateProps) {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(flag) ? <>{children}</> : <>{fallback}</>;
}
