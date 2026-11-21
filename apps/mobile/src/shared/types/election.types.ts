

export type ElectionStatus =
  | 'NOMINATION_OPEN'
  | 'NOMINATION_CLOSED'
  | 'VOTING_OPEN'
  | 'COMPLETED'
  | 'CANCELLED';

export type NominationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export type ElectionPositionType =
  | 'CHAIRPERSON'
  | 'SECRETARY'
  | 'TREASURER'
  | 'COMMITTEE_MEMBER'
  | 'ELECTION_OFFICER_PLACEHOLDER'
  | 'OTHER';

export type CommitteePosition = ElectionPositionType;



export interface Election {
  id: string;
  societyId: string;
  title: string;
  description: string;
  status: ElectionStatus;
  positions: ElectionPosition[];
  nominationStartDate: string;
  nominationEndDate: string;
  votingStartDate?: string;
  votingEndDate?: string;
  resultsPublishedAt?: string;
  totalEligibleVoters: number;
  totalVotes: number;
  conductedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ElectionPosition {
  id: string;
  electionId: string;
  title: string;
  positionType: ElectionPositionType;
  vacancies: number;
  candidates: ElectionCandidate[];
  winnerId?: string;
}

export interface ElectionCandidate {
  id: string;
  positionId: string;
  residentId: string;
  name: string;
  unit: string;
  nominationStatus: NominationStatus;
  proposedBy: string;
  secondedBy?: string;
  manifesto?: string;
  voteCount: number;
  isElected: boolean;
}

export interface ElectionResult {
  electionId: string;
  positionId: string;
  positionTitle: string;
  candidates: {
    candidateId: string;
    name: string;
    unit: string;
    voteCount: number;
    percentage: number;
    isElected: boolean;
  }[];
  totalVotes: number;
  totalEligibleVoters: number;
  participationRate: number;
}
