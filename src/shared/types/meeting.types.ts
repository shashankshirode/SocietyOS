export type MeetingType =
  | 'AGM'
  | 'SGM'
  | 'COMMITTEE_MEETING'
  | 'EMERGENCY_MEETING'
  | 'RESIDENT_MEETING'
  | 'BUDGET_MEETING'
  | 'FACILITY_REVIEW'
  | 'LEGAL_COMPLIANCE'
  | 'ELECTION_MEETING';

export type MeetingStatus =
  | 'DRAFT'
  | 'NOTICE_PUBLISHED'
  | 'RSVP_OPEN'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'MINUTES_PENDING'
  | 'MINUTES_APPROVED'
  | 'ARCHIVED';

export type AttendanceChoice =
  | 'ATTENDING'
  | 'NOT_ATTENDING'
  | 'MAYBE'
  | 'PROXY_ASSIGNED'
  | 'PENDING';

export type AttendanceMode =
  | 'IN_PERSON'
  | 'ONLINE'
  | 'PROXY'
  | 'NOT_APPLICABLE';

export type AgendaStatus =
  | 'UPCOMING'
  | 'DISCUSSED'
  | 'DEFERRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'NEEDS_FOLLOW_UP';

export type MinutesStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export interface MeetingNotice {
  meetingId: string;
  noticeTitle: string;
  publishedDate: string;
  publishedBy: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  eligibleAudience: string;
  rsvpDeadline: string;
  questionDeadline: string;
  proxyRuleNote: string;
  isOwnerOnly: boolean;
  financialReportUrl?: string;
}

export interface AgendaItem {
  id: string;
  meetingId: string;
  order: number;
  title: string;
  description: string;
  presenter: string;
  durationMinutes: number;
  status: AgendaStatus;
  linkedResolutionId?: string;
  isOwnerOnly: boolean;
  documentUrl?: string;
}

export interface MeetingMinutes {
  id: string;
  meetingId: string;
  meetingTitle: string;
  meetingDate: string;
  preparedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  status: MinutesStatus;
  summary?: string;
  keyDecisions?: string[];
  attendanceSummary?: {
    totalMembers: number;
    present: number;
    absent: number;
    proxy: number;
    quorumMet: boolean;
  };
  totalUnits: number;
  presentCount: number;
  absentCount: number;
  proxyCount: number;
  quorumPercent: number;
  isQuorumMet: boolean;
  discussionSummary: string;
  decisions: string[];
  actionItems: {
    id: string;
    description: string;
    assignee: string;
    dueDate: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  }[];
  linkedResolutionIds: string[];
  acknowledged: boolean;
  acknowledgedAt?: string;
  documentUrl?: string;
  versions: {
    version: number;
    updatedAt: string;
    updatedBy: string;
    changeSummary: string;
  }[];
}

export interface ProxyDelegation {
  id: string;
  meetingId: string;
  meetingTitle: string;
  ownerName: string;
  unit: string;
  proxyName: string;
  relation: string;
  proxyMobile: string;
  scope: 'ATTEND_ONLY' | 'SPEAK_ON_BEHALF' | 'VOTE_ON_RESOLUTIONS' | 'FULL_MEETING_PROXY';
  isCancelled: boolean;
  consentGiven: boolean;
  createdAt: string;
}

export interface MeetingQuestion {
  id: string;
  meetingId: string;
  agendaItemId?: string;
  residentId: string;
  residentName: string;
  unit: string;
  title: string;
  details: string;
  category: 'FINANCIAL' | 'MAINTENANCE' | 'GOVERNANCE' | 'COMPLIANCE' | 'FACILITY' | 'SECURITY' | 'OTHER';
  visibility: 'VISIBLE_TO_COMMITTEE' | 'ANONYMOUS_TO_RESIDENTS' | 'PUBLIC_IN_MEETING' | 'PRIVATE_RESPONSE_REQUESTED';
  referenceNumber: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  meetingId: string;
  memberId: string;
  memberName: string;
  unit: string;
  role: string;
  choice: AttendanceChoice;
  mode: AttendanceMode;
  notes?: string;
  checkedInAt?: string;
  memberUnit?: string;
  memberRole?: string;
  status?: AttendanceChoice;
  rsvpStatus?: AttendanceChoice;
}

export interface Meeting {
  id: string;
  societyId: string;
  title: string;
  description: string;
  meetingType: MeetingType;
  status: MeetingStatus;
  scheduledDate: string;
  scheduledTime: string;
  startTime?: string;
  endTime?: string;
  venue: string;
  organizer: string;
  organizerRole: string;
  onlineJoinUrl?: string;
  quorumRequired: number;
  quorumStatus?: string;
  confirmedCount: number;
  declinedCount?: number;
  proxyCount: number;
  presentCount: number;
  totalMembers: number;
  myRsvpStatus?: AttendanceChoice;
  myRsvpMode?: AttendanceMode;
  isOwnerOnly?: boolean;
  notes?: string;
  agendaItemsCount?: number;
  agendaItemCount?: number;
  resolutionCount?: number;
  hasMinutes?: boolean;
  noticeDate?: string;
  createdAt: string;
  updatedAt: string;
}
