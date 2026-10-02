export type OnboardingStep =
  | 'VERIFY_MOBILE'
  | 'FIND_SOCIETY'
  | 'CONFIRM_SOCIETY'
  | 'FIND_UNIT'
  | 'CONFIRM_UNIT'
  | 'RESIDENT_TYPE'
  | 'ROLE_SPECIFIC'
  | 'ABOUT_YOU'
  | 'DOCUMENTS'
  | 'REVIEW'
  | 'VERIFICATION_PROGRESS'
  | 'VERIFICATION_RESULT'
  | 'SUBMITTING'
  | 'ADMIN_REVIEW'
  | 'RESUBMIT'
  | 'REJECTED'
  | 'APPROVED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'PERMISSIONS'
  | 'WELCOME_HOME';

export type OnboardingMilestone = 'Verify' | 'Your home' | 'About you' | 'Documents' | 'Review' | 'Decision' | 'Ready' | 'Active';

export type ResidentRole = 'OWNER' | 'CO_OWNER' | 'TENANT' | 'FAMILY_MEMBER' | 'OTHER';

export type FamilyRelation = 'Spouse' | 'Parent' | 'Child' | 'Sibling' | 'Other';

export interface OnboardingSociety {
  id: string;
  name: string;
  city: string;
  state: string;
  category: string;
  totalUnits: number;
  imageUrl?: string;
  isVerified: boolean;
}

export interface OnboardingUnit {
  id: string;
  societyId: string;
  unitNumber: string;
  tower: string;
  wing: string;
  floor: number;
}

export type DocumentUploadStatus =
  | 'NOT_UPLOADED'
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

export interface OnboardingDocument {
  id: string;
  type?: 'identity_proof' | 'address_proof' | 'rental_agreement' | 'other' | string;
  label?: string;
  title?: string;
  requirementId?: string;
  documentType?: string;
  description: string;
  isRequired: boolean;
  acceptedFormats: readonly string[] | string[];
  maxSizeMB: number;
  status: DocumentUploadStatus;
  fileName?: string;
  fileSize?: number;
  fileUri?: string;
  mimeType?: string;
  rejectionReason?: string;
}

export type VerificationOutcome = 'APPROVED' | 'PENDING' | 'NEEDS_ACTION';

export interface ResidentOnboardingDraft {
  step: OnboardingStep;
  mobileNumber: string;
  maskedMobile: string;
  isMobileVerified: boolean;
  selectedSociety: OnboardingSociety | null;
  selectedUnit: OnboardingUnit | null;
  residentRole: ResidentRole | null;
  tenantDetails?: {
    agreementStart: string;
    agreementEnd: string;
    requiresOwnerVerification: boolean;
    ownerName?: string;
  };
  familyDetails?: {
    relationship: FamilyRelation;
    primaryResidentName?: string;
  };
  profile: {
    fullName: string;
    preferredName: string;
    email: string;
    dob?: string;
    emergencyContact?: string;
    avatarUri?: string;
  };
  documents: OnboardingDocument[];
  verificationOutcome: VerificationOutcome;
  notificationPermissionGranted: boolean;
  progressPercent: number;
  lastSavedAt: string;
}
