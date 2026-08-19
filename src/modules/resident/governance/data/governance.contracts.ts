import type { ElectionCandidate, Election } from '../../../../shared/types/election.types';
import type { ElectionReadinessStatus } from '../../../../shared/types/complianceCalendar.types';
import type { Meeting } from '../../../../shared/types/meeting.types';
import type { Absent } from "../../../../shared/types/absence.types";
export type CreateGovernanceMeetingInput = Pick<Meeting, 'title' | 'description' | 'meetingType' | 'scheduledDate' | 'scheduledTime' | 'venue' | 'quorumRequired'>;
export type ResolutionVoteSummary = {
    id: string;
    voterName: string;
    voterUnit: string;
    choice: 'FOR' | 'AGAINST' | 'ABSTAIN';
};
export type VotingEligibility = {
    eligible: boolean;
    status: string;
    reason?: string;
    duesPending: boolean;
    ownershipVerified: boolean;
};
export type ElectionReadiness = {
    status: ElectionReadinessStatus;
    hasElectionOfficer: boolean;
    electionOfficerName?: string;
    nominationWindowStatus: 'NOT_STARTED' | 'OPEN' | 'CLOSED';
    candidateVerificationCompleted: boolean;
    totalCandidatesNominated: number;
    totalVotersVerified: number;
    warnings: string[];
};
export type ElectionListResult = Election[];
export type ElectionDetailResult = Election | Absent;
export type ElectionCandidateResult = ElectionCandidate | Absent;

