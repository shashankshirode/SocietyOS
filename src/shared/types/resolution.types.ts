export type ResolutionType =
  | 'FINANCIAL'
  | 'MAINTENANCE'
  | 'POLICY_CHANGE'
  | 'VENDOR_APPROVAL'
  | 'FACILITY_RULE'
  | 'PARKING_RULE'
  | 'RENOVATION_RULE'
  | 'COMMITTEE_DECISION'
  | 'LEGAL_COMPLIANCE'
  | 'OTHER';

export type ResolutionStatus =
  | 'DRAFT'
  | 'PROPOSED'
  | 'DISCUSSED'
  | 'VOTING_OPEN'
  | 'OPEN_FOR_VOTING'
  | 'PASSED'
  | 'FAILED'
  | 'REJECTED'
  | 'DEFERRED'
  | 'IMPLEMENTATION_PENDING'
  | 'IMPLEMENTED'
  | 'CLOSED';

export interface Resolution {
  id: string;
  resolutionNumber: string;
  title: string;
  type: ResolutionType;
  proposedBy: string;
  proposerUnit: string;
  meetingId: string;
  meetingTitle: string;
  description: string;
  rationale: string;
  financialImpact: string;
  isOwnerOnly: boolean;
  status: ResolutionStatus;
  votesFor: number;
  votesAgainst: number;
  votesAbstained: number;
  totalEligible: number;
  totalEligibleVoters?: number;
  myVoteChoice?: 'FOR' | 'AGAINST' | 'ABSTAIN';
  myVote?: 'FOR' | 'AGAINST' | 'ABSTAIN';
  proposerName?: string;
  seconderName?: string;
  seconderUnit?: string;
  requiredMajority?: string;
  fullText?: string;
  createdAt?: string;
  implementationOwner: string;
  dueDate: string;
  implementationStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  timeline: {
    event: string;
    date: string;
    actor: string;
    note?: string;
  }[];
  documentUrls: string[];
}
