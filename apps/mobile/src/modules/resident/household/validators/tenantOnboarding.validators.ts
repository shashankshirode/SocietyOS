import type {
  FamilyMember,
  TenantAgreementInput,
  TenantDocumentChecklistItem,
  TenantEligibilityResult,
  TenantOnboardingRequest,
  TenantPersonalInfoInput,
} from '../data/residentHousehold.types';
import { getAgeOnDate } from './familyMember.validators';

export type TenantPersonalInfoValidationResult = {
  isValid: boolean;
  fieldErrors: TenantPersonalInfoFieldError[];
};

export type TenantAgreementValidationResult = {
  isValid: boolean;
  fieldErrors: TenantAgreementFieldError[];
  warnings: TenantAgreementWarning[];
};

export type TenantOnboardingValidationResult = {
  isValid: boolean;
  fieldErrors: TenantOnboardingFieldError[];
};

export type TenantPersonalInfoFieldError = {
  field: keyof TenantPersonalInfoInput;
  messageKey: string;
};

export type TenantAgreementFieldError = {
  field: keyof TenantAgreementInput;
  messageKey: string;
};

export type TenantAgreementWarning = {
  field: keyof TenantAgreementInput;
  messageKey: string;
};

export type TenantOnboardingFieldError = {
  field: 'eligibility' | 'documents' | 'ownerConsent' | 'personalInfo' | 'agreement';
  messageKey: string;
};

export type TenantValidationContext = {
  familyMembers: FamilyMember[];
  maxOccupancy: number;
  policeVerificationCanBePending: boolean;
  tenantOnboardingFeatureEnabled: boolean;
  eligibility: TenantEligibilityResult;
};

const INDIAN_MOBILE_PATTERN = /^[6-9]\d{9}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseDate(value: string): Date | null {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return null;
  }
  return new Date(timestamp);
}

function addPersonalError(
  errors: TenantPersonalInfoFieldError[],
  field: keyof TenantPersonalInfoInput,
  messageKey: string,
) {
  errors.push({ field, messageKey });
}

function addAgreementError(
  errors: TenantAgreementFieldError[],
  field: keyof TenantAgreementInput,
  messageKey: string,
) {
  errors.push({ field, messageKey });
}

export function validateTenantPersonalInfo(
  input: TenantPersonalInfoInput,
  context: Pick<TenantValidationContext, 'familyMembers'>,
): TenantPersonalInfoValidationResult {
  const fieldErrors: TenantPersonalInfoFieldError[] = [];
  const dateOfBirth = parseDate(input.dateOfBirth);
  const age = getAgeOnDate(input.dateOfBirth);

  if (!input.fullName.trim()) {
    addPersonalError(fieldErrors, 'fullName', 'resident.validation.tenant.fullNameRequired');
  }
  if (!input.dateOfBirth) {
    addPersonalError(fieldErrors, 'dateOfBirth', 'resident.validation.tenant.dateOfBirthRequired');
  } else if (!dateOfBirth) {
    addPersonalError(fieldErrors, 'dateOfBirth', 'resident.validation.tenant.dateOfBirthInvalid');
  } else if (dateOfBirth > new Date()) {
    addPersonalError(fieldErrors, 'dateOfBirth', 'resident.validation.tenant.dateOfBirthFuture');
  } else if (age !== null && age < 18) {
    addPersonalError(fieldErrors, 'dateOfBirth', 'resident.validation.tenant.minimumAge');
  }
  if (!input.phoneNumber.trim()) {
    addPersonalError(fieldErrors, 'phoneNumber', 'resident.validation.tenant.phoneRequired');
  } else if (!INDIAN_MOBILE_PATTERN.test(input.phoneNumber.trim())) {
    addPersonalError(fieldErrors, 'phoneNumber', 'resident.validation.tenant.phoneInvalid');
  }
  if (context.familyMembers.some((member) => member.phoneNumber.trim() === input.phoneNumber.trim())) {
    addPersonalError(fieldErrors, 'phoneNumber', 'resident.validation.tenant.phoneDuplicate');
  }
  if (input.emailAddress.trim() && !EMAIL_PATTERN.test(input.emailAddress.trim())) {
    addPersonalError(fieldErrors, 'emailAddress', 'resident.validation.tenant.emailInvalid');
  }
  if (!input.emergencyContactName.trim()) {
    addPersonalError(fieldErrors, 'emergencyContactName', 'resident.validation.tenant.emergencyContactNameRequired');
  }
  if (!input.emergencyContactPhone.trim()) {
    addPersonalError(fieldErrors, 'emergencyContactPhone', 'resident.validation.tenant.emergencyContactPhoneRequired');
  } else if (!INDIAN_MOBILE_PATTERN.test(input.emergencyContactPhone.trim())) {
    addPersonalError(fieldErrors, 'emergencyContactPhone', 'resident.validation.tenant.emergencyContactPhoneInvalid');
  } else if (input.emergencyContactPhone.trim() === input.phoneNumber.trim()) {
    addPersonalError(fieldErrors, 'emergencyContactPhone', 'resident.validation.tenant.emergencyContactPhoneSame');
  }
  if (!input.permanentAddress.trim()) {
    addPersonalError(fieldErrors, 'permanentAddress', 'resident.validation.tenant.permanentAddressRequired');
  }
  if (!input.identityDocumentType) {
    addPersonalError(fieldErrors, 'identityDocumentType', 'resident.validation.tenant.identityTypeRequired');
  }
  if (input.identityDocumentType === 'AADHAAR_METADATA_ONLY' && !/^\d{4}$/.test(input.identityDocumentLast4.trim())) {
    addPersonalError(fieldErrors, 'identityDocumentLast4', 'resident.validation.tenant.identityLast4Required');
  }

  return {
    isValid: fieldErrors.length === 0,
    fieldErrors,
  };
}

export function validateTenantAgreement(
  input: TenantAgreementInput,
  context: Pick<TenantValidationContext, 'maxOccupancy'>,
): TenantAgreementValidationResult {
  const fieldErrors: TenantAgreementFieldError[] = [];
  const warnings: TenantAgreementWarning[] = [];
  const startDate = parseDate(input.agreementStartDate);
  const endDate = parseDate(input.agreementEndDate);
  const moveInDate = parseDate(input.tenantMoveInDate);

  if (!input.agreementStartDate) {
    addAgreementError(fieldErrors, 'agreementStartDate', 'resident.validation.tenant.agreementStartRequired');
  }
  if (!input.agreementEndDate) {
    addAgreementError(fieldErrors, 'agreementEndDate', 'resident.validation.tenant.agreementEndRequired');
  }
  if (startDate && endDate && endDate <= startDate) {
    addAgreementError(fieldErrors, 'agreementEndDate', 'resident.validation.tenant.agreementEndAfterStart');
  }
  if (!input.tenantMoveInDate) {
    addAgreementError(fieldErrors, 'tenantMoveInDate', 'resident.validation.tenant.moveInRequired');
  }
  if (startDate && endDate && moveInDate && (moveInDate < startDate || moveInDate > endDate)) {
    warnings.push({
      field: 'tenantMoveInDate',
      messageKey: 'resident.validation.tenant.moveInOutsideAgreementWarning',
    });
  }
  if (input.numberOfOccupants < 1) {
    addAgreementError(fieldErrors, 'numberOfOccupants', 'resident.validation.tenant.occupantsMinimum');
  }
  if (input.numberOfOccupants > context.maxOccupancy) {
    addAgreementError(fieldErrors, 'numberOfOccupants', 'resident.validation.tenant.occupantsMaximum');
  }
  if (!input.ownerApprovalConfirmed) {
    addAgreementError(fieldErrors, 'ownerApprovalConfirmed', 'resident.validation.tenant.ownerApprovalRequired');
  }

  return {
    isValid: fieldErrors.length === 0,
    fieldErrors,
    warnings,
  };
}

function hasDocumentStatus(documents: TenantDocumentChecklistItem[], documentType: string): boolean {
  const document = documents.find((item) => item.documentType === documentType);
  return document?.status === 'UPLOADED' || document?.status === 'PENDING_VERIFICATION' || document?.status === 'VERIFIED';
}

export function validateTenantOnboardingForSubmit(
  request: TenantOnboardingRequest,
  context: TenantValidationContext,
): TenantOnboardingValidationResult {
  const fieldErrors: TenantOnboardingFieldError[] = [];

  if (!context.tenantOnboardingFeatureEnabled) {
    fieldErrors.push({ field: 'eligibility', messageKey: 'resident.validation.tenant.featureDisabled' });
  }
  if (!context.eligibility.canStartOnboarding) {
    fieldErrors.push({ field: 'eligibility', messageKey: 'resident.validation.tenant.eligibilityBlocked' });
  }
  if (!request.personalInfo) {
    fieldErrors.push({ field: 'personalInfo', messageKey: 'resident.validation.tenant.personalInfoMissing' });
  }
  if (!request.agreement) {
    fieldErrors.push({ field: 'agreement', messageKey: 'resident.validation.tenant.agreementMissing' });
  }
  if (!hasDocumentStatus(request.documents, 'RENT_AGREEMENT')) {
    fieldErrors.push({ field: 'documents', messageKey: 'resident.validation.tenant.rentAgreementDocumentRequired' });
  }
  const hasPoliceVerification = hasDocumentStatus(request.documents, 'POLICE_VERIFICATION');
  if (!hasPoliceVerification && !context.policeVerificationCanBePending) {
    fieldErrors.push({ field: 'documents', messageKey: 'resident.validation.tenant.policeVerificationRequired' });
  }

  return {
    isValid: fieldErrors.length === 0,
    fieldErrors,
  };
}

