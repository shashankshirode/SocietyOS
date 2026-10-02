import type { Absent } from '../../../../../shared/types/absence.types';

export type MediationStatus =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'IN_DISCUSSION'
  | 'RESOLUTION_PROPOSED'
  | 'AGREED'
  | 'REJECTED'
  | 'ESCALATED'
  | 'CLOSED';

export type MediatorNoteVisibility =
  | 'MEDIATOR_ONLY'
  | 'COMMITTEE_AND_MEDIATOR'
  | 'ALL_PARTIES';

export type MediatorNote = {
  readonly id: string;
  readonly mediationId: string;
  readonly caseId: string;
  readonly authorUserId: string;
  readonly authorRoleLabel: string;
  readonly note: string;
  readonly visibility: MediatorNoteVisibility;
  readonly createdAt: string;
};

export type ResolutionAcceptanceScope = 'REPORTER_ONLY' | 'RESPONDENT_ONLY' | 'BOTH_PARTIES' | 'COMMITTEE_ONLY';

export type ProposalDecision = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type PartyDecision = {
  readonly partyId: string;
  readonly decidedByUserId: string;
  readonly decision: Exclude<ProposalDecision, 'PENDING'>;
  readonly feedback: string | Absent;
  readonly decidedAt: string;
};

export type ResolutionProposal = {
  readonly id: string;
  readonly proposalNumber: string;
  readonly mediationId: string;
  readonly caseId: string;
  readonly societyId: string;
  readonly description: string;
  readonly responsiblePartyLabel: string;
  readonly targetDate: string;
  readonly acceptanceScope: ResolutionAcceptanceScope;
  readonly requiredPartyIds: readonly string[];
  readonly decisions: readonly PartyDecision[];
  readonly status: ProposalDecision;
  readonly committeeApprovedByUserId: string | Absent;
  readonly createdByUserId: string;
  readonly createdAt: string;
  readonly decidedAt: string | Absent;
};

export type ClosureProof = {
  readonly id: string;
  readonly caseId: string;
  readonly proposalId: string;
  readonly societyId: string;
  readonly submittedByUserId: string;
  readonly statement: string;
  readonly evidenceIds: readonly string[];
  readonly submittedAt: string;
  readonly verifiedByUserId: string | Absent;
  readonly verifiedAt: string | Absent;
};

export function isProposalFullyDecided(
  proposal: ResolutionProposal,
): boolean {
  const required = new Set(proposal.requiredPartyIds);
  return proposal.decisions.every((decision) => required.has(decision.partyId));
}

export function decisionsFor(
  proposal: ResolutionProposal,
  partyId: string,
): PartyDecision | Absent {
  return proposal.decisions.find((decision) => decision.partyId === partyId);
}

export function requiredPartiesFor(
  scope: ResolutionAcceptanceScope,
  partyIds: { readonly reporter: string; readonly respondent: string | Absent; readonly committee: string | Absent },
): readonly string[] {
  if (scope === 'REPORTER_ONLY') {
    return [partyIds.reporter];
  }
  if (scope === 'RESPONDENT_ONLY') {
    return partyIds.respondent === undefined ? [] : [partyIds.respondent];
  }
  if (scope === 'COMMITTEE_ONLY') {
    return partyIds.committee === undefined ? [] : [partyIds.committee];
  }
  const both = [partyIds.reporter];
  if (partyIds.respondent !== undefined) {
    both.push(partyIds.respondent);
  }
  return both;
}
