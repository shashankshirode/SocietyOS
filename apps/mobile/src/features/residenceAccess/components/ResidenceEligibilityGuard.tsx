import React from 'react';
import type { ResidenceAccessEligibility } from '../models/residenceAccess.types';

interface ResidenceEligibilityGuardProps {
  readonly eligibility: ResidenceAccessEligibility;
  readonly children: React.ReactNode;
  readonly fallback: React.ReactNode;
}

export function ResidenceEligibilityGuard({
  eligibility,
  children,
  fallback,
}: ResidenceEligibilityGuardProps) {
  return eligibility.canEnterResidence ? children : fallback;
}
