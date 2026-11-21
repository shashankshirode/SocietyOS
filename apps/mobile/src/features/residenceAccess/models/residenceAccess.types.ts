import type { ImageSourcePropType } from 'react-native';

export type ResidenceAccessStatus =
  | 'DISCOVERED'
  | 'CLAIM_NOT_STARTED'
  | 'IDENTITY_DETAILS_REQUIRED'
  | 'DOCUMENTS_REQUIRED'
  | 'DOCUMENTS_UNDER_REVIEW'
  | 'DOCUMENT_CHANGES_REQUIRED'
  | 'OWNER_CONSENT_REQUIRED'
  | 'OWNER_CONSENT_PENDING'
  | 'SOCIETY_APPROVAL_PENDING'
  | 'ADDITIONAL_INFORMATION_REQUIRED'
  | 'APPROVED'
  | 'ACTIVE'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'TEMPORARILY_RESTRICTED'
  | 'INACTIVE'
  | 'EXPIRED'
  | 'REACTIVATION_REQUIRED'
  | 'ACCESS_REVOKED'
  | 'UNIT_TRANSFER_PENDING'
  | 'MOVE_OUT_PENDING'
  | 'ARCHIVED';

export type ResidenceAccessBlocker =
  | 'IDENTITY_NOT_COMPLETE'
  | 'MANDATORY_DOCUMENT_MISSING'
  | 'DOCUMENT_REJECTED'
  | 'DOCUMENT_EXPIRED'
  | 'DOCUMENT_UNREADABLE'
  | 'DOCUMENT_NAME_MISMATCH'
  | 'DOCUMENT_UNIT_MISMATCH'
  | 'OWNER_CONSENT_MISSING'
  | 'ADMIN_REVIEW_PENDING'
  | 'DUPLICATE_ACTIVE_OCCUPANCY'
  | 'TENANCY_PERIOD_EXPIRED'
  | 'MOVE_OUT_NOT_COMPLETED'
  | 'SOCIETY_DUES_PENDING'
  | 'RULE_ACKNOWLEDGEMENT_PENDING'
  | 'POLICE_VERIFICATION_PENDING'
  | 'UNIT_OWNERSHIP_DISPUTE'
  | 'PROFILE_DATA_MISMATCH'
  | 'SUSPENDED_BY_SOCIETY'
  | 'REVOKED_BY_OWNER'
  | 'REVOKED_BY_SOCIETY'
  | 'ACCOUNT_SECURITY_HOLD'
  | 'OTHER';

export type ResidenceRole =
  | 'OWNER'
  | 'CO_OWNER'
  | 'TENANT'
  | 'FAMILY_MEMBER'
  | 'AUTHORIZED_OCCUPANT'
  | 'MINOR'
  | 'STAFF';

export type ResidenceAccessActorType =
  | 'RESIDENT'
  | 'OWNER'
  | 'SOCIETY_ADMIN'
  | 'SOCIETY_COMMITTEE'
  | 'SYSTEM'
  | 'SECURITY_REVIEW';

export interface ResidenceAccessActor {
  readonly actorType: ResidenceAccessActorType;
  readonly actorId: string;
  readonly actorDisplayRole: string;
}

export type ResidenceAccessActionType =
  | 'ENTER_RESIDENCE'
  | 'VIEW_STATUS'
  | 'START_CLAIM'
  | 'COMPLETE_IDENTITY'
  | 'UPLOAD_DOCUMENTS'
  | 'VIEW_REQUIREMENTS'
  | 'SUBMIT_FOR_REVIEW'
  | 'VIEW_SUBMITTED_INFORMATION'
  | 'VIEW_DOCUMENTS'
  | 'SEND_REMINDER'
  | 'CONTACT_SOCIETY'
  | 'WITHDRAW_REQUEST'
  | 'REQUEST_OWNER_CONSENT'
  | 'RESEND_OWNER_CONSENT'
  | 'UPLOAD_OWNER_CONSENT'
  | 'CORRECT_AND_RESUBMIT'
  | 'VIEW_DECISION'
  | 'REQUEST_RECONSIDERATION'
  | 'RESOLVE_SUSPENSION'
  | 'SUBMIT_CLARIFICATION'
  | 'RENEW_ACCESS'
  | 'REQUEST_REACTIVATION'
  | 'VIEW_HISTORY'
  | 'VIEW_PREVIOUS_OCCUPANCY'
  | 'REMOVE_FROM_QUICK_ACCESS'
  | 'LINK_ANOTHER_HOME'
  | 'SWITCH_RESIDENCE'
  | 'SIGN_OUT';

export interface ResidenceAccessAction {
  readonly type: ResidenceAccessActionType;
  readonly label: string;
  readonly accessibilityLabel: string;
  readonly enabled: boolean;
  readonly disabledReason?: string;
  readonly destructive?: boolean;
}

export interface ResidenceAccessEligibility {
  readonly canEnterResidence: boolean;
  readonly canViewLimitedResidenceData: boolean;
  readonly canUploadDocuments: boolean;
  readonly canEditSubmittedDetails: boolean;
  readonly canSendReminder: boolean;
  readonly canRequestOwnerConsent: boolean;
  readonly canResubmit: boolean;
  readonly canAppeal: boolean;
  readonly canRequestReactivation: boolean;
  readonly canContactSociety: boolean;
  readonly blockingReasons: readonly ResidenceAccessBlocker[];
  readonly nextRecommendedAction: ResidenceAccessActionType | null;
}

export interface ResidenceImage {
  readonly uri?: string;
  readonly source?: ImageSourcePropType;
  readonly fallbackIcon: 'business-outline' | 'home-outline' | 'build-outline';
  readonly accessibilityLabel: string;
}

export interface ResidenceSummary {
  readonly residenceAccessId: string;
  readonly societyId: string;
  readonly societyName: string;
  readonly unitId: string;
  readonly unitNumber: string;
  readonly buildingName: string;
  readonly wingName?: string;
  readonly city: string;
  readonly role: ResidenceRole;
  readonly image: ResidenceImage;
  readonly officePhoneMasked?: string;
  readonly officeEmail?: string;
  readonly supportHours?: string;
  readonly escalationChannel?: string;
}

export type ResidenceRestrictedFeature =
  | 'VISITOR_APPROVAL'
  | 'FACILITY_BOOKING'
  | 'DOCUMENT_UPLOAD'
  | 'BILL_PAYMENT'
  | 'CHAT'
  | 'DIRECTORY'
  | 'NOC_REQUEST'
  | 'PARKING'
  | 'MARKETPLACE'
  | 'OTHER';

export interface ResidenceFeatureRestriction {
  readonly feature: ResidenceRestrictedFeature;
  readonly reason: string;
  readonly restrictedAt: string;
  readonly expectedReviewAt?: string;
}

export interface ResidenceExpiryReminderPolicy {
  readonly enabled: boolean;
  readonly thresholdsInDays: readonly number[];
}

export interface ResidenceExpiryReminderMilestone {
  readonly daysRemaining: number;
  readonly thresholdInDays: number;
  readonly expiresAt: string;
}

export interface ResidenceAccessRecord {
  readonly residenceAccessId: string;
  readonly userId: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly occupancyId: string;
  readonly role: ResidenceRole;
  readonly status: ResidenceAccessStatus;
  readonly blockers: readonly ResidenceAccessBlocker[];
  readonly statusReason: string;
  readonly residentPendingActions: readonly string[];
  readonly societyPendingActions: readonly string[];
  readonly completedSteps: readonly string[];
  readonly statusUpdatedAt: string;
  readonly requestCreatedAt?: string;
  readonly submittedAt?: string;
  readonly expectedReviewAt?: string;
  readonly referenceNumber: string;
  readonly effectiveFrom?: string;
  readonly effectiveUntil?: string;
  readonly homeContextId?: string;
  readonly canWithdraw: boolean;
  readonly correctionAllowed: boolean;
  readonly correctionDeadline?: string;
  readonly appealAllowed: boolean;
  readonly reactivationAllowed: boolean;
  readonly reminderCooldownHours: number;
  readonly featureRestrictions: readonly ResidenceFeatureRestriction[];
  readonly dataVersion: number;
}

export type ResidenceDocumentType =
  | 'IDENTITY_PROOF'
  | 'ADDRESS_PROOF'
  | 'OWNERSHIP_PROOF'
  | 'SALE_DEED'
  | 'POSSESSION_LETTER'
  | 'ALLOTMENT_LETTER'
  | 'RENT_AGREEMENT'
  | 'TENANT_KYC'
  | 'TENANT_PHOTOGRAPH'
  | 'POLICE_VERIFICATION'
  | 'OWNER_CONSENT'
  | 'MOVE_IN_FORM'
  | 'RELATIONSHIP_PROOF'
  | 'BIRTH_CERTIFICATE'
  | 'MARRIAGE_CERTIFICATE'
  | 'SOCIETY_RULE_ACKNOWLEDGEMENT'
  | 'VEHICLE_DOCUMENT'
  | 'PASSPORT_OR_VISA'
  | 'OTHER';

export type ResidenceDocumentMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/heic'
  | 'application/pdf';

export type ResidenceDocumentVerificationStatus =
  | 'NOT_SUBMITTED'
  | 'UPLOADING'
  | 'UPLOADED'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
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

export interface ResidenceDocumentRequirement {
  readonly requirementId: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly occupancyRole: ResidenceRole;
  readonly documentType: ResidenceDocumentType;
  readonly title: string;
  readonly description: string;
  readonly mandatory: boolean;
  readonly acceptedFileTypes: readonly ResidenceDocumentMimeType[];
  readonly maximumFileSizeBytes: number;
  readonly expiryDateRequired: boolean;
  readonly frontAndBackRequired: boolean;
  readonly verificationStatus: ResidenceDocumentVerificationStatus;
  readonly rejectionReason?: DocumentRejectionReason;
  readonly submittedDocumentId?: string;
  readonly submittedAt?: string;
  readonly expiryDate?: string;
  readonly dueDate?: string;
  readonly displayOrder: number;
}

export interface ResidenceDocumentVersion {
  readonly versionId: string;
  readonly documentId: string;
  readonly versionNumber: number;
  readonly fileName: string;
  readonly mimeType: ResidenceDocumentMimeType;
  readonly fileSizeBytes: number;
  readonly localUri?: string;
  readonly temporaryRemoteUrl?: string;
  readonly submittedAt: string;
  readonly verificationStatus: ResidenceDocumentVerificationStatus;
  readonly checksum: string;
  readonly side: 'SINGLE' | 'FRONT' | 'BACK';
}

export interface ResidenceDocument {
  readonly documentId: string;
  readonly residenceAccessId: string;
  readonly requirementId: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly occupancyId: string;
  readonly currentVersionId: string;
  readonly versions: readonly ResidenceDocumentVersion[];
}

export interface ResidenceDocumentSelection {
  readonly uri: string;
  readonly fileName: string;
  readonly mimeType: ResidenceDocumentMimeType;
  readonly fileSizeBytes: number;
  readonly side: 'SINGLE' | 'FRONT' | 'BACK';
}

export interface ResidenceDocumentUploadInput {
  readonly residenceAccessId: string;
  readonly requirementId: string;
  readonly selection: ResidenceDocumentSelection;
  readonly expiryDate?: string;
  readonly idempotencyKey: string;
  readonly onProgress?: (progress: number) => void;
  readonly signal?: AbortSignal;
}

export interface ResidenceRecoveredUpload {
  readonly residenceAccessId: string;
  readonly requirementId: string;
  readonly selection: ResidenceDocumentSelection;
  readonly expiryDate?: string;
}

export type ResidenceAccessEventType =
  | 'REQUEST_STARTED'
  | 'IDENTITY_DETAILS_SUBMITTED'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_MISSING'
  | 'OWNER_CONSENT_REQUESTED'
  | 'OWNER_CONSENT_RECEIVED'
  | 'SUBMITTED_FOR_REVIEW'
  | 'REMINDER_SENT'
  | 'REVIEW_STARTED'
  | 'DOCUMENT_CHANGES_REQUESTED'
  | 'DOCUMENT_RESUBMITTED'
  | 'REQUEST_APPROVED'
  | 'ACCESS_ACTIVATED'
  | 'ACCESS_SUSPENDED'
  | 'CLARIFICATION_SUBMITTED'
  | 'REACTIVATION_REQUESTED'
  | 'ACCESS_REACTIVATED'
  | 'ACCESS_EXPIRED'
  | 'ACCESS_REVOKED'
  | 'APPEAL_SUBMITTED'
  | 'REQUEST_WITHDRAWN';

export interface ResidenceAccessTimelineEvent {
  readonly eventId: string;
  readonly residenceAccessId: string;
  readonly eventType: ResidenceAccessEventType;
  readonly title: string;
  readonly residentVisibleDescription: string;
  readonly occurredAt: string;
  readonly actorType: ResidenceAccessActorType;
  readonly actorDisplayRole: string;
  readonly relatedDocumentId?: string;
  readonly relatedTaskId?: string;
  readonly residentVisible: boolean;
}

export type ResidenceApprovalReminderReason =
  | 'REVIEW_DELAYED'
  | 'MOVE_IN_DATE_APPROACHING'
  | 'URGENT_VISITOR_ACCESS_REQUIRED'
  | 'DOCUMENT_CORRECTION_COMPLETED'
  | 'PAYMENT_OR_SERVICE_ACCESS_REQUIRED'
  | 'OTHER';

export type ApprovalReminderDeliveryStatus =
  | 'QUEUED'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED';

export interface ResidenceApprovalReminder {
  readonly reminderId: string;
  readonly requestId: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly sentByUserId: string;
  readonly sentAt: string;
  readonly reason: ResidenceApprovalReminderReason;
  readonly optionalMessage?: string;
  readonly deliveryStatus: ApprovalReminderDeliveryStatus;
  readonly nextAllowedReminderAt: string;
}

export interface SendResidenceReminderInput {
  readonly residenceAccessId: string;
  readonly reason: ResidenceApprovalReminderReason;
  readonly optionalMessage?: string;
  readonly idempotencyKey: string;
}

export interface SocietyAccessReviewTask {
  readonly taskId: string;
  readonly societyId: string;
  readonly unitId: string;
  readonly occupancyId: string;
  readonly residentUserId: string;
  readonly requestId: string;
  readonly taskType:
    | 'NEW_ACCESS_REQUEST'
    | 'DOCUMENT_REVIEW'
    | 'DOCUMENT_RESUBMITTED'
    | 'OWNER_CONSENT_RECEIVED'
    | 'RESIDENT_REMINDER'
    | 'REACTIVATION_REQUEST'
    | 'SUSPENSION_RESOLUTION'
    | 'APPEAL_SUBMITTED';
  readonly priority: 'NORMAL' | 'HIGH' | 'URGENT';
  readonly status: 'OPEN' | 'ASSIGNED' | 'IN_REVIEW' | 'COMPLETED' | 'DISMISSED';
  readonly createdAt: string;
  readonly assignedToUserId?: string;
  readonly dueAt?: string;
  readonly residentMessage?: string;
}

export type OwnerConsentStatus =
  | 'NOT_REQUESTED'
  | 'REQUESTED'
  | 'VIEWED'
  | 'APPROVED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface OwnerConsentRequest {
  readonly consentRequestId: string;
  readonly residenceAccessId: string;
  readonly maskedOwnerName: string;
  readonly status: OwnerConsentStatus;
  readonly requestedAt?: string;
  readonly viewedAt?: string;
  readonly decidedAt?: string;
  readonly expiresAt?: string;
  readonly nextResendAllowedAt?: string;
  readonly residentVisibleDecisionReason?: string;
  readonly alternativeOfficeVerificationAllowed: boolean;
}

export type ResidenceAccessRejectionReasonCode =
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

export interface ResidenceAccessDecision {
  readonly decisionId: string;
  readonly residenceAccessId: string;
  readonly requestVersion: number;
  readonly decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUIRED';
  readonly rejectionReasonCode?: ResidenceAccessRejectionReasonCode;
  readonly residentVisibleReason: string;
  readonly internalAdminNote?: string;
  readonly decidedAt: string;
  readonly decisionMakerRole: string;
  readonly affectedRequirementIds: readonly string[];
  readonly correctionAllowed: boolean;
  readonly correctionDeadline?: string;
  readonly supportingNotes?: string;
}

export type ResidenceAccessAppealStatus =
  | 'NOT_STARTED'
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface ResidenceAccessAppeal {
  readonly appealId: string;
  readonly residenceAccessId: string;
  readonly reason: string;
  readonly explanation?: string;
  readonly supportingDocumentId?: string;
  readonly status: ResidenceAccessAppealStatus;
  readonly submittedAt?: string;
}

export interface ResidenceSuspensionRecord {
  readonly suspensionId: string;
  readonly residenceAccessId: string;
  readonly residentVisibleReason: string;
  readonly internalAdminNote?: string;
  readonly suspendedAt: string;
  readonly authorityRole: string;
  readonly affectedFeatures: readonly ResidenceRestrictedFeature[];
  readonly stillAvailableFeatures: readonly string[];
  readonly resolutionSteps: readonly string[];
  readonly expectedReviewAt?: string;
  readonly temporary: boolean;
  readonly referenceNumber: string;
}

export type ResidenceReactivationReason =
  | 'RENEWED_TENANCY'
  | 'RETURNING_FAMILY_MEMBER'
  | 'ACCESS_SUSPENSION_RESOLVED'
  | 'OWNER_REACTIVATION'
  | 'INCORRECT_DEACTIVATION'
  | 'TEMPORARY_ABSENCE_ENDED'
  | 'OTHER';

export type ResidenceReactivationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface ResidenceReactivationRequest {
  readonly requestId: string;
  readonly residenceAccessId: string;
  readonly requestedByUserId: string;
  readonly reason: ResidenceReactivationReason;
  readonly supportingDocumentIds: readonly string[];
  readonly residentMessage?: string;
  readonly status: ResidenceReactivationStatus;
  readonly submittedAt: string;
  readonly reviewedAt?: string;
}

export type ResidenceAccessNotificationType =
  | 'DOCUMENTS_REQUIRED'
  | 'DOCUMENT_UPLOADED'
  | 'DOCUMENT_REJECTED'
  | 'CORRECTION_REQUESTED'
  | 'OWNER_CONSENT_REQUESTED'
  | 'OWNER_CONSENT_APPROVED'
  | 'OWNER_CONSENT_DECLINED'
  | 'REQUEST_SUBMITTED'
  | 'REVIEW_STARTED'
  | 'APPROVAL_DELAYED'
  | 'REQUEST_APPROVED'
  | 'REQUEST_REJECTED'
  | 'ACCESS_ACTIVATED'
  | 'ACCESS_SUSPENDED'
  | 'SUSPENSION_RESOLUTION_REQUIRED'
  | 'ACCESS_EXPIRING_SOON'
  | 'ACCESS_EXPIRED'
  | 'REACTIVATION_APPROVED'
  | 'REACTIVATION_REJECTED'
  | 'REMINDER_DELIVERED';

export interface ResidenceAccessNotification {
  readonly notificationId: string;
  readonly userId: string;
  readonly residenceAccessId: string;
  readonly type: ResidenceAccessNotificationType;
  readonly title: string;
  readonly body: string;
  readonly createdAt: string;
  readonly deepLinkDestination: ResidenceNavigationDestination;
  readonly readAt?: string;
}

export type ResidenceNavigationDestination =
  | 'RESIDENT_DASHBOARD'
  | 'RESIDENCE_ACCESS_OVERVIEW'
  | 'DOCUMENT_REQUIREMENTS'
  | 'OWNER_CONSENT'
  | 'APPROVAL_PROGRESS'
  | 'CORRECTION_REQUIRED'
  | 'REJECTION_DECISION'
  | 'SUSPENSION_RESOLUTION'
  | 'ACCESS_RENEWAL'
  | 'REACTIVATION_STATUS';

export interface ResidenceNavigationGuard {
  resolveDestination(
    residenceAccess: ResidenceAccessRecord,
    eligibility: ResidenceAccessEligibility,
  ): ResidenceNavigationDestination;
}

export type ResidenceAccessCommand =
  | { readonly type: 'START_CLAIM'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'SUBMIT_IDENTITY'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'REQUEST_DOCUMENTS'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'SUBMIT_DOCUMENTS'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'REQUEST_DOCUMENT_CHANGES'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'REQUEST_OWNER_CONSENT'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'OWNER_CONSENT_SENT'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'OWNER_CONSENT_RECEIVED'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'SUBMIT_FOR_REVIEW'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'REQUEST_ADDITIONAL_INFORMATION'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'RESUBMIT'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'APPROVE'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'ACTIVATE'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'REJECT'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'SUSPEND'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'RESTRICT'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'DEACTIVATE'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'EXPIRE'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'REQUEST_REACTIVATION'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'SUBMIT_SUSPENSION_RESOLUTION'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'REVOKE'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'START_UNIT_TRANSFER'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'START_MOVE_OUT'; readonly actor: ResidenceAccessActor }
  | { readonly type: 'ARCHIVE'; readonly actor: ResidenceAccessActor };

export interface ResidenceAccessTransitionResult {
  readonly allowed: boolean;
  readonly previousStatus: ResidenceAccessStatus;
  readonly nextStatus: ResidenceAccessStatus;
  readonly residenceAccess: ResidenceAccessRecord;
  readonly reason?: string;
}

export interface ResidenceAccessTransitionService {
  canTransition(
    currentStatus: ResidenceAccessStatus,
    nextStatus: ResidenceAccessStatus,
    actor: ResidenceAccessActor,
  ): boolean;
  transition(
    residenceAccess: ResidenceAccessRecord,
    command: ResidenceAccessCommand,
  ): ResidenceAccessTransitionResult;
}

export interface ResidenceAccessListItem {
  readonly residence: ResidenceSummary;
  readonly accessRecord: ResidenceAccessRecord;
  readonly eligibility: ResidenceAccessEligibility;
  readonly primaryAction: ResidenceAccessAction;
  readonly secondaryActions: readonly ResidenceAccessAction[];
  readonly completedRequirementCount: number;
  readonly totalRequirementCount: number;
}

export interface ResidenceAccessDetail extends ResidenceAccessListItem {
  readonly requirements: readonly ResidenceDocumentRequirement[];
  readonly documents: readonly ResidenceDocument[];
  readonly timeline: readonly ResidenceAccessTimelineEvent[];
  readonly reminders: readonly ResidenceApprovalReminder[];
  readonly decisions: readonly ResidenceAccessDecision[];
  readonly ownerConsent?: OwnerConsentRequest;
  readonly suspension?: ResidenceSuspensionRecord;
  readonly reactivationRequest?: ResidenceReactivationRequest;
  readonly appeal?: ResidenceAccessAppeal;
}

export type ResidenceAccessStatusFilter =
  | 'ALL'
  | 'ACTIVE'
  | 'ACTION_REQUIRED'
  | 'PENDING'
  | 'PREVIOUS'
  | 'UNAVAILABLE';

export type ResidenceAccessRoleFilter = 'ALL' | ResidenceRole;

export interface ResidenceAccessListQuery {
  readonly userId: string;
  readonly cursor?: string;
  readonly pageSize: number;
  readonly searchText?: string;
  readonly statusFilter: ResidenceAccessStatusFilter;
  readonly roleFilter: ResidenceAccessRoleFilter;
}

export interface ResidenceAccessPage {
  readonly items: readonly ResidenceAccessListItem[];
  readonly nextCursor?: string;
  readonly totalCount: number;
  readonly dataVersion: number;
}

export type ResidenceAccessRepositoryErrorCode =
  | 'OFFLINE'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_FAILED'
  | 'RATE_LIMITED'
  | 'SERVER_ERROR'
  | 'DUPLICATE_REQUEST'
  | 'REMINDER_COOLDOWN'
  | 'STALE_DATA'
  | 'UPLOAD_FAILED'
  | 'UPLOAD_CANCELLED'
  | 'CORRUPTED_FILE'
  | 'PASSWORD_PROTECTED_PDF'
  | 'UNSUPPORTED_FORMAT'
  | 'FILE_TOO_LARGE'
  | 'PERMISSION_DENIED'
  | 'CAMERA_UNAVAILABLE';

export interface ResidenceAccessRepositoryError {
  readonly code: ResidenceAccessRepositoryErrorCode;
  readonly message: string;
  readonly retryable: boolean;
  readonly field?: string;
  readonly retryAfter?: string;
}

export type ResidenceAccessResult<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly error: ResidenceAccessRepositoryError };

export interface SubmitResidenceAccessInput {
  readonly residenceAccessId: string;
  readonly declarationsAccepted: boolean;
  readonly rulesAcknowledged: boolean;
  readonly consentAccepted: boolean;
  readonly idempotencyKey: string;
}

export interface ResidenceCorrectionSubmissionInput {
  readonly residenceAccessId: string;
  readonly affectedRequirementIds: readonly string[];
  readonly idempotencyKey: string;
}

export interface ResidenceAppealInput {
  readonly residenceAccessId: string;
  readonly reason: string;
  readonly explanation?: string;
  readonly supportingDocumentId?: string;
  readonly supportingDocument?: ResidenceDocumentSelection;
  readonly acknowledgementAccepted: boolean;
  readonly idempotencyKey: string;
}

export interface ResidenceSuspensionResolutionInput {
  readonly residenceAccessId: string;
  readonly explanation: string;
  readonly supportingDocumentIds: readonly string[];
  readonly idempotencyKey: string;
}

export interface ResidenceReactivationInput {
  readonly residenceAccessId: string;
  readonly reason: ResidenceReactivationReason;
  readonly residentMessage?: string;
  readonly supportingDocumentIds: readonly string[];
  readonly idempotencyKey: string;
}

export interface ResidenceOwnerConsentInput {
  readonly residenceAccessId: string;
  readonly deliveryMethod: 'SECURE_LINK' | 'SOCIETY_OFFICE' | 'WRITTEN_CONSENT';
  readonly idempotencyKey: string;
}

export interface LinkResidenceInput {
  readonly userId: string;
  readonly method: 'INVITE_CODE' | 'SOCIETY_SEARCH' | 'QR_CODE' | 'UNIT_DETAILS';
  readonly societyIdentifier: string;
  readonly unitNumber: string;
  readonly role: ResidenceRole;
  readonly relationshipDescription?: string;
  readonly idempotencyKey: string;
}

export interface UserAccountStatus {
  readonly identityVerified: boolean;
  readonly accountLocked: boolean;
  readonly phoneVerified: boolean;
  readonly securityHold: boolean;
}
