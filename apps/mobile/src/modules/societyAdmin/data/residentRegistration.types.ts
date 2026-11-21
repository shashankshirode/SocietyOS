export type ResidentRegistrationStatus =
  | 'INVITED'
  | 'REGISTERED'
  | 'IDENTITY_VERIFIED'
  | 'DOCUMENTS_SUBMITTED'
  | 'ADMIN_REVIEW'
  | 'APPROVED'
  | 'RESUBMIT'
  | 'REJECTED'
  | 'ACTIVE';

export type ResidentRelationshipType =
  | 'OWNER'
  | 'CO_OWNER'
  | 'TENANT'
  | 'FAMILY_MEMBER';

export type FamilyRelationshipSubType =
  | 'SPOUSE'
  | 'CHILD'
  | 'PARENT'
  | 'DEPENDENT'
  | 'OTHER';

export type VerificationChannel = 'MOBILE' | 'EMAIL';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'FAILED' | 'EXPIRED';

export interface ResidentRegistration {
  id: string;
  societyId: string;
  unitId: string;
  unitNumber: string;
  towerName?: string | undefined;
  wingName?: string | undefined;
  floorNumber?: number | undefined;
  relationshipType: ResidentRelationshipType;
  familyRelationshipSubType?: FamilyRelationshipSubType | undefined;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  status: ResidentRegistrationStatus;
  verificationStatus: VerificationStatus;
  verificationChannel?: VerificationChannel | undefined;
  verificationCompletedAt?: string | undefined;
  invitedAt: string;
  registeredAt?: string | undefined;
  documentsSubmittedAt?: string | undefined;
  submittedForReviewAt?: string | undefined;
  reviewedAt?: string | undefined;
  approvedAt?: string | undefined;
  rejectedAt?: string | undefined;
  rejectionReason?: string | undefined;
  activatedAt?: string | undefined;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  dataVersion?: number | undefined;
}

export interface CreateResidentRegistrationRequest {
  societyId: string;
  unitId: string;
  relationshipType: ResidentRelationshipType;
  familyRelationshipSubType?: FamilyRelationshipSubType;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  createdBy: string;
}

export interface UpdateResidentRegistrationRequest extends Partial<CreateResidentRegistrationRequest> {
  id: string;
}

export interface ResidentRegistrationFilters {
  societyId: string;
  status?: ResidentRegistrationStatus;
  unitId?: string;
  search?: string;
  relationshipType?: ResidentRelationshipType;
}

export interface ResidentInvitation {
  id: string;
  registrationId: string;
  societyId: string;
  societyName: string;
  unitId: string;
  unitNumber: string;
  relationshipType: ResidentRelationshipType;
  familyRelationshipSubType?: FamilyRelationshipSubType | undefined;
  recipientMobile: string;
  recipientEmail: string;
  token: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED' | 'USED';
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string | undefined;
}

export interface CreateResidentInvitationRequest {
  registrationId: string;
  societyId: string;
  societyName: string;
  unitId: string;
  unitNumber: string;
  relationshipType: ResidentRelationshipType;
  familyRelationshipSubType?: FamilyRelationshipSubType;
  recipientMobile: string;
  recipientEmail: string;
}

export interface VerificationCodeRequest {
  contact: string;
  channel: VerificationChannel;
  purpose: 'RESIDENT_REGISTRATION' | 'ADMIN_INVITATION' | 'LOGIN';
}

export interface VerificationCodeResult {
  success: boolean;
  codeId?: string;
  expiresAt?: string;
  error?: string;
}

export interface VerifyCodeRequest {
  codeId: string;
  code: string;
}

export interface VerifyCodeResult {
  success: boolean;
  verified: boolean;
  error?: string;
}

export interface DocumentRequirement {
  type: string;
  label: string;
  description?: string;
  mandatory: boolean;
  acceptedTypes: string[];
  maxSizeMB: number;
}

export interface ResidentDocument {
  id: string;
  registrationId: string;
  type: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: 'UPLOADED' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  uploadedAt: string;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  url?: string;
}

export interface SubmitDocumentsRequest {
  registrationId: string;
  documents: { type: string; fileName: string; fileSize: number; mimeType: string; url: string }[];
}

export interface ResidentRegistrationDetail extends ResidentRegistration {
  invitation?: ResidentInvitation | undefined;
  documents: ResidentDocument[];
  requiredDocuments: DocumentRequirement[];
  unit: {
    id: string;
    unitNumber: string;
    towerName?: string | undefined;
    wingName?: string | undefined;
    floorNumber?: number | undefined;
  };
}

export interface DuplicateDetectionResult {
  hasDuplicate: boolean;
  duplicateField?: 'mobile' | 'email';
  existingRegistrationId?: string;
  existingRegistrationName?: string;
  message: string;
}

export const REGISTRATION_STATUS_LABELS: Record<ResidentRegistrationStatus, string> = {
  INVITED: 'Invited',
  REGISTERED: 'Registered',
  IDENTITY_VERIFIED: 'Identity Verified',
  DOCUMENTS_SUBMITTED: 'Documents Submitted',
  ADMIN_REVIEW: 'Admin Review',
  APPROVED: 'Approved',
  RESUBMIT: 'Resubmit',
  REJECTED: 'Rejected',
  ACTIVE: 'Active',
};

export const REGISTRATION_STATUS_TRANSITIONS: Record<ResidentRegistrationStatus, ResidentRegistrationStatus[]> = {
  INVITED: ['REGISTERED'],
  REGISTERED: ['IDENTITY_VERIFIED'],
  IDENTITY_VERIFIED: ['DOCUMENTS_SUBMITTED'],
  DOCUMENTS_SUBMITTED: ['ADMIN_REVIEW'],
  ADMIN_REVIEW: ['APPROVED', 'RESUBMIT', 'REJECTED'],
  APPROVED: ['ACTIVE'],
  RESUBMIT: ['DOCUMENTS_SUBMITTED'],
  REJECTED: ['DOCUMENTS_SUBMITTED'],
  ACTIVE: [],
};

export const RELATIONSHIP_TYPE_LABELS: Record<ResidentRelationshipType, string> = {
  OWNER: 'Owner',
  CO_OWNER: 'Co-Owner',
  TENANT: 'Tenant',
  FAMILY_MEMBER: 'Family Member',
};

export const FAMILY_RELATIONSHIP_SUBTYPE_LABELS: Record<FamilyRelationshipSubType, string> = {
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  PARENT: 'Parent',
  DEPENDENT: 'Dependent',
  OTHER: 'Other',
};

export function canTransition(from: ResidentRegistrationStatus, to: ResidentRegistrationStatus): boolean {
  return REGISTRATION_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}