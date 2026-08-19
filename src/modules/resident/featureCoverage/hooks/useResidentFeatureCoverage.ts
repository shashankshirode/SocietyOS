import { useMemo } from 'react';
import { residentFeatureRegistry } from '../data/residentFeatureRegistry';
import { validateResidentFeatureCoverage } from '../data/residentFeatureCoverage.repository';
import type { ResidentFeatureCoverageSummary } from '../data/residentFeatureRegistry.types';

export function useResidentFeatureCoverage(): ResidentFeatureCoverageSummary {
  return useMemo(() => validateResidentFeatureCoverage(residentFeatureRegistry), []);
}

