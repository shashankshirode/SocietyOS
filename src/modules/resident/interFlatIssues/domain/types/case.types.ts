import type { Absent } from '../../../../../shared/types/absence.types';
import type { DisputeRevision, DisputeTraceContext } from './primitives';

export type DisputeCategory =
  | 'WATER_LEAKAGE'
  | 'NOISE_DISTURBANCE'
  | 'RENOVATION_DISTURBANCE'
  | 'PET_NUISANCE'
  | 'COMMON_AREA_DAMAGE'
  | 'ODOUR_OR_SMOKE'
  | 'PARKING_RELATED'
  | 'TRASH_DISPOSAL'
  | 'OBJECT_IN_COMMON_AREA'
  | 'OTHER';

export type DisputeSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type DisputeCaseStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'AWAITING_RESPONDENT_RESPONSE'
  | 'RESPONSE_RECEIVED'
  | 'UNDER_INVESTIGATION'
  | 'INSPECTION_SCHEDULED'
  | 'INSPECTION_COMPLETED'
  | 'MEDIATION_REQUESTED'
  | 'MEDIATION_ACTIVE'
  | 'RESOLUTION_PROPOSED'
  | 'AWAITING_CLOSURE_PROOF'
  | 'RESOLVED'
  | 'CLOSED'
  | 'WITHDRAWN'
  | 'UNRESOLVED'
  | 'ESCALATED';

export type DisputePartyRole =
  | 'REPORTER'
  | 'RESPONDENT'
  | 'AFFECTED_PARTY'
  | 'MEDIATOR'
  | 'INSPECTOR'
  | 'COMMITTEE_OBSERVER';

export type DisputeParty = {
  readonly partyId: string;
  readonly role: DisputePartyRole;
  readonly userId: string | Absent;
  readonly unitId: string | Absent;
  readonly towerId: string | Absent;
  readonly displayLabel: string;
  readonly invitedAt: string;
  readonly respondedAt: string | Absent;
  readonly accessRevokedAt: string | Absent;
};

export type DisputePropertyTag = {
  readonly unitId: string;
  readonly towerId: string;
  readonly label: string;
  readonly role: 'AFFECTED' | 'SOURCE_SUSPECTED' | 'INSPECTED' | 'OBSERVING';
};

export type DisputeClaim = {
  readonly claimId: string;
  readonly raisedByUserId: string;
  readonly raisedAt: string;
  readonly statement: string;
  readonly claimedCategory: DisputeCategory;
  readonly relatedEvidenceIds: readonly string[];
  readonly relatedInspectionIds: readonly string[];
};

export type DisputeResponsePosition =
  | 'ACKNOWLEDGE_AND_COOPERATE'
  | 'NEED_MORE_DETAILS'
  | 'DISAGREE'
  | 'ALREADY_RESOLVED'
  | 'NOT_RELATED_TO_MY_UNIT'
  | 'REQUEST_MEDIATION';

export type DisputeResponse = {
  readonly responseId: string;
  readonly caseId: string;
  readonly respondedByUserId: string;
  readonly respondedByPartyId: string;
  readonly position: DisputeResponsePosition;
  readonly statement: string;
  readonly cooperatesWithInspection: boolean;
  readonly proposedOutcome: string | Absent;
  readonly evidenceIds: readonly string[];
  readonly submittedAt: string;
};

export type DisputeSlaClock = {
  readonly responseDueAt: string | Absent;
  readonly inspectionDueAt: string | Absent;
  readonly mediationReviewDueAt: string | Absent;
  readonly lastBreachCode: string | Absent;
  readonly lastBreachAt: string | Absent;
};

export type DisputeCase = {
  readonly id: string;
  readonly caseNumber: string;
  readonly societyId: string;
  readonly title: string;
  readonly category: DisputeCategory;
  readonly severity: DisputeSeverity;
  readonly status: DisputeCaseStatus;
  readonly description: string;
  readonly locationLabel: string;
  readonly reporterUserId: string;
  readonly reporterUnitId: string;
  readonly parties: readonly DisputeParty[];
  readonly propertyTags: readonly DisputePropertyTag[];
  readonly claims: readonly DisputeClaim[];
  readonly responses: readonly DisputeResponse[];
  readonly evidenceIds: readonly string[];
  readonly inspectionIds: readonly string[];
  readonly mediationId: string | Absent;
  readonly proposalId: string | Absent;
  readonly escalationId: string | Absent;
  readonly financeLinkId: string | Absent;
  readonly moveOutLinkId: string | Absent;
  readonly communicationThreadId: string | Absent;
  readonly retentionHold: boolean;
  readonly retentionReviewAt: string | Absent;
  readonly sla: DisputeSlaClock;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly resolvedAt: string | Absent;
  readonly closedAt: string | Absent;
  readonly closureOutcome: ClosureOutcomeReason | Absent;
  readonly closure: DisputeClosureRecord | Absent;
  readonly revision: DisputeRevision;
  readonly trace: DisputeTraceContext;
};

export type DisputeClosureRecord = {
  readonly outcome: ClosureOutcomeReason;
  readonly summary: string;
  readonly closedByUserId: string;
  readonly closedAt: string;
  readonly proposalId: string | Absent;
  readonly closureProofIds: readonly string[];
  readonly financeLinkIds: readonly string[];
  readonly moveOutLinkIds: readonly string[];
  readonly slaBreachesAtClosure: string;
};

export type ClosureOutcomeReason =
  | 'RESOLVED_AGREED'
  | 'RESOLVED_MEDIATED'
  | 'RESOLVED_AFTER_INSPECTION'
  | 'REJECTED_BY_PARTY'
  | 'WITHDRAWN_BY_REPORTER'
  | 'UNRESOLVED_NO_RESPONSE'
  | 'UNRESOLVED_ESCALATED'
  | 'UNRESOLVED_NO_RESPONSE_FROM_RESPONDENT';

export const TERMINAL_CASE_STATUSES: readonly DisputeCaseStatus[] = [
  'CLOSED',
  'WITHDRAWN',
  'UNRESOLVED',
];

export function isCaseTerminal(status: DisputeCaseStatus): boolean {
  return TERMINAL_CASE_STATUSES.includes(status);
}

export function findPartyByUserId(
  disputeCase: DisputeCase,
  userId: string,
): DisputeParty | Absent {
  return disputeCase.parties.find(
    (party) => party.userId === userId && party.accessRevokedAt === undefined,
  );
}

export function isPartyOf(
  disputeCase: DisputeCase,
  userId: string,
): boolean {
  return findPartyByUserId(disputeCase, userId) !== undefined;
}

export function partiesWithRole(
  disputeCase: DisputeCase,
  role: DisputePartyRole,
): readonly DisputeParty[] {
  return disputeCase.parties.filter((party) => party.role === role && party.accessRevokedAt === undefined);
}

export function countOpenClaims(disputeCase: DisputeCase): number {
  return disputeCase.claims.length;
}
