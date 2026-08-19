import { enMessages } from '../../../messages/en';
import { mockResidentHomeContexts } from '../homeContext/data/residentHomeContext.mockData';
import { fullResidenceMockVolumes } from './residentMockBuilders';
import { residentMockSeed } from './residentMockSeed';
import { residentMockFeatureKeys, type ResidentMockFeatureKey } from './residentMockScenario.types';

export type ResidentMockIntegrityIssueCode =
  | 'CONTEXT_MISSING'
  | 'DASHBOARD_MISSING'
  | 'NOTIFICATIONS_MISSING'
  | 'FEATURE_MISSING'
  | 'VOLUME_BELOW_MINIMUM'
  | 'DUPLICATE_ID'
  | 'SCOPE_MISMATCH'
  | 'CRITICAL_FIELD_MISSING'
  | 'MESSAGE_KEY_MISSING';

export type ResidentMockIntegrityIssue = {
  code: ResidentMockIntegrityIssueCode;
  homeContextId?: string;
  feature?: ResidentMockFeatureKey;
  recordId?: string;
};

export type ResidentMockIntegrityReport = {
  ok: boolean;
  scenarioCount: number;
  recordCount: number;
  issues: readonly ResidentMockIntegrityIssue[];
};

const fullFeatureMinimums: Partial<Record<ResidentMockFeatureKey, number>> = {
  dashboard: 8,
  todaysPriority: 8,
  residencePulse: 8,
  notifications: 60,
  visitors: 40,
  billing: 36,
  complaints: 25,
  documents: 30,
  noc: 10,
  family: 12,
  parking: 12,
  facilityBooking: 20,
  facilitySlots: 60,
  chat: 20,
  notices: 40,
  governance: 8,
  marketplace: 50,
  verifiedVendors: 25,
  contextualInsights: 8,
  recentActivity: 20,
};

export function validateResidentMockDataIntegrity(): ResidentMockIntegrityReport {
  const issues: ResidentMockIntegrityIssue[] = [];
  const ids = new Set<string>();
  let recordCount = 0;

  for (const home of mockResidentHomeContexts) {
    const scenario = residentMockSeed.find((candidate) => candidate.homeContextId === home.homeContextId);
    if (!scenario) {
      issues.push({ code: 'CONTEXT_MISSING', homeContextId: home.homeContextId });
      continue;
    }

    if (home.status === 'active' && scenario.records.dashboard.length === 0) {
      issues.push({ code: 'DASHBOARD_MISSING', homeContextId: home.homeContextId, feature: 'dashboard' });
    }
    if (home.status === 'active' && scenario.records.notifications.length === 0) {
      issues.push({ code: 'NOTIFICATIONS_MISSING', homeContextId: home.homeContextId, feature: 'notifications' });
    }

    for (const feature of residentMockFeatureKeys) {
      const records = scenario.records[feature];
      recordCount += records.length;
      if (scenario.enabledFeatures.includes(feature) && records.length === 0) {
        issues.push({ code: 'FEATURE_MISSING', homeContextId: home.homeContextId, feature });
      }
      const minimum = home.featureCoverage === 'full' ? fullFeatureMinimums[feature] : undefined;
      if (minimum !== undefined && records.length < minimum) {
        issues.push({ code: 'VOLUME_BELOW_MINIMUM', homeContextId: home.homeContextId, feature });
      }

      for (const record of records) {
        if (ids.has(record.id)) {
          issues.push({ code: 'DUPLICATE_ID', recordId: record.id, feature });
        }
        ids.add(record.id);
        if (
          record.homeContextId !== scenario.homeContextId ||
          record.societyId !== scenario.societyId ||
          record.unitId !== scenario.unitId ||
          record.dataScopeKey !== scenario.dataScopeKey ||
          record.residentRole !== scenario.residentRole
        ) {
          issues.push({
            code: 'SCOPE_MISMATCH',
            homeContextId: home.homeContextId,
            feature,
            recordId: record.id,
          });
        }
        if (!record.id || !record.createdAtIso || !record.updatedAtIso || !record.status) {
          issues.push({
            code: 'CRITICAL_FIELD_MISSING',
            homeContextId: home.homeContextId,
            feature,
            recordId: record.id,
          });
        }
      }
    }
  }

  if (
    typeof enMessages.resident.mockData.recordTitle !== 'function' ||
    typeof enMessages.resident.mockData.recordDescription !== 'function' ||
    typeof enMessages.resident.mockData.edgeCaseTitle !== 'function'
  ) {
    issues.push({ code: 'MESSAGE_KEY_MISSING' });
  }

  for (const feature of residentMockFeatureKeys) {
    const configuredVolume = fullResidenceMockVolumes[feature];
    if (configuredVolume < 1) {
      issues.push({ code: 'VOLUME_BELOW_MINIMUM', feature });
    }
  }

  return {
    ok: issues.length === 0,
    scenarioCount: residentMockSeed.length,
    recordCount,
    issues,
  };
}

export const residentMockDataIntegrity = validateResidentMockDataIntegrity();
