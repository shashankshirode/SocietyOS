import type { Absent } from '../../../../../shared/types/absence.types';
import type { DisputeCase, DisputeSeverity } from '../types/case.types';
import type { DisputeSlaPolicy } from '../types/policy.types';
import type { DisputeViolation } from '../types/primitives';
import { violation } from '../types/primitives';
export type SlaBreachKind = 'RESPONSE_OVERDUE' | 'INSPECTION_OVERDUE' | 'MEDIATION_REVIEW_OVERDUE';
export type SlaBreach = {
    readonly caseId: string;
    readonly kind: SlaBreachKind;
    readonly dueAt: string;
    readonly detectedAt: string;
    readonly hoursOverdue: number;
    readonly escalatesAutomatically: boolean;
};
export type SlaEvaluation = {
    readonly caseId: string;
    readonly responseDueAt: string | Absent;
    readonly inspectionDueAt: string | Absent;
    readonly mediationReviewDueAt: string | Absent;
    readonly breaches: readonly SlaBreach[];
    readonly warnings: readonly DisputeViolation[];
};
const OPEN_STATUSES = new Set([
    'OPEN',
    'AWAITING_RESPONDENT_RESPONSE',
    'RESPONSE_RECEIVED',
    'UNDER_INVESTIGATION',
    'INSPECTION_SCHEDULED',
    'INSPECTION_COMPLETED',
    'MEDIATION_REQUESTED',
    'MEDIATION_ACTIVE',
    'RESOLUTION_PROPOSED',
    'AWAITING_CLOSURE_PROOF',
    'ESCALATED',
]);
function isCaseOpen(status: string): boolean {
    return OPEN_STATUSES.has(status);
}
export function responseDueHours(policy: DisputeSlaPolicy, severity: DisputeSeverity): number {
    return policy.responseDueHoursBySeverity[severity];
}
export function responseDueAt(policy: DisputeSlaPolicy, severity: DisputeSeverity, openedAt: string): string {
    const hours = responseDueHours(policy, severity);
    if (!(hours > 0)) {
        return new Date(Date.parse(openedAt)).toISOString();
    }
    return new Date(Date.parse(openedAt) + hours * 3600000).toISOString();
}
export function inspectionDueAt(policy: DisputeSlaPolicy, requestedAt: string): string {
    return new Date(Date.parse(requestedAt) + policy.inspectionDueHours * 3600000).toISOString();
}
export function mediationReviewDueAt(policy: DisputeSlaPolicy, requestedAt: string): string {
    return new Date(Date.parse(requestedAt) + policy.mediationReviewDueDays * 86400000).toISOString();
}
function hoursBetween(from: string, to: string): number {
    return Math.max(0, (Date.parse(to) - Date.parse(from)) / 3600000);
}
export function evaluateSla(disputeCase: DisputeCase, policy: DisputeSlaPolicy, now: Date): SlaEvaluation {
    const nowIso = now.toISOString();
    const breaches: SlaBreach[] = [];
    const warnings: DisputeViolation[] = [];
    if (!isCaseOpen(disputeCase.status)) {
        return {
            caseId: disputeCase.id,
            responseDueAt: disputeCase.sla.responseDueAt,
            inspectionDueAt: disputeCase.sla.inspectionDueAt,
            mediationReviewDueAt: disputeCase.sla.mediationReviewDueAt,
            breaches,
            warnings,
        };
    }
    const awaitingResponse = disputeCase.responses.length === 0;
    if (awaitingResponse && disputeCase.sla.responseDueAt !== undefined) {
        const overdue = hoursBetween(disputeCase.sla.responseDueAt, nowIso);
        if (overdue > 0) {
            breaches.push({
                caseId: disputeCase.id,
                kind: 'RESPONSE_OVERDUE',
                dueAt: disputeCase.sla.responseDueAt,
                detectedAt: nowIso,
                hoursOverdue: Math.round(overdue),
                escalatesAutomatically: overdue >= policy.escalationAfterBreachHours,
            });
        }
    }
    if (disputeCase.inspectionIds.length > 0 &&
        disputeCase.sla.inspectionDueAt !== undefined &&
        disputeCase.status !== 'INSPECTION_COMPLETED') {
        const overdue = hoursBetween(disputeCase.sla.inspectionDueAt, nowIso);
        if (overdue > 0) {
            breaches.push({
                caseId: disputeCase.id,
                kind: 'INSPECTION_OVERDUE',
                dueAt: disputeCase.sla.inspectionDueAt,
                detectedAt: nowIso,
                hoursOverdue: Math.round(overdue),
                escalatesAutomatically: overdue >= policy.escalationAfterBreachHours,
            });
        }
    }
    if (disputeCase.mediationId !== undefined &&
        disputeCase.sla.mediationReviewDueAt !== undefined &&
        disputeCase.status !== 'RESOLVED' &&
        disputeCase.status !== 'CLOSED') {
        const overdue = hoursBetween(disputeCase.sla.mediationReviewDueAt, nowIso) / 24;
        if (overdue > 0) {
            breaches.push({
                caseId: disputeCase.id,
                kind: 'MEDIATION_REVIEW_OVERDUE',
                dueAt: disputeCase.sla.mediationReviewDueAt,
                detectedAt: nowIso,
                hoursOverdue: Math.round(overdue),
                escalatesAutomatically: overdue >= policy.escalationAfterBreachHours,
            });
        }
    }
    return {
        caseId: disputeCase.id,
        responseDueAt: disputeCase.sla.responseDueAt,
        inspectionDueAt: disputeCase.sla.inspectionDueAt,
        mediationReviewDueAt: disputeCase.sla.mediationReviewDueAt,
        breaches,
        warnings,
    };
}
export function validateSlaPolicy(policy: DisputeSlaPolicy): readonly DisputeViolation[] {
    const violations: DisputeViolation[] = [];
    const severities: readonly DisputeSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    for (const severity of severities) {
        if (policy.responseDueHoursBySeverity[severity] <= 0) {
            violations.push(violation('SLA_POLICY_MISSING', `sla.responseDueHoursBySeverity.${severity}`));
        }
    }
    if (policy.inspectionDueHours <= 0) {
        violations.push(violation('SLA_POLICY_MISSING', 'sla.inspectionDueHours'));
    }
    if (policy.mediationReviewDueDays <= 0) {
        violations.push(violation('SLA_POLICY_MISSING', 'sla.mediationReviewDueDays'));
    }
    if (policy.escalationAfterBreachHours <= 0) {
        violations.push(violation('SLA_POLICY_MISSING', 'sla.escalationAfterBreachHours'));
    }
    return violations;
}
export function summariseBreaches(breaches: readonly SlaBreach[]): string {
    if (breaches.length === 0) {
        return 'No SLA breach detected.';
    }
    return breaches
        .map((breach) => `${breach.kind} overdue by ${breach.hoursOverdue}h`)
        .join('; ');
}

