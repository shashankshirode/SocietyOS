

export type PollStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'OPEN'
  | 'ACTIVE'
  | 'CLOSED'
  | 'RESULT_PUBLISHED'
  | 'RESULTS_PUBLISHED'
  | 'CANCELLED';

export type PollType =
  | 'OPINION_POLL'
  | 'RESOLUTION_VOTE'
  | 'FACILITY_PREFERENCE'
  | 'BUDGET_PREFERENCE'
  | 'EVENT_POLL'
  | 'RULE_FEEDBACK'
  | 'MAINTENANCE_PRIORITY'
  | 'OTHER';

export type PollQuestionType = 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'YES_NO' | 'RATING';

export type PollVoterEligibility = 'ALL_MEMBERS' | 'OWNERS_ONLY' | 'COMMITTEE_ONLY' | 'CUSTOM';

export type VoteStatus = 'NOT_VOTED' | 'VOTED' | 'ABSTAINED' | 'PROXY_DELEGATED' | 'INELIGIBLE';



export interface Poll {
  id: string;
  societyId: string;
  title: string;
  description: string;
  pollType: PollType;
  questionType: PollQuestionType;
  status: PollStatus;
  eligibility: PollVoterEligibility;
  createdBy: string;
  createdByRole: string;
  options: PollOption[];
  totalVotes: number;
  totalEligibleVoters: number;
  participationRate: number;
  myVoteStatus: VoteStatus;
  myVotedOptionIds?: string[];
  allowAnonymous: boolean;
  showResultsBeforeClose: boolean;
  startsAt: string;
  expiresAt: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PollOption {
  id: string;
  pollId: string;
  label: string;
  description?: string;
  order: number;
  voteCount: number;
  percentage: number;
}

export interface PollVote {
  id: string;
  pollId: string;
  voterId: string;
  voterName: string;
  voterUnit: string;
  selectedOptionIds: string[];
  ratingValue?: number;
  votedAt: string;
}

export interface PollResults {
  pollId: string;
  title: string;
  pollType: PollType;
  questionType: PollQuestionType;
  status: PollStatus;
  totalVotes: number;
  totalEligibleVoters: number;
  participationRate: number;
  options: PollResultOption[];
  winnerOptionId?: string;
  closedAt?: string;
}

export interface PollResultOption {
  id: string;
  label: string;
  voteCount: number;
  percentage: number;
  isWinner: boolean;
}

export interface CreatePollInput {
  title: string;
  description: string;
  pollType: PollType;
  questionType: PollQuestionType;
  eligibility: PollVoterEligibility;
  options: { label: string; description?: string }[];
  allowAnonymous: boolean;
  showResultsBeforeClose: boolean;
  durationDays: number;
}

export interface SubmitPollVoteInput {
  pollId: string;
  selectedOptionIds: string[];
  ratingValue?: number;
}
