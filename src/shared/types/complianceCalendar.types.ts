export type ComplianceCalendarStatus =
  | 'UPCOMING'
  | 'DUE_SOON'
  | 'OVERDUE'
  | 'COMPLETED'
  | 'WAIVED'
  | 'NOT_APPLICABLE';

export type LegalNoticeStatus =
  | 'RECEIVED'
  | 'UNDER_REVIEW'
  | 'RESPONSE_DRAFTED'
  | 'RESPONSE_SENT'
  | 'CLOSED'
  | 'ESCALATED';

export type GovernanceDocumentStatus =
  | 'ACTIVE'
  | 'DRAFT'
  | 'SUPERSEDED'
  | 'UNDER_REVIEW'
  | 'ARCHIVED';

export type VotingEligibilityStatus =
  | 'ELIGIBLE'
  | 'NOT_ELIGIBLE'
  | 'PROXY_ASSIGNED'
  | 'PENDING_VERIFICATION'
  | 'RESTRICTED';

export type ElectionReadinessStatus =
  | 'NOT_CONFIGURED'
  | 'CONFIGURATION_REQUIRED'
  | 'READY_FOR_MOCK'
  | 'READY_FOR_PRODUCTION_REVIEW'
  | 'DISABLED';

export interface ComplianceItem {
  id: string;
  title: string;
  category: 'AUDIT' | 'FIRE_SAFETY' | 'ELEVATOR' | 'TAX_FILING' | 'INSURANCE' | 'ELECTION' | 'BYLAWS_ACK' | 'LEGAL' | 'VENDOR' | 'OTHER';
  dueDate: string;
  responsibleRole: string;
  status: ComplianceCalendarStatus;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  completedDate?: string;
  completedBy?: string;
  linkedDocumentUrl?: string;
}

export interface LegalNotice {
  id: string;
  noticeNumber: string;
  title: string;
  source: string;
  receivedDate: string;
  responseDueDate: string;
  responsiblePerson: string;
  status: LegalNoticeStatus;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  summary?: string;
  documentUrl?: string;
  timeline: {
    stage: string;
    date: string;
    actor: string;
    details?: string;
  }[];
}

export interface BylawDocument {
  id: string;
  title: string;
  category: 'BYLAWS' | 'AGM_RULES' | 'ELECTION_RULES' | 'PROXY_RULES' | 'PARKING_RULES' | 'FACILITY_RULES' | 'HOUSE_RULES';
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  acknowledgementRequired: boolean;
  acknowledged: boolean;
  acknowledgedAt?: string;
  status: GovernanceDocumentStatus;
  summary: string;
  documentUrl?: string;
}

export interface MemberRecord {
  id: string;
  unit: string;
  name: string;
  type: 'OWNER' | 'TENANT';
  verificationStatus: 'VERIFIED' | 'PENDING' | 'FAILED';
  votingEligibility: VotingEligibilityStatus;
  ineligibilityReason?: string;
  maskedEmail: string;
  maskedPhone: string;
}

export interface AuditLogEntry {
  id: string;
  eventType: string;
  actorName: string;
  actorRole: string;
  timestamp: string;
  entityType: string;
  entityReference: string;
  devicePlaceholder: string;
  auditNote: string;
}
