import type { ResidentHomeRole } from '../../homeContext/data/residentHomeContext.types';
import type { ResidenceDocumentType, ResidenceDocumentMimeType } from '../../../features/residenceAccess/models/residenceAccess.types';
import type { SupportedCallingCode } from './membership.types';

export type RegistrationStatus =
  | 'INVITED'
  | 'REGISTERED'
  | 'IDENTITY_VERIFIED'
  | 'DOCUMENTS_SUBMITTED'
  | 'ADMIN_REVIEW'
  | 'APPROVED'
  | 'RESUBMIT'
  | 'REJECTED'
  | 'ACTIVE';

export type RegistrationEntryMode = 'INVITATION' | 'OPEN_REGISTRATION' | 'EXISTING_ACCOUNT';

export type ClaimedRelationshipType =
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

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED' | 'USED';

export type DocumentUploadStatus =
  | 'NOT_STARTED'
  | 'SELECTED'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'PROCESSING'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'CHANGES_REQUIRED'
  | 'REJECTED'
  | 'EXPIRED';

export type DocumentRejectionReasonCode =
  | 'UNREADABLE'
  | 'EXPIRED'
  | 'NAME_MISMATCH'
  | 'UNIT_MISMATCH'
  | 'INCOMPLETE'
  | 'UNSUPPORTED_DOCUMENT'
  | 'PASSWORD_PROTECTED_PDF'
  | 'DUPLICATE_FILE'
  | 'OTHER';

export interface DocumentRejectionReason {
  readonly code: DocumentRejectionReasonCode;
  readonly residentVisibleReason: string;
  readonly internalAdminNote?: string;
}

export interface RegistrationDocumentRequirement {
  readonly requirementId: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly relationshipType: ClaimedRelationshipType;
  readonly documentType: ResidenceDocumentType;
  readonly title: string;
  readonly description: string;
  readonly mandatory: boolean;
  readonly acceptedFileTypes: readonly ResidenceDocumentMimeType[];
  readonly maximumFileSizeBytes: number;
  readonly expiryDateRequired: boolean;
  readonly frontAndBackRequired: boolean;
  readonly displayOrder: number;
}

export interface RegistrationDocument {
  readonly documentId: string;
  readonly registrationId: string;
  readonly requirementId: string;
  readonly documentType: ResidenceDocumentType;
  readonly fileName: string;
  readonly fileSize: number;
  readonly mimeType: ResidenceDocumentMimeType;
  readonly status: DocumentUploadStatus;
  readonly uploadedAt: string;
  readonly submittedAt?: string;
  readonly verifiedAt?: string;
  readonly verifiedBy?: string;
  readonly checksum: string;
  readonly version: number;
  readonly previousVersionId?: string;
  readonly storageReference: string;
  readonly rejectionReason?: DocumentRejectionReason;
}

export interface RegistrationProfile {
  readonly fullName: string;
  readonly preferredName?: string;
  readonly email: string;
  readonly dateOfBirth?: string;
  readonly emergencyContact?: string;
  readonly avatarUri?: string;
}

export interface NormalizedContact {
  readonly mobileNumber: string;
  readonly countryCode: SupportedCallingCode;
  readonly email: string;
}

export interface RegistrationInvitation {
  readonly invitationId: string;
  readonly registrationId: string;
  readonly societyId: string;
  readonly societyName: string;
  readonly unitId: string;
  readonly unitNumber: string;
  readonly towerName?: string;
  readonly wingName?: string;
  readonly floorNumber?: number;
  readonly claimedRelationship: ClaimedRelationshipType;
  readonly familyRelationshipSubType?: FamilyRelationshipSubType;
  readonly recipientMobile: string;
  readonly recipientEmail: string;
  readonly token: string;
  readonly status: InvitationStatus;
  readonly expiresAt: string;
  readonly createdAt: string;
  readonly acceptedAt?: string;
  readonly revokedAt?: string;
  readonly revokedBy?: string;
  readonly revocationReason?: string;
}

export interface ResidentRegistration {
  readonly registrationId: string;
  readonly userId: string;
  readonly societyId: string;
  readonly societyName: string;
  readonly unitId: string;
  readonly unitNumber: string;
  readonly towerName?: string;
  readonly wingName?: string;
  readonly floorNumber?: number;
  readonly claimedRelationship: ClaimedRelationshipType;
  readonly familyRelationshipSubType?: FamilyRelationshipSubType;
  readonly entryMode: RegistrationEntryMode;
  readonly profile: RegistrationProfile;
  readonly verifiedContact: NormalizedContact;
  readonly status: RegistrationStatus;
  readonly verificationStatus: VerificationStatus;
  readonly verificationChannel?: VerificationChannel;
  readonly verificationCompletedAt?: string;
  readonly invitedAt?: string;
  readonly registeredAt: string;
  readonly identityVerifiedAt?: string;
  readonly documentsSubmittedAt?: string;
  readonly submittedForReviewAt?: string;
  readonly reviewedAt?: string;
  readonly approvedAt?: string;
  readonly rejectedAt?: string;
  readonly rejectionReason?: ResidentRejectionReason;
  readonly activatedAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly dataVersion: number;
}

export interface ResidentRejectionReason {
  readonly code: ResidentRejectionReasonCode;
  readonly residentVisibleReason: string;
  readonly internalAdminNote?: string;
}

export type ResidentRejectionReasonCode =
  | 'IDENTITY_COULD_NOT_BE_VERIFIED'
  | 'OWNERSHIP_PROOF_INVALID'
  | 'RENT_AGREEMENT_INVALID'
  | 'RENT_AGREEMENT_EXPIRED'
  | 'OWNER_CONSENT_DECLINED'
  | 'POLICE_VERIFICATION_MISSING'
  | 'DOCUMENT_UNREADABLE'
  | 'DOCUMENT_INFORMATION_MISMATCH'
  | 'INCORRECT_UNIT_SELECTED'
  | 'RELATIONSHIP_PROOF_INVALID'
  | 'DUPLICATE_OCCUPANCY'
  | 'SOCIETY_RECORD_NOT_FOUND'
  | 'APPLICATION_INCOMPLETE'
  | 'SOCIETY_POLICY_NOT_MET'
  | 'SECURITY_REVIEW_FAILED'
  | 'OTHER';

export interface ResidentRegistrationDetail extends ResidentRegistration {
  readonly invitation?: RegistrationInvitation;
  readonly documents: readonly RegistrationDocument[];
  readonly requirements: readonly RegistrationDocumentRequirement[];
  readonly unit: {
    readonly id: string;
    readonly unitNumber: string;
    readonly towerName?: string;
    readonly wingName?: string;
    readonly floorNumber?: number;
    readonly occupancyStatus: string;
  };
  readonly timeline: readonly RegistrationTimelineEvent[];
}

export type RegistrationEventType =
  | 'INVITATION_CREATED'
  | 'INVITATION_REVOKED'
  | 'INVITATION_ACCEPTED'
  | 'IDENTITY_VERIFICATION_COMPLETED'
  | 'PROFILE_UPDATED'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_REPLACED'
  | 'DOCUMENT_REMOVED'
  | 'REGISTRATION_SUBMITTED'
  | 'ADMIN_REVIEW_STARTED'
  | 'RESUBMISSION_REQUESTED'
  | 'REGISTRATION_APPROVED'
  | 'REGISTRATION_REJECTED'
  | 'REGISTRATION_ACTIVATED'
  | 'REGISTRATION_WITHDRAWN';

export interface RegistrationTimelineEvent {
  readonly eventId: string;
  readonly registrationId: string;
  readonly eventType: RegistrationEventType;
  readonly title: string;
  readonly description?: string;
  readonly occurredAt: string;
  readonly actorType: 'RESIDENT' | 'ADMIN' | 'OWNER' | 'SYSTEM';
  readonly actorDisplayRole: string;
  readonly relatedDocumentId?: string;
}

export interface DuplicateDetectionResult {
  readonly hasDuplicate: boolean;
  readonly duplicateType?: 'EXACT_MATCH' | 'PHONE_MATCH' | 'EMAIL_MATCH' | 'AMBIGUOUS';
  readonly existingRegistrationId?: string;
  readonly existingRegistrationName?: string;
  readonly existingSocietyId?: string;
  readonly message: string;
  readonly requiresManualReview: boolean;
}

export interface RegistrationFilters {
  readonly societyId: string;
  readonly status?: RegistrationStatus;
  readonly unitId?: string;
  readonly search?: string;
  readonly relationshipType?: ClaimedRelationshipType;
}

export interface CreateRegistrationRequest {
  readonly societyId: string;
  readonly unitId: string;
  readonly claimedRelationship: ClaimedRelationshipType;
  readonly familyRelationshipSubType?: FamilyRelationshipSubType;
  readonly fullName: string;
  readonly email: string;
  readonly mobileNumber: string;
  readonly countryCode: SupportedCallingCode;
  readonly entryMode: RegistrationEntryMode;
  readonly invitationId?: string;
  readonly idempotencyKey: string;
}

export interface UpdateRegistrationRequest {
  readonly registrationId: string;
  readonly profile?: Partial<RegistrationProfile>;
  readonly claimedRelationship?: ClaimedRelationshipType;
  readonly familyRelationshipSubType?: FamilyRelationshipSubType;
  readonly idempotencyKey: string;
}

export interface SubmitRegistrationRequest {
  readonly registrationId: string;
  readonly declarationsAccepted: boolean;
  readonly rulesAcknowledged: boolean;
  readonly consentAccepted: boolean;
  readonly idempotencyKey: string;
}

export interface ResubmitRegistrationRequest {
  readonly registrationId: string;
  readonly affectedRequirementIds: readonly string[];
  readonly idempotencyKey: string;
}

export interface ApproveRegistrationRequest {
  readonly registrationId: string;
  readonly adminId: string;
  readonly digitalSignature?: string;
  readonly idempotencyKey: string;
}

export interface RejectRegistrationRequest {
  readonly registrationId: string;
  readonly adminId: string;
  readonly reason: ResidentRejectionReason;
  readonly idempotencyKey: string;
}

export interface RequestResubmissionRequest {
  readonly registrationId: string;
  readonly adminId: string;
  readonly affectedRequirementIds: readonly string[];
  readonly residentVisibleReason: string;
  readonly internalAdminNote?: string;
  readonly idempotencyKey: string;
}

export interface ActivateRegistrationRequest {
  readonly registrationId: string;
  readonly idempotencyKey: string;
}

export interface WithdrawRegistrationRequest {
  readonly registrationId: string;
  readonly reason?: string;
  readonly idempotencyKey: string;
}

export interface RegistrationRequirementResolution {
  readonly required: readonly RegistrationDocumentRequirement[];
  readonly optional: readonly RegistrationDocumentRequirement[];
  readonly complete: boolean;
  readonly incompleteRequirements: readonly string[];
  readonly underReviewRequirements: readonly string[];
  readonly changesRequiredRequirements: readonly string[];
}

export interface SocietyRegistrationPolicy {
  readonly societyId: string;
  readonly openRegistrationEnabled: boolean;
  readonly requiresAdminApproval: boolean;
  readonly requiresOwnerConsentForTenant: boolean;
  readonly requiresPoliceVerificationForTenant: boolean;
  readonly allowedRelationshipTypes: readonly ClaimedRelationshipType[];
  readonly documentRequirements: readonly RegistrationDocumentRequirement[];
  readonly invitationExpiryDays: number;
  readonly reminderPolicy: {
    readonly enabled: boolean;
    readonly minimumIntervalHours: number;
    readonly maximumRemindersWithinWindow: number;
    readonly reminderWindowDays: number;
    readonly allowResidentNote: boolean;
  };
}

export const REGISTRATION_STATUS_TRANSITIONS: Record<RegistrationStatus, RegistrationStatus[]> = {
  INVITED: ['REGISTERED'],
  REGISTERED: ['IDENTITY_VERIFIED'],
  IDENTITY_VERIFIED: ['DOCUMENTS_SUBMITTED'],
  DOCUMENTS_SUBMITTED: ['ADMIN_REVIEW'],
  ADMIN_REVIEW: ['APPROVED', 'RESUBMIT', 'REJECTED'],
  APPROVED: ['ACTIVE'],
  RESUBMIT: ['DOCUMENTS_SUBMITTED', 'ADMIN_REVIEW'],
  REJECTED: ['DOCUMENTS_SUBMITTED'],
  ACTIVE: [],
};

export function canTransitionRegistration(from: RegistrationStatus, to: RegistrationStatus): boolean {
  return REGISTRATION_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  INVITED: 'Invited',
  REGISTERED: 'Registered',
  IDENTITY_VERIFIED: 'Identity Verified',
  DOCUMENTS_SUBMITTED: 'Documents Submitted',
  ADMIN_REVIEW: 'Admin Review',
  APPROVED: 'Approved',
  RESUBMIT: 'Resubmit Required',
  REJECTED: 'Rejected',
  ACTIVE: 'Active',
};

export const CLAIMED_RELATIONSHIP_LABELS: Record<ClaimedRelationshipType, string> = {
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

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  FAILED: 'Failed',
  EXPIRED: 'Expired',
};

export const INVITATION_STATUS_LABELS: Record<InvitationStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  EXPIRED: 'Expired',
  REVOKED: 'Revoked',
  USED: 'Used',
};