
import { useMemo } from 'react';
import { residentFeatureRegistry } from '../data/residentFeatureRegistry';
import type { ResidentFeatureCoverage } from '../data/residentFeatureRegistry.types';

export function useResidentFeatureCoverage(): ResidentFeatureCoverage {
  return useMemo(() => {
    const total = residentFeatureRegistry.length;
    const implemented = residentFeatureRegistry.filter((f) => f.status === 'implemented').length;
    const partial = residentFeatureRegistry.filter((f) => f.status === 'partial').length;
    const missing = residentFeatureRegistry.filter((f) => f.status === 'missing').length;
    const frontendReady = residentFeatureRegistry.filter(
      (f) => f.status === 'frontendReadyBackendRequired'
    ).length;
    const integrationReady = residentFeatureRegistry.filter(
      (f) => f.status === 'frontendReadyIntegrationRequired'
    ).length;

    return {
      total,
      implemented,
      partial,
      missing,
      frontendReady,
      integrationReady,
      percentage: total > 0 ? Math.round((implemented / total) * 100) : 0,
    };
  }, []);
}

export default useResidentFeatureCoverage;
