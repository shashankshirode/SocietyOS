import { residentFeatureRegistry } from '../data/residentFeatureRegistry';
import { validateResidentFeatureCoverage } from '../data/residentFeatureCoverage.repository';

describe('resident feature coverage registry', () => {
  it('has zero missing resident features', () => {
    const coverage = validateResidentFeatureCoverage(residentFeatureRegistry);

    expect(coverage.missing).toBe(0);
  });

  it('has no blank registry contract keys', () => {
    const coverage = validateResidentFeatureCoverage(residentFeatureRegistry);

    expect(coverage.missingRoutes).toHaveLength(0);
    expect(coverage.missingScreens).toHaveLength(0);
    expect(coverage.missingActions).toHaveLength(0);
    expect(coverage.missingMessages).toHaveLength(0);
    expect(coverage.missingLoadingStates).toHaveLength(0);
    expect(coverage.missingMockDataKeys).toHaveLength(0);
    expect(coverage.missingTests).toHaveLength(0);
  });
});

