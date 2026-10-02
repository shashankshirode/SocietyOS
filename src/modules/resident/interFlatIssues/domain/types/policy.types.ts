import type { Absent } from '../../../../../shared/types/absence.types';
import type { DisputeActorType } from './primitives';
import type { DisputeSeverity } from './case.types';
import type { EvidenceVisibility } from './evidence.types';
import type { TimelineAudience } from './timeline.types';
import type { DisputeRetentionPolicy } from './retention.types';
export type DisputeAction = 'OPEN_CASE' | 'RECORD_CLAIM' | 'VIEW_CASE_SUMMARY' | 'VIEW_PARTY_DETAILS' | 'VIEW_ALL_CLAIMS' | 'VIEW_INTERNAL_NOTES' | 'ATTACH_EVIDENCE' | 'RECORD_RESPONSE' | 'REQUEST_INSPECTION' | 'ASSIGN_INSPECTOR' | 'COMPLETE_INSPECTION' | 'REQUEST_MEDIATION' | 'ASSIGN_MEDIATOR' | 'RECORD_MEDIATOR_NOTE' | 'PROPOSE_RESOLUTION' | 'ACCEPT_PROPOSAL' | 'REJECT_PROPOSAL' | 'SUBMIT_CLOSURE_PROOF' | 'VERIFY_CLOSURE_PROOF' | 'CLOSE_CASE' | 'ESCALATE_CASE' | 'VIEW_AUDIT_TRAIL' | 'REQUEST_FINANCE_LINK' | 'APPLY_RETENTION' | 'PLACE_LEGAL_HOLD';
export type DisputePartyVisibility = {
    readonly partyIds: readonly string[];
    readonly visibility: TimelineAudience;
};
export type DisputeVisibilityPolicy = {
    readonly policyId: string;
    readonly version: string;
    readonly permitsRedaction: boolean;
    readonly redactedPartyLabel: string;
    readonly committeeTimelineAudience: TimelineAudience;
    readonly defaultEvidenceVisibility: EvidenceVisibility;
};
export type DisputeSlaPolicy = {
    readonly policyId: string;
    readonly version: string;
    readonly responseDueHoursBySeverity: Readonly<Record<DisputeSeverity, number>>;
    readonly inspectionDueHours: number;
    readonly mediationReviewDueDays: number;
    readonly escalationAfterBreachHours: number;
};
export type DisputeCommunicationPolicy = {
    readonly policyId: string;
    readonly version: string;
    readonly requiresConsentPerParty: boolean;
    readonly allowDirectContactDisclosure: false;
    readonly channels: readonly ('IN_APP' | 'CONTROLLED_THREAD' | 'NOTICE')[];
    readonly channelAvailable: (channel: 'IN_APP' | 'CONTROLLED_THREAD' | 'NOTICE') => boolean;
};
export type DisputeFinanceLinkPolicy = {
    readonly policyId: string;
    readonly version: string;
    readonly requiresCommitteeDecision: boolean;
    readonly disputeOwnsAmount: false;
    readonly disputeMayCreateCharge: false;
    readonly disputeMayReferenceFinanceDecision: boolean;
};
export type DisputeMoveOutLinkPolicy = {
    readonly policyId: string;
    readonly version: string;
    readonly disputeOwnsClearance: false;
    readonly disputeMayBlockClearance: false;
};
export type DisputePolicySet = {
    readonly visibility: DisputeVisibilityPolicy;
    readonly sla: DisputeSlaPolicy;
    readonly communication: DisputeCommunicationPolicy;
    readonly financeLink: DisputeFinanceLinkPolicy;
    readonly moveOutLink: DisputeMoveOutLinkPolicy;
    readonly retention: DisputeRetentionPolicy;
};
export const PARTY_ONLY_ACTIONS: readonly DisputeAction[] = [
    'OPEN_CASE',
    'RECORD_CLAIM',
    'VIEW_CASE_SUMMARY',
    'ATTACH_EVIDENCE',
    'RECORD_RESPONSE',
    'REQUEST_INSPECTION',
    'REQUEST_MEDIATION',
    'PROPOSE_RESOLUTION',
    'ACCEPT_PROPOSAL',
    'REJECT_PROPOSAL',
    'SUBMIT_CLOSURE_PROOF',
    'ESCALATE_CASE',
];
export const COMMITTEE_ACTIONS: readonly DisputeAction[] = [
    'OPEN_CASE',
    'RECORD_CLAIM',
    'VIEW_CASE_SUMMARY',
    'VIEW_PARTY_DETAILS',
    'VIEW_ALL_CLAIMS',
    'VIEW_INTERNAL_NOTES',
    'ATTACH_EVIDENCE',
    'RECORD_MEDIATOR_NOTE',
    'PROPOSE_RESOLUTION',
    'ACCEPT_PROPOSAL',
    'REJECT_PROPOSAL',
    'VERIFY_CLOSURE_PROOF',
    'CLOSE_CASE',
    'ESCALATE_CASE',
    'VIEW_AUDIT_TRAIL',
    'REQUEST_FINANCE_LINK',
    'APPLY_RETENTION',
    'PLACE_LEGAL_HOLD',
];
export const MEDIATOR_ACTIONS: readonly DisputeAction[] = [
    'VIEW_CASE_SUMMARY',
    'VIEW_PARTY_DETAILS',
    'VIEW_INTERNAL_NOTES',
    'RECORD_MEDIATOR_NOTE',
    'PROPOSE_RESOLUTION',
];
export const INSPECTOR_ACTIONS: readonly DisputeAction[] = [
    'VIEW_CASE_SUMMARY',
    'ASSIGN_INSPECTOR',
    'COMPLETE_INSPECTION',
    'ATTACH_EVIDENCE',
];
export type ActorActionMatrix = Readonly<Record<DisputeActorType, readonly DisputeAction[]>>;
export const DEFAULT_ACTION_MATRIX: ActorActionMatrix = {
    RESIDENT_REPORTER: PARTY_ONLY_ACTIONS,
    RESIDENT_RESPONDENT: PARTY_ONLY_ACTIONS,
    RESIDENT_AFFECTED: ['VIEW_CASE_SUMMARY'],
    SOCIETY_ADMIN: COMMITTEE_ACTIONS,
    SOCIETY_SECRETARY: COMMITTEE_ACTIONS,
    SOCIETY_CHAIRPERSON: COMMITTEE_ACTIONS,
    COMMITTEE_MEMBER: COMMITTEE_ACTIONS,
    FACILITY_MANAGER: INSPECTOR_ACTIONS,
    SECURITY_GUARD: ['VIEW_CASE_SUMMARY'],
    MEDIATOR: MEDIATOR_ACTIONS,
    INSPECTOR: INSPECTOR_ACTIONS,
    AUDITOR: ['VIEW_CASE_SUMMARY', 'VIEW_AUDIT_TRAIL'],
    TREASURER: ['VIEW_CASE_SUMMARY', 'VIEW_AUDIT_TRAIL'],
    SYSTEM: [
        'OPEN_CASE',
        'VIEW_CASE_SUMMARY',
        'VIEW_ALL_CLAIMS',
        'VIEW_AUDIT_TRAIL',
        'ESCALATE_CASE',
    ],
};
export function actionsForActor(actorType: DisputeActorType): readonly DisputeAction[] {
    return DEFAULT_ACTION_MATRIX[actorType] ?? [];
}
export type DisputePolicyOverrides = {
    readonly visibility?: Partial<DisputeVisibilityPolicy>;
    readonly sla?: Partial<DisputeSlaPolicy>;
    readonly communication?: Partial<DisputeCommunicationPolicy>;
    readonly financeLink?: Partial<DisputeFinanceLinkPolicy>;
    readonly moveOutLink?: Partial<DisputeMoveOutLinkPolicy>;
    readonly retention?: Partial<DisputeRetentionPolicy>;
};
export function resolveDisputePolicies(overrides: DisputePolicyOverrides = {}): DisputePolicySet {
    return {
        visibility: {
            policyId: 'dispute.visibility',
            version: '1.0.0',
            permitsRedaction: true,
            redactedPartyLabel: 'Other affected unit',
            committeeTimelineAudience: 'ALL_PARTIES',
            defaultEvidenceVisibility: 'PARTIES_ONLY',
            ...overrides.visibility,
        },
        sla: {
            policyId: 'dispute.sla',
            version: '1.0.0',
            responseDueHoursBySeverity: { LOW: 168, MEDIUM: 96, HIGH: 48, URGENT: 24 },
            inspectionDueHours: 72,
            mediationReviewDueDays: 14,
            escalationAfterBreachHours: 24,
            ...overrides.sla,
        },
        communication: {
            policyId: 'dispute.communication',
            version: '1.0.0',
            requiresConsentPerParty: true,
            allowDirectContactDisclosure: false,
            channels: ['IN_APP', 'CONTROLLED_THREAD', 'NOTICE'],
            channelAvailable: () => false,
            ...overrides.communication,
        },
        financeLink: {
            policyId: 'dispute.financeLink',
            version: '1.0.0',
            requiresCommitteeDecision: true,
            disputeOwnsAmount: false,
            disputeMayCreateCharge: false,
            disputeMayReferenceFinanceDecision: true,
            ...overrides.financeLink,
        },
        moveOutLink: {
            policyId: 'dispute.moveOutLink',
            version: '1.0.0',
            disputeOwnsClearance: false,
            disputeMayBlockClearance: false,
            ...overrides.moveOutLink,
        },
        retention: {
            policyId: 'dispute.retention',
            version: '1.0.0',
            caseClosureRetentionMonths: 24,
            unresolvedRetentionMonths: 36,
            evidenceVaultRetentionMonths: 24,
            legalHoldBlocksDisposal: true,
            ...overrides.retention,
        },
    };
}
export function policyRef(policy: DisputePolicySet): string {
    return `${policy.visibility.policyId}@${policy.visibility.version}+${policy.sla.policyId}@${policy.sla.version}`;
}
export type DisputePolicyResolution = {
    readonly policies: DisputePolicySet;
    readonly reference: string;
    readonly missing: readonly string[];
};
export function resolveRequiredPolicies(overrides: DisputePolicyOverrides = {}): DisputePolicyResolution {
    const policies = resolveDisputePolicies(overrides);
    const missing: string[] = [];
    for (const [severity, hours] of Object.entries(policies.sla.responseDueHoursBySeverity)) {
        if (hours === undefined || hours <= 0) {
            missing.push(`sla.responseDueHoursBySeverity.${severity}`);
        }
    }
    if (policies.sla.inspectionDueHours <= 0) {
        missing.push('sla.inspectionDueHours');
    }
    if (policies.sla.mediationReviewDueDays <= 0) {
        missing.push('sla.mediationReviewDueDays');
    }
    if (policies.sla.escalationAfterBreachHours <= 0) {
        missing.push('sla.escalationAfterBreachHours');
    }
    if (policies.visibility.permitsRedaction !== true) {
        missing.push('visibility.permitsRedaction');
    }
    return { policies, reference: policyRef(policies), missing };
}
export type FinanceLinkRequest = {
    readonly id: string;
    readonly caseId: string;
    readonly societyId: string;
    readonly requestedByUserId: string;
    readonly reason: string;
    readonly requestedAt: string;
    readonly amount: Absent;
    readonly status: 'REQUESTED' | 'ACCEPTED_BY_FINANCE' | 'REJECTED_BY_FINANCE';
    readonly financeDecisionReference: string | Absent;
};
export type MoveOutLinkRequest = {
    readonly id: string;
    readonly caseId: string;
    readonly societyId: string;
    readonly requestedByUserId: string;
    readonly reason: string;
    readonly requestedAt: string;
    readonly status: 'REQUESTED' | 'ACKNOWLEDGED_BY_MOVE_OUT' | 'REJECTED_BY_MOVE_OUT';
    readonly clearanceReference: string | Absent;
};

