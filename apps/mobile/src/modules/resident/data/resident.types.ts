export type ResidentRegistrationStatus =
  | 'INVITED'
  | 'REGISTERED'
  | 'IDENTITY_VERIFIED'
  | 'DOCUMENTS_SUBMITTED'
  | 'ADMIN_REVIEW'
  | 'APPROVED'
  | 'RESUBMIT'
  | 'REJECTED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'ARCHIVED'
  | 'EXPIRED'
  | 'REVOKED';

export type ResidentRelationshipType =
  | 'OWNER'
  | 'CO_OWNER'
  | 'TENANT'
  | 'FAMILY_MEMBER'
  | 'AUTHORIZED_OCCUPANT';

export type FamilyRelationshipSubType =
  | 'SPOUSE'
  | 'CHILD'
  | 'PARENT'
  | 'DEPENDENT'
  | 'OTHER_AUTHORIZED';

export type VerificationStatus =
  | 'PENDING'
  | 'VERIFIED'
  | 'FAILED'
  | 'EXPIRED';

export type DocumentType =
  | 'IDENTITY_PROOF'
  | 'ADDRESS_PROOF'
  | 'OWNERSHIP_PROOF'
  | 'SALE_DEED'
  | 'RENT_AGREEMENT'
  | 'TENANT_KYC'
  | 'POLICE_VERIFICATION'
  | 'OWNER_CONSENT'
  | 'RELATIONSHIP_PROOF'
  | 'BIRTH_CERTIFICATE'
  | 'MARRIAGE_CERTIFICATE'
  | 'SOCIETY_RULE_ACKNOWLEDGEMENT'
  | 'OTHER';

export type DocumentStatus =
  | 'NOT_SUBMITTED'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'CHANGES_REQUIRED'
  | 'REJECTED'
  | 'EXPIRED';

export interface Resident {
  id: string;
  societyId: string;
  unitId: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile: string;
  relationshipType: ResidentRelationshipType;
  familyRelationshipSubType?: FamilyRelationshipSubType;
  registrationStatus: ResidentRegistrationStatus;
  verificationStatus: VerificationStatus;
  invitationId?: string;
  invitedAt?: string;
  registeredAt?: string;
  verifiedAt?: string;
  documentsSubmittedAt?: string;
  reviewedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  activatedAt?: string;
  suspendedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResidentProfile {
  firstName: string;
  lastName: string;
  email?: string;
  mobile: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  emergencyContactName?: string;
  emergencyContactMobile?: string;
  emergencyContactRelationship?: string;
}

export interface ResidentInvitation {
  id: string;
  societyId: string;
  unitId: string;
  relationshipType: ResidentRelationshipType;
  familyRelationshipSubType?: FamilyRelationshipSubType;
  inviteeName?: string;
  inviteeMobile: string;
  inviteeEmail?: string;
  invitedBy: string;
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED' | 'USED';
  token: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
}

export interface ResidentDocument {
  id: string;
  residentId: string;
  type: DocumentType;
  fileName: string;
  fileUrl?: string;
  status: DocumentStatus;
  submittedAt?: string;
  reviewedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResidentRequest {
  societyId: string;
  unitId: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile: string;
  relationshipType: ResidentRelationshipType;
  familyRelationshipSubType?: FamilyRelationshipSubType;
  profile?: ResidentProfile;
}

export interface UpdateResidentRequest extends Partial<CreateResidentRequest> {
  id: string;
  registrationStatus?: ResidentRegistrationStatus;
  verificationStatus?: VerificationStatus;
  rejectionReason?: string;
}

export interface InviteResidentRequest {
  societyId: string;
  unitId: string;
  relationshipType: ResidentRelationshipType;
  familyRelationshipSubType?: FamilyRelationshipSubType;
  inviteeMobile: string;
  inviteeEmail?: string;
  inviteeName?: string;
  invitedBy: string;
}

export interface AcceptInvitationRequest {
  token: string;
  firstName: string;
  lastName: string;
  email?: string;
  mobile: string;
  profile?: ResidentProfile;
}

export interface VerificationRequest {
  residentId: string;
  code: string;
  type: 'MOBILE' | 'EMAIL';
}

export interface VerificationResult {
  success: boolean;
  residentId: string;
  verificationStatus: VerificationStatus;
  message?: string;
}

export interface DocumentRequirement {
  type: DocumentType;
  label: string;
  description: string;
  isRequired: boolean;
  acceptedFileTypes: string[];
  maxFileSizeMB: number;
  appliesToRelationships: ResidentRelationshipType[];
}

export interface UploadDocumentRequest {
  residentId: string;
  type: DocumentType;
  fileName: string;
  fileBase64: string;
}

export interface ReviewResidentRequest {
  residentId: string;
  action: 'APPROVE' | 'REJECT' | 'RESUBMIT';
  reason?: string;
  reviewedBy: string;
}

export interface ResidentListFilters {
  societyId: string;
  search?: string;
  status?: ResidentRegistrationStatus;
  unitId?: string;
  relationshipType?: ResidentRelationshipType;
}

export interface ResidentListItem {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  unitNumber: string;
  relationshipType: ResidentRelationshipType;
  registrationStatus: ResidentRegistrationStatus;
  verificationStatus: VerificationStatus;
  invitedAt?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface ResidentDetail extends Resident {
  unitNumber: string;
  unitType: string;
  towerName: string;
  floorNumber: number;
  documents: ResidentDocument[];
  invitation?: ResidentInvitation;
  profile?: ResidentProfile;
}

export const RESIDENT_REGISTRATION_TRANSITIONS: Record<ResidentRegistrationStatus, ResidentRegistrationStatus[]> = {
  INVITED: ['REGISTERED', 'EXPIRED', 'REVOKED'],
  REGISTERED: ['IDENTITY_VERIFIED', 'INVITED'],
  IDENTITY_VERIFIED: ['DOCUMENTS_SUBMITTED', 'REGISTERED'],
  DOCUMENTS_SUBMITTED: ['ADMIN_REVIEW', 'IDENTITY_VERIFIED'],
  ADMIN_REVIEW: ['APPROVED', 'REJECTED', 'RESUBMIT'],
  APPROVED: ['ACTIVE'],
  RESUBMIT: ['DOCUMENTS_SUBMITTED'],
  REJECTED: ['REGISTERED', 'ARCHIVED'],
  ACTIVE: ['SUSPENDED', 'ARCHIVED'],
  SUSPENDED: ['ACTIVE', 'ARCHIVED'],
  ARCHIVED: [],
  EXPIRED: [],
  REVOKED: [],
};

export function canTransitionResidentStatus(
  from: ResidentRegistrationStatus,
  to: ResidentRegistrationStatus
): boolean {
  return RESIDENT_REGISTRATION_TRANSITIONS[from]?.includes(to) ?? false;
}

export const RESIDENT_RELATIONSHIP_LABELS: Record<ResidentRelationshipType, string> = {
  OWNER: 'Owner',
  CO_OWNER: 'Co-Owner',
  TENANT: 'Tenant',
  FAMILY_MEMBER: 'Family Member',
  AUTHORIZED_OCCUPANT: 'Authorized Occupant',
};

export const FAMILY_RELATIONSHIP_SUBTYPE_LABELS: Record<FamilyRelationshipSubType, string> = {
  SPOUSE: 'Spouse',
  CHILD: 'Child',
  PARENT: 'Parent',
  DEPENDENT: 'Dependent',
  OTHER_AUTHORIZED: 'Other Authorized',
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  IDENTITY_PROOF: 'Identity Proof',
  ADDRESS_PROOF: 'Address Proof',
  OWNERSHIP_PROOF: 'Ownership Proof',
  SALE_DEED: 'Sale Deed',
  RENT_AGREEMENT: 'Rent Agreement',
  TENANT_KYC: 'Tenant KYC',
  POLICE_VERIFICATION: 'Police Verification',
  OWNER_CONSENT: 'Owner Consent',
  RELATIONSHIP_PROOF: 'Relationship Proof',
  BIRTH_CERTIFICATE: 'Birth Certificate',
  MARRIAGE_CERTIFICATE: 'Marriage Certificate',
  SOCIETY_RULE_ACKNOWLEDGEMENT: 'Society Rule Acknowledgement',
  OTHER: 'Other',
};

export const REQUIRED_DOCUMENTS_BY_RELATIONSHIP: Record<ResidentRelationshipType, DocumentType[]> = {
  OWNER: ['IDENTITY_PROOF', 'ADDRESS_PROOF', 'OWNERSHIP_PROOF', 'SOCIETY_RULE_ACKNOWLEDGEMENT'],
  CO_OWNER: ['IDENTITY_PROOF', 'ADDRESS_PROOF', 'RELATIONSHIP_PROOF', 'SOCIETY_RULE_ACKNOWLEDGEMENT'],
  TENANT: ['IDENTITY_PROOF', 'ADDRESS_PROOF', 'RENT_AGREEMENT', 'TENANT_KYC', 'POLICE_VERIFICATION', 'OWNER_CONSENT', 'SOCIETY_RULE_ACKNOWLEDGEMENT'],
  FAMILY_MEMBER: ['IDENTITY_PROOF', 'ADDRESS_PROOF', 'RELATIONSHIP_PROOF', 'SOCIETY_RULE_ACKNOWLEDGEMENT'],
  AUTHORIZED_OCCUPANT: ['IDENTITY_PROOF', 'ADDRESS_PROOF', 'OWNER_CONSENT', 'SOCIETY_RULE_ACKNOWLEDGEMENT'],
};