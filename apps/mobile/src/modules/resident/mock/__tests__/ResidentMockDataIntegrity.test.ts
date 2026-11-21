import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import { fullResidenceMockVolumes } from '../residentMockBuilders';
import { validateResidentMockDataIntegrity } from '../residentMockDataIntegrity';
import { residentMockRegistry } from '../residentMockRegistry';

describe('resident mock data integrity', () => {
  it('keeps every residence scenario isolated and internally valid', () => {
    const report = validateResidentMockDataIntegrity();

    expect(report.issues).toEqual([]);
    expect(report.ok).toBe(true);
    expect(report.scenarioCount).toBe(mockResidentHomeContexts.length);
    expect(report.recordCount).toBeGreaterThan(2_000);
  });

  it('meets the requested full-residence feature volumes', () => {
    const fullScenarios = residentMockRegistry.scenarios.filter(
      (scenario) => scenario.featureCoverage === 'full'
    );

    expect(fullScenarios).toHaveLength(2);
    for (const scenario of fullScenarios) {
      expect(scenario.records.visitors).toHaveLength(fullResidenceMockVolumes.visitors);
      expect(scenario.records.billing).toHaveLength(fullResidenceMockVolumes.billing);
      expect(scenario.records.complaints).toHaveLength(fullResidenceMockVolumes.complaints);
      expect(scenario.records.documents).toHaveLength(fullResidenceMockVolumes.documents);
      expect(scenario.records.facilitySlots).toHaveLength(fullResidenceMockVolumes.facilitySlots);
      expect(scenario.records.marketplace).toHaveLength(fullResidenceMockVolumes.marketplace);
      expect(scenario.records.notifications).toHaveLength(fullResidenceMockVolumes.notifications);
    }
  });

  it('uses different record identities and scope keys for every residence', () => {
    const dashboardSignatures = residentMockRegistry.scenarios.map((scenario) => ({
      homeContextId: scenario.homeContextId,
      dataScopeKey: scenario.dataScopeKey,
      firstRecordId: scenario.records.dashboard[0]?.id,
    }));

    expect(new Set(dashboardSignatures.map((item) => item.dataScopeKey)).size).toBe(
      dashboardSignatures.length
    );
    expect(new Set(dashboardSignatures.map((item) => item.firstRecordId)).size).toBe(
      dashboardSignatures.length
    );
  });

  it('includes blocked invalid-source fixtures without exposing them as normal values', () => {
    const invalidFixtures = residentMockRegistry.edgeCaseFixtures.filter(
      (fixture) => fixture.state === 'invalidSourceData'
    );

    expect(invalidFixtures.length).toBeGreaterThanOrEqual(3);
    expect(invalidFixtures.every((fixture) => fixture.isBlocked)).toBe(true);
  });
});
