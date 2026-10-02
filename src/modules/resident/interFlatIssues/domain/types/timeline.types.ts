import type { Absent } from '../../../../../shared/types/absence.types';
export type TimelineEventType = 'CASE_OPENED' | 'PARTY_INVITED' | 'CLAIM_RECORDED' | 'EVIDENCE_ATTACHED' | 'EVIDENCE_REJECTED' | 'RESPONSE_RECORDED' | 'INSPECTION_REQUESTED' | 'INSPECTION_SCHEDULED' | 'INSPECTION_COMPLETED' | 'MEDIATION_REQUESTED' | 'MEDIATOR_ASSIGNED' | 'MEDIATION_NOTE_RECORDED' | 'RESOLUTION_PROPOSED' | 'PROPOSAL_ACCEPTED' | 'PROPOSAL_REJECTED' | 'CLOSURE_PROOF_SUBMITTED' | 'CASE_RESOLVED' | 'CASE_CLOSED' | 'CASE_WITHDRAWN' | 'CASE_ESCALATED' | 'ESCALATION_ACKNOWLEDGED' | 'SLA_BREACH_RECORDED' | 'FINANCE_LINK_REQUESTED' | 'FINANCE_LINK_DECIDED' | 'MOVE_OUT_LINK_REQUESTED' | 'RETENTION_REVIEW_RECORDED' | 'LEGAL_HOLD_PLACED' | 'LEGAL_HOLD_RELEASED' | 'CASE_RECORD_DISPOSED';
export type TimelineAudience = 'ALL_PARTIES' | 'COMMITTEE_AND_MEDIATOR' | 'MEDIATOR_ONLY' | 'SYSTEM_ONLY';
export type TimelineEvent = {
    readonly id: string;
    readonly caseId: string;
    readonly societyId: string;
    readonly sequence: number;
    readonly eventType: TimelineEventType;
    readonly actorUserId: string;
    readonly actorRoleLabel: string;
    readonly occurredAt: string;
    readonly summary: string;
    readonly audience: TimelineAudience;
    readonly neutralStatement: boolean;
    readonly relatedEntityId: string | Absent;
};
export type CaseAuditEntry = {
    readonly id: string;
    readonly caseId: string;
    readonly societyId: string;
    readonly occurredAt: string;
    readonly actorUserId: string;
    readonly actorRole: string;
    readonly action: string;
    readonly entityType: string;
    readonly entityId: string;
    readonly correlationId: string;
    readonly outcome: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
    readonly detail: string;
};
const PROHIBITED_ADJUDICATIVE_PHRASES: readonly string[] = [
    'is guilty',
    'is at fault',
    'is the culprit',
    'culprit',
    'wrongdoer',
    'offender',
    'liable party is',
    'proved that',
    'convicted',
    'criminal',
];
const PROHIBITED_CONTACT_PATTERNS: readonly RegExp[] = [
    /\b[\w.+-]+@[\w-]+\.[\w.]+\b/,
    /\b(?:\+?\d[\d\s().-]{7,}\d)\b/,
    /\b(?:whatsapp|telegram|signal|wechat|snapchat|instagram)\b/,
    /\b(?:my|our)\s+(?:personal\s+)?(?:number|phone|mobile|email|inbox|account)\b/,
    /\b(?:call|text|message|dm)\s+me\b/,
    /\b(?:reach|contact)\s+me\s+(?:on|at|directly)\b/,
    /\bmy\s+home\s+address\b/,
];
export function containsDirectContactDetail(value: string): boolean {
    const normalized = value.toLowerCase();
    return PROHIBITED_CONTACT_PATTERNS.some((pattern) => pattern.test(normalized));
}
export function isNeutralSummary(summary: string): boolean {
    const normalized = summary.toLowerCase();
    return !PROHIBITED_ADJUDICATIVE_PHRASES.some((phrase) => normalized.includes(phrase));
}
export function isCaseRecordSafeText(value: string): boolean {
    return isNeutralSummary(value) && !containsDirectContactDetail(value);
}
export function nextSequence(events: readonly TimelineEvent[]): number {
    return events.reduce((highest, event) => (event.sequence > highest ? event.sequence : highest), 0) + 1;
}

