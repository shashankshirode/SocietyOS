import type { Meeting, MeetingNotice, AgendaItem, MeetingMinutes, ProxyDelegation, MeetingQuestion, AttendanceRecord } from '../../../../shared/types/meeting.types';
import type { Resolution } from '../../../../shared/types/resolution.types';
import type { Poll, PollResults } from '../../../../shared/types/poll.types';
import type { Election, ElectionCandidate } from '../../../../shared/types/election.types';
import type { ComplianceItem, LegalNotice, BylawDocument, MemberRecord, AuditLogEntry } from '../../../../shared/types/complianceCalendar.types';


export type MeetingDto = Meeting;
export type MeetingNoticeDto = MeetingNotice;
export type AgendaItemDto = AgendaItem;
export type MeetingMinutesDto = MeetingMinutes;
export type ProxyDelegationDto = ProxyDelegation;
export type MeetingQuestionDto = MeetingQuestion;
export type AttendanceRecordDto = AttendanceRecord;

export type ResolutionDto = Resolution;

export type PollDto = Poll;
export type PollResultsDto = PollResults;

export type ElectionDto = Election;
export type ElectionCandidateDto = ElectionCandidate;

export type ComplianceItemDto = ComplianceItem;
export type LegalNoticeDto = LegalNotice;
export type BylawDocumentDto = BylawDocument;
export type MemberRecordDto = MemberRecord;
export type AuditLogEntryDto = AuditLogEntry;


export interface MeetingRsvpInput {
  meetingId: string;
  rsvpStatus: 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE' | 'PROXY_ASSIGNED';
  attendanceMode?: 'IN_PERSON' | 'ONLINE' | 'PROXY';
  proxyName?: string;
  notes?: string;
}

export interface SubmitQuestionInput {
  meetingId: string;
  agendaItemId?: string;
  title: string;
  details: string;
  category: 'FINANCIAL' | 'MAINTENANCE' | 'GOVERNANCE' | 'COMPLIANCE' | 'FACILITY' | 'SECURITY' | 'OTHER';
  visibility: 'VISIBLE_TO_COMMITTEE' | 'ANONYMOUS_TO_RESIDENTS' | 'PUBLIC_IN_MEETING' | 'PRIVATE_RESPONSE_REQUESTED';
}

export interface ProxyAuthorizationInput {
  meetingId: string;
  proxyName: string;
  relation: string;
  proxyMobile: string;
  scope: 'ATTEND_ONLY' | 'SPEAK_ON_BEHALF' | 'VOTE_ON_RESOLUTIONS' | 'FULL_MEETING_PROXY';
}

export interface SubmitNominationInput {
  electionId: string;
  candidateName: string;
  positionId: string;
  manifesto: string;
}

export interface CreatePollInput {
  title: string;
  description: string;
  pollType: 'OPINION_POLL' | 'RESOLUTION_VOTE' | 'FACILITY_PREFERENCE' | 'BUDGET_PREFERENCE' | 'EVENT_POLL' | 'RULE_FEEDBACK' | 'MAINTENANCE_PRIORITY' | 'OTHER';
  questionType: 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'YES_NO' | 'RATING';
  eligibility: 'ALL_MEMBERS' | 'OWNERS_ONLY' | 'COMMITTEE_ONLY' | 'CUSTOM';
  options: { label: string }[];
  allowAnonymous: boolean;
  showResultsBeforeClose: boolean;
  durationDays: number;
}

export interface CastResolutionVoteInput {
  resolutionId: string;
  choice: 'FOR' | 'AGAINST' | 'ABSTAIN';
}

export interface ElectionListParams {
  status?: string;
  query?: string;
}

export interface MeetingListParams {
  status?: string;
  type?: string;
  meetingType?: string;
  query?: string;
}

export interface PollListParams {
  status?: string;
  query?: string;
}

export interface ResolutionListParams {
  status?: string;
  type?: string;
  meetingId?: string;
  query?: string;
}
