import type { CreateVisitorPayload, Visitor, VisitorCategory, VisitorExitTracking, VisitorType, } from '../../../../shared/types/visitor.types';
import { visitorExitAssuranceMockNowIso, visitorExitPolicies } from '../data/visitorExitPolicy';
import type { VisitorExitPolicy } from '../data/visitorExitPolicy.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export type VisitorExitValidationResult = {
    isValid: true;
} | {
    isValid: false;
    messageKey: 'visitor.validation.expectedExitRequired' | 'visitor.validation.expectedExitAfterEntry' | 'visitor.validation.expectedExitWithinPassValidity';
};
export function addMinutesToIso(iso: string, minutes: number): string {
    return new Date(new Date(iso).getTime() + minutes * 60000).toISOString();
}
export function resolveVisitorCategory(type: VisitorType, purpose?: string): VisitorCategory {
    const normalizedPurpose = purpose?.toLowerCase() ?? '';
    if (type === 'CAB') {
        return 'cab';
    }
    if (type === 'DELIVERY') {
        return normalizedPurpose.includes('parcel') ? 'parcel' : 'delivery';
    }
    if (type === 'VENDOR') {
        if (normalizedPurpose.includes('renovation')) {
            return 'renovationWorker';
        }
        if (normalizedPurpose.includes('paint')) {
            return 'paintingWorker';
        }
        if (normalizedPurpose.includes('contractor')) {
            return 'contractor';
        }
        if (normalizedPurpose.includes('repair') ||
            normalizedPurpose.includes('technician') ||
            normalizedPurpose.includes('plumb') ||
            normalizedPurpose.includes('electric')) {
            return 'repairTechnician';
        }
        if (normalizedPurpose.includes('service')) {
            return 'serviceProvider';
        }
        return 'vendor';
    }
    return 'guest';
}
export function getVisitorExitPolicy(category: VisitorCategory): VisitorExitPolicy {
    return visitorExitPolicies[category];
}
export function resolveExpectedExitAtIso(expectedEntryAtIso: string, policy: VisitorExitPolicy, selectedExpectedExitAtIso?: string): string {
    if (selectedExpectedExitAtIso && (policy.residentCanOverrideExitTime || policy.expectedExitSelectionRequired)) {
        return selectedExpectedExitAtIso;
    }
    return addMinutesToIso(expectedEntryAtIso, policy.defaultExpectedDurationMinutes);
}
export function createVisitorExitTracking({ payload, nowIso = visitorExitAssuranceMockNowIso, }: {
    payload: CreateVisitorPayload;
    nowIso?: string;
}): VisitorExitTracking {
    const category = payload.visitorCategory ?? resolveVisitorCategory(payload.type, payload.purpose);
    const policy = getVisitorExitPolicy(category);
    const expectedEntryAtIso = payload.expectedEntryAtIso ?? nowIso;
    const expectedExitAtIso = resolveExpectedExitAtIso(expectedEntryAtIso, policy, payload.expectedExitAtIso);
    const alertDueAtIso = addMinutesToIso(expectedExitAtIso, policy.gracePeriodMinutes);
    return {
        expectedEntryAtIso,
        expectedExitAtIso,
        gracePeriodMinutes: policy.gracePeriodMinutes,
        exitStatus: 'notEntered',
        alertStatus: policy.requiresExitConfirmationAlert ? 'scheduled' : 'notRequired',
        alertDueAtIso,
        timeline: [
            {
                id: `exit-track-created-${Date.now()}`,
                titleKey: 'visitor.exitAssurance.timelinePassCreated',
                descriptionKey: 'visitor.exitAssurance.timelinePassCreatedDescription',
                occurredAtIso: nowIso,
                status: 'scheduled'
            },
        ]
    };
}
export function validateExpectedExitSelection({ expectedEntryAtIso, expectedExitAtIso, passValidTillIso, policy, }: {
    expectedEntryAtIso: string;
    expectedExitAtIso?: string;
    passValidTillIso?: string;
    policy: VisitorExitPolicy;
}): VisitorExitValidationResult {
    if (policy.expectedExitSelectionRequired && !expectedExitAtIso) {
        return { isValid: false, messageKey: 'visitor.validation.expectedExitRequired' };
    }
    if (expectedExitAtIso && new Date(expectedExitAtIso).getTime() <= new Date(expectedEntryAtIso).getTime()) {
        return { isValid: false, messageKey: 'visitor.validation.expectedExitAfterEntry' };
    }
    if (expectedExitAtIso &&
        passValidTillIso &&
        new Date(expectedExitAtIso).getTime() > new Date(passValidTillIso).getTime()) {
        return { isValid: false, messageKey: 'visitor.validation.expectedExitWithinPassValidity' };
    }
    return { isValid: true };
}
export function ensureVisitorExitTracking(visitor: Visitor): VisitorExitTracking {
    if (visitor.exitTracking) {
        return visitor.exitTracking;
    }
    return createVisitorExitTracking({
        payload: {
            name: visitor.name,
            phone: visitor.phone,
            type: visitor.type,
            expectedDate: visitor.expectedDate,
            expectedTime: visitor.expectedTime,
            purpose: visitor.purpose,
            ...includeWhenPresent("visitorCategory", visitor.visitorCategory)
        },
        nowIso: visitor.createdAt
    });
}

