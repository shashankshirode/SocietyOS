export type ReportCategory =
  | 'HARASSMENT'
  | 'SPAM'
  | 'ABUSIVE_LANGUAGE'
  | 'THREAT'
  | 'IRRELEVANT_CONTACT'
  | 'PRIVACY_VIOLATION'
  | 'FRAUD_SUSPICIOUS'
  | 'OTHER';

export type ModerationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ACTION_TAKEN'
  | 'DISMISSED';

export interface ResidentPrivacySettings {
  showFlatNumber: boolean;
  showDisplayName: boolean;
  allowFirstContact: boolean;
  sameTowerOnly: boolean;
  allowCommitteeContact: boolean;
}

export interface BlockedResidentInfo {
  id: string; 
  blockedResidentId: string;
  blockedResidentName: string;
  blockedFlat: string;
  blockedDate: string;
  reason?: string;
}

export interface ModerationReport {
  id: string;
  targetType: 'MESSAGE' | 'RESIDENT' | 'CONTACT_REQUEST';
  targetId: string;
  reportedBy: string;
  reportedFlat: string;
  category: ReportCategory;
  description: string;
  status: ModerationStatus;
  createdAt: string;
  messageContext?: string;
}
