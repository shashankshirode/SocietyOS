export type RuleCategory =
  | 'GENERAL'
  | 'RENOVATION'
  | 'NOISE'
  | 'PET'
  | 'PARKING'
  | 'WASTE'
  | 'FACILITY'
  | 'VISITOR'
  | 'TENANT'
  | 'MOVE_IN_MOVE_OUT'
  | 'SAFETY'
  | 'FIRE_LIFT'
  | 'PENALTY_POLICY';

export type RuleStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'SUPERSEDED'
  | 'UNDER_REVIEW'
  | 'ARCHIVED';

export type RuleAcknowledgementStatus =
  | 'ACKNOWLEDGED'
  | 'PENDING'
  | 'EXPIRED_VERSION'
  | 'NOT_APPLICABLE';

export type RuleViolationStatus =
  | 'DRAFT'
  | 'RECORDED'
  | 'NOTICE_SENT'
  | 'RESPONSE_PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'PENALTY_READY'
  | 'CLOSED';

export type PenaltyReadinessStatus =
  | 'NOT_APPLICABLE'
  | 'EVIDENCE_REQUIRED'
  | 'NOTICE_REQUIRED'
  | 'APPROVAL_REQUIRED'
  | 'APPEAL_WINDOW_OPEN'
  | 'READY_FOR_BILLING'
  | 'BLOCKED';

export interface RuleVersion {
  version: string;
  publishDate: string;
  summaryOfChanges: string;
}

export interface SocietyRule {
  id: string;
  ruleNumber: string;
  title: string;
  category: RuleCategory;
  version: string;
  status: RuleStatus;
  effectiveDate: string;
  appliesToRoles: string[];
  summary: string;
  detailedText: string;
  examples: string[];
  penaltyPlaceholderDescription?: string;
  acknowledgementRequired: boolean;
  versionHistory: RuleVersion[];
}

export interface RuleAcknowledgement {
  id: string;
  ruleId: string;
  ruleTitle: string;
  ruleVersion: string;
  userName: string;
  unitId: string;
  flatNumber: string;
  acknowledgedAt: string;
  referenceNumber: string;
  status: RuleAcknowledgementStatus;
}

export interface RuleAcknowledgementReport {
  ruleId: string;
  ruleTitle: string;
  ruleVersion: string;
  totalRequired: number;
  acknowledgedCount: number;
  pendingCount: number;
  completionPercentage: number;
  acknowledgements: {
    userName: string;
    flatNumber: string;
    status: RuleAcknowledgementStatus;
    acknowledgedAt?: string;
  }[];
}

export interface RuleViolation {
  id: string;
  violationNumber: string;
  ruleId: string;
  ruleTitle: string;
  flatNumber: string;
  violatedBy: string;
  dateOfViolation: string;
  description: string;
  status: RuleViolationStatus;
  evidencePlaceholderCount: number;
  penaltyAmount?: number;
  notes?: string;
}

export interface PenaltyReadiness {
  id: string;
  violationId: string;
  violationNumber: string;
  flatNumber: string;
  ruleTitle: string;
  status: PenaltyReadinessStatus;
  proposedAmount: number;
  approvedByAdmin?: string;
  appealSubmitted: boolean;
  appealNotes?: string;
  escalatedToCommittee: boolean;
}
export type { SocietyRule as Rule };
