



export type DomesticHelpType =
  | 'MAID'
  | 'COOK'
  | 'DRIVER'
  | 'NANNY'
  | 'CARETAKER'
  | 'ELDER_CARE'
  | 'PET_CARE'
  | 'TUTOR'
  | 'CLEANER'
  | 'OTHER';

export type DomesticHelpAccessStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'BLOCKED'
  | 'EXPIRED'
  | 'PENDING_APPROVAL';

export type DomesticHelpVerificationStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export type DomesticHelpPoliceVerificationStatus =
  | 'NOT_SUBMITTED'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';



export interface DomesticHelp {
  id: string;
  name: string;
  helpType: DomesticHelpType;

  
  linkedFlatIds: string[];
  linkedFlatNumbers: string[];
  linkedFlatCount: number;

  
  accessStatus: DomesticHelpAccessStatus;
  allowedEntryDays: string[];    
  allowedEntryTimeFrom?: string; 
  allowedEntryTimeTo?: string;   

  
  verificationStatus: DomesticHelpVerificationStatus;
  policeVerificationStatus: DomesticHelpPoliceVerificationStatus;
  idDocumentStatus: 'NOT_COLLECTED' | 'COLLECTED' | 'VERIFIED' | 'REJECTED';

  
  mobileMasked: string;
  emergencyContactMasked?: string;
  addressSummary?: string;  

  
  lastGateEntryDate?: string;
  lastGateEntryTime?: string;
  entryFrequencyLast30Days?: number;

  
  approvedByResidents: string[]; 
  incidentCount: number;

  
  societyApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';

  photoPlaceholder?: string;
  notes?: string;
  registeredAt: string;
  updatedAt: string;
}

export interface DomesticHelpVerificationChecklist {
  domesticHelpId: string;
  items: DomesticHelpVerificationItem[];
  overallStatus: DomesticHelpVerificationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface DomesticHelpVerificationItem {
  key: string;
  label: string;
  description: string;
  status: 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  notes?: string;
  completedAt?: string;
  isMandatory: boolean;
}



export interface VerifyDomesticHelpInput {
  checklistItemKey: string;
  status: 'VERIFIED' | 'REJECTED';
  notes?: string;
}

export interface ApproveDomesticHelpInput {
  approvalNote?: string;
  confirmationChecked: boolean;
}

export interface BlockDomesticHelpInput {
  reason: string;
  confirmationChecked: boolean;
}
