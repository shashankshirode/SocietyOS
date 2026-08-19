import { createResidenceDataScopeKey } from '../../../shared/data/scope/createResidenceDataScopeKey';
import type { ResidentHomeContext } from '../homeContext/data/residentHomeContext.types';
import { residentMockFeatureKeys, type ResidentMockEdgeCase, type ResidentMockFeatureDataset, type ResidentMockFeatureKey, type ResidentMockRecord, type ResidentMockRecordStatus, type ResidentMockScenario, type ResidentMockScenarioState, } from './residentMockScenario.types';
import { createResidentMockEdgeCaseId, createResidentMockId } from './residentMockIds';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export const fullResidenceMockVolumes: Readonly<Record<ResidentMockFeatureKey, number>> = {
    homeContext: 1,
    dashboard: 12,
    todaysPriority: 12,
    residencePulse: 8,
    dailyInsights: 8,
    notifications: 60,
    visitors: 40,
    visitorExitAssurance: 15,
    gateEntry: 20,
    billing: 36,
    complaints: 25,
    documents: 30,
    noc: 10,
    family: 12,
    tenant: 8,
    ownerTenantHistory: 8,
    moveInMoveOut: 8,
    parking: 12,
    facilityBooking: 20,
    facilitySlots: 60,
    residentConnect: 20,
    chat: 20,
    notices: 40,
    governance: 10,
    communityHub: 25,
    marketplace: 50,
    borrowLend: 20,
    lostFound: 20,
    skillDirectory: 20,
    verifiedVendors: 25,
    emergency: 8,
    seniorCare: 8,
    childSafety: 8,
    petCommunity: 12,
    knowledgeBase: 20,
    communityServices: 20,
    interFlatIssues: 12,
    rules: 8,
    domesticHelp: 12,
    contextualInsights: 8,
    recentActivity: 20,
    profileSettings: 8
};
const statusCycles: Partial<Record<ResidentMockFeatureKey, readonly ResidentMockRecordStatus[]>> = {
    visitors: ['upcoming', 'inside', 'completed', 'expired', 'cancelled', 'overdue'],
    visitorExitAssurance: ['inside', 'overdue', 'completed'],
    billing: ['approved', 'overdue', 'partial', 'completed', 'pending', 'failed'],
    complaints: ['active', 'assigned', 'inProgress', 'resolved', 'reopened', 'closed', 'rejected'],
    documents: ['verified', 'pending', 'missing', 'expired', 'rejected', 'restricted'],
    noc: ['pending', 'approved', 'rejected', 'completed', 'expired', 'overdue'],
    facilityBooking: ['available', 'limited', 'full', 'maintenance', 'closed', 'cancelled'],
    facilitySlots: ['available', 'limited', 'full', 'maintenance', 'closed'],
    chat: ['unread', 'read', 'pending', 'failed', 'restricted'],
    notices: ['unread', 'read', 'expired', 'pending'],
    marketplace: ['active', 'reserved', 'sold', 'expired', 'underReview'],
    notifications: ['unread', 'read', 'active', 'pending'],
    contextualInsights: ['active', 'overdue', 'resolved']
};
const commonEdgeCaseStates: readonly ResidentMockScenarioState[] = [
    'empty',
    'single',
    'large',
    'loading',
    'error',
    'stale',
    'restricted',
    'featureDisabled',
    'missingOptionalData',
    'invalidSourceData',
];
function getEnabledFeatures(home: ResidentHomeContext): readonly ResidentMockFeatureKey[] {
    if (home.featureCoverage === 'restricted') {
        return ['homeContext', 'dashboard', 'notifications', 'profileSettings'];
    }
    if (home.featureCoverage === 'pending') {
        return ['homeContext', 'dashboard', 'notifications', 'profileSettings'];
    }
    if (home.featureCoverage === 'limited') {
        return residentMockFeatureKeys.filter((feature) => !['billing', 'tenant', 'ownerTenantHistory', 'noc', 'documents'].includes(feature));
    }
    if (home.featureCoverage === 'tenantFocused') {
        return residentMockFeatureKeys.filter((feature) => !['family', 'ownerTenantHistory'].includes(feature));
    }
    return residentMockFeatureKeys;
}
function getFeatureVolume(home: ResidentHomeContext, feature: ResidentMockFeatureKey): number {
    if (!getEnabledFeatures(home).includes(feature)) {
        return 0;
    }
    if (home.featureCoverage === 'pending' || home.featureCoverage === 'restricted') {
        return 1;
    }
    if (home.featureCoverage === 'limited') {
        return Math.max(2, Math.ceil(fullResidenceMockVolumes[feature] * 0.35));
    }
    if (home.featureCoverage === 'tenantFocused') {
        return Math.max(4, Math.ceil(fullResidenceMockVolumes[feature] * 0.65));
    }
    return fullResidenceMockVolumes[feature];
}
function getStatus(feature: ResidentMockFeatureKey, ordinal: number, homeContextId: string): ResidentMockRecordStatus {
    if (feature === 'notifications') {
        const unreadTargets: Readonly<Record<string, number>> = {
            'context-001': 12,
            'context-002': 4,
            'context-003': 9,
            'context-004': 7,
            'context-005': 1,
            'context-006': 0
        };
        return ordinal < (unreadTargets[homeContextId] ?? 0) ? 'unread' : 'read';
    }
    const cycle = statusCycles[feature] ?? ['active', 'pending', 'completed'];
    const contextOffset = Number(homeContextId.slice(-1)) - 1;
    return getRequiredItem(cycle, (ordinal + contextOffset) % cycle.length, "residentMockBuilders.ts");
}
function createFeatureRecords(home: ResidentHomeContext, feature: ResidentMockFeatureKey, dataScopeKey: string): readonly ResidentMockRecord[] {
    return Array.from({ length: getFeatureVolume(home, feature) }, (_, ordinal) => {
        const month = String((ordinal % 12) + 1).padStart(2, '0');
        const day = String((ordinal % 27) + 1).padStart(2, '0');
        const createdAtIso = `2026-${month}-${day}T08:00:00.000Z`;
        return {
            id: createResidentMockId(home.homeContextId, feature, ordinal),
            feature,
            homeContextId: home.homeContextId,
            societyId: home.societyId,
            unitId: home.unitId,
            residentRole: home.residentRole,
            dataScopeKey,
            featureFlagScopeId: home.featureFlagScopeId,
            permissionScopeId: home.permissionScopeId,
            ordinal,
            status: getStatus(feature, ordinal, home.homeContextId),
            titleMessageKey: 'resident.mockData.recordTitle',
            descriptionMessageKey: 'resident.mockData.recordDescription',
            createdAtIso,
            updatedAtIso: `2026-${month}-${day}T12:30:00.000Z`,
            ...includeWhenPresent("amount", feature === 'billing'
                ? 2500 + ordinal * 175 + Number(home.homeContextId.slice(-1)) * 420
                : undefined),
            ...includeWhenPresent("dueAtIso", feature === 'billing' ? `2026-${month}-28T18:30:00.000Z` : undefined),
            ...includeWhenPresent("optionalValue", ordinal % 7 === 0 ? undefined : `${home.homeContextId}-${feature}-${ordinal + 1}`)
        };
    });
}
function createFeatureDataset(home: ResidentHomeContext, dataScopeKey: string): ResidentMockFeatureDataset {
    return Object.fromEntries(residentMockFeatureKeys.map((feature) => [
        feature,
        createFeatureRecords(home, feature, dataScopeKey),
    ])) as ResidentMockFeatureDataset;
}
function createEdgeCases(home: ResidentHomeContext): readonly ResidentMockEdgeCase[] {
    const enabledFeatures = getEnabledFeatures(home);
    return residentMockFeatureKeys.flatMap((feature) => {
        const featureEnabled = enabledFeatures.includes(feature);
        const states = home.status === 'pendingApproval'
            ? [...commonEdgeCaseStates, 'pendingApproval' as const]
            : commonEdgeCaseStates;
        return states.map((state) => ({
            id: createResidentMockEdgeCaseId(home.homeContextId, feature, state),
            feature,
            state,
            titleMessageKey: 'resident.mockData.edgeCaseTitle' as const,
            enabled: featureEnabled
        }));
    });
}
export function buildResidentMockScenario(home: ResidentHomeContext): ResidentMockScenario {
    const dataScopeKey = createResidenceDataScopeKey({
        residentId: 'resident-001',
        societyId: home.societyId,
        unitId: home.unitId,
        residentRole: home.residentRole
    });
    return {
        homeContextId: home.homeContextId,
        societyId: home.societyId,
        unitId: home.unitId,
        residentRole: home.residentRole,
        homeStatus: home.status,
        featureCoverage: home.featureCoverage,
        dataScopeKey,
        featureFlagScopeId: home.featureFlagScopeId,
        permissionScopeId: home.permissionScopeId,
        enabledFeatures: getEnabledFeatures(home),
        records: createFeatureDataset(home, dataScopeKey),
        edgeCases: createEdgeCases(home)
    };
}

