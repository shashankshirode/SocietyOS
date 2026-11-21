import type { Evidence } from './interFlat.types';

export type FacilityInspectionStatus =
  | 'REQUESTED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NEEDS_REVISIT'
  | 'CANCELLED';

export type MediationStatus =
  | 'NOT_STARTED'
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'IN_DISCUSSION'
  | 'RESOLUTION_PROPOSED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'ESCALATED'
  | 'CLOSED';

export type MediatorNoteVisibility =
  | 'MEDIATOR_ONLY'
  | 'FACILITY_AND_COMMITTEE'
  | 'SHARE_WITH_REPORTER'
  | 'SHARE_WITH_INVOLVED_PARTIES';

export type ResolutionAcceptanceScope =
  | 'REPORTER_ONLY'
  | 'INVOLVED_FLAT_ONLY'
  | 'BOTH_PARTIES'
  | 'COMMITTEE_ONLY';

export type ClosureStatus =
  | 'PENDING_REPORTER_CONFIRMATION'
  | 'PENDING_INVOLVED_CONFIRMATION'
  | 'PENDING_FACILITY_VERIFICATION'
  | 'CLOSED'
  | 'REOPENED';

export interface FacilityInspection {
  id: string;
  inspectionNumber: string;
  issueId: string;
  issueNumber: string;
  assignedToName: string;
  scheduledTime: string;
  status: FacilityInspectionStatus;
  findings?: string;
  rootCause?: string;
  recommendedAction?: string;
  evidence: Evidence[];
  completedAt?: string;
}

export interface MediatorNote {
  id: string;
  authorName: string;
  noteText: string;
  visibility: MediatorNoteVisibility;
  createdAt: string;
}

export interface ResolutionProposal {
  id: string;
  mediationId: string;
  proposedResolution: string;
  responsibleParty: string;
  targetDate: string;
  acceptanceScope: ResolutionAcceptanceScope;
  reporterAccepted?: boolean;
  reporterFeedback?: string;
  involvedFlatAccepted?: boolean;
  involvedFlatFeedback?: string;
  committeeApproved?: boolean;
  createdAt: string;
}

export interface MediationCase {
  id: string;
  caseNumber: string;
  issueId: string;
  issueNumber: string;
  reporterFlat: string;
  involvedFlat: string;
  mediatorName?: string;
  status: MediationStatus;
  notes: MediatorNote[];
  proposals: ResolutionProposal[];
  createdAt: string;
  updatedAt: string;
}

export interface SubmitSeniorCheckInInput {
  status: 'COMPLETED' | 'HELP_REQUESTED' | 'MISSED';
  notes?: string;
}
export type { FacilityInspection as Inspection, MediatorNote as Note, ResolutionProposal as Proposal };
