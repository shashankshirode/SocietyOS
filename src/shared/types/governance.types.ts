

export type MeetingType = 'AGM' | 'EGM' | 'COMMITTEE' | 'BOARD';

export type MeetingStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'POSTPONED'
  | 'ADJOURNED';

export type AgendaItemType = 'DISCUSSION' | 'VOTING' | 'INFORMATIONAL' | 'ACTION_ITEM';

export type AgendaItemStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DEFERRED' | 'SKIPPED';

export type ResolutionType = 'ORDINARY' | 'SPECIAL';

export type ResolutionStatus =
  | 'DRAFT'
  | 'TABLED'
  | 'OPEN_FOR_VOTING'
  | 'PASSED'
  | 'REJECTED'
  | 'DEFERRED'
  | 'WITHDRAWN';

export type ResolutionVoteChoice = 'FOR' | 'AGAINST' | 'ABSTAIN';

export type QuorumStatus = 'NOT_CHECKED' | 'MET' | 'NOT_MET' | 'PENDING';

export type RsvpStatus = 'ATTENDING' | 'NOT_ATTENDING' | 'PROXY' | 'PENDING';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'PROXY' | 'LATE';



export interface Meeting {
  id: string;
  societyId: string;
  title: string;
  description: string;
  meetingType: MeetingType;
  status: MeetingStatus;
  scheduledDate: string;
  scheduledTime: string;
  endTime?: string;
  venue: string;
  organizer: string;
  organizerRole: string;
  quorumRequired: number;
  quorumStatus: QuorumStatus;
  totalMembers: number;
  confirmedCount: number;
  presentCount: number;
  proxyCount: number;
  agendaItemCount: number;
  resolutionCount: number;
  hasMinutes: boolean;
  noticeDate?: string;
  postponedFrom?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgendaItem {
  id: string;
  meetingId: string;
  order: number;
  title: string;
  description: string;
  type: AgendaItemType;
  status: AgendaItemStatus;
  timeAllocationMinutes: number;
  presenterName?: string;
  linkedResolutionId?: string;
  notes?: string;
}

export interface Resolution {
  id: string;
  meetingId: string;
  meetingTitle: string;
  resolutionNumber: string;
  title: string;
  description: string;
  fullText: string;
  type: ResolutionType;
  status: ResolutionStatus;
  proposerName: string;
  proposerUnit: string;
  seconderName?: string;
  seconderUnit?: string;
  requiredMajority: string;
  totalEligibleVoters: number;
  votesFor: number;
  votesAgainst: number;
  votesAbstained: number;
  myVote?: ResolutionVoteChoice;
  votingOpenedAt?: string;
  votingClosedAt?: string;
  createdAt: string;
}

export interface ResolutionVote {
  id: string;
  resolutionId: string;
  voterId: string;
  voterName: string;
  voterUnit: string;
  choice: ResolutionVoteChoice;
  isProxy: boolean;
  proxyForName?: string;
  votedAt: string;
}

export interface MeetingAttendance {
  id: string;
  meetingId: string;
  memberId: string;
  memberName: string;
  memberUnit: string;
  memberRole: string;
  status: AttendanceStatus;
  rsvpStatus: RsvpStatus;
  proxyName?: string;
  checkInTime?: string;
}

export interface MeetingMinutes {
  id: string;
  meetingId: string;
  meetingTitle: string;
  meetingDate: string;
  summary: string;
  keyDecisions: string[];
  actionItems: MinutesActionItem[];
  attendanceSummary: {
    totalMembers: number;
    present: number;
    absent: number;
    proxy: number;
    quorumMet: boolean;
  };
  preparedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  documentUrl?: string;
  createdAt: string;
}

export interface MinutesActionItem {
  id: string;
  description: string;
  assignee: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
}

export interface QuorumInfo {
  required: number;
  present: number;
  proxy: number;
  total: number;
  percentage: number;
  isMet: boolean;
}

export interface GovernanceHome {
  upcomingMeetingsCount: number;
  activePollsCount: number;
  pendingResolutionsCount: number;
  activeElectionsCount: number;
  upcomingMeetings: Meeting[];
  activePolls: { id: string; title: string; status: string; expiresAt: string }[];
  recentResolutions: { id: string; title: string; status: ResolutionStatus }[];
}
