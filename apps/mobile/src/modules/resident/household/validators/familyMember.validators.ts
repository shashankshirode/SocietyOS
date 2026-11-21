import type {
  AddFamilyMemberInput,
  FamilyAccessPermissions,
  FamilyMember,
} from '../data/residentHousehold.types';

export type FamilyMemberValidationResult = {
  isValid: boolean;
  fieldErrors: FamilyMemberFieldError[];
};

export type FamilyMemberFieldError = {
  field: keyof AddFamilyMemberInput;
  messageKey: string;
};

export type FamilyMemberValidationContext = {
  existingMembers: FamilyMember[];
  editingFamilyMemberId?: string;
  phoneRequiredForAdults: boolean;
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

export function getAgeOnDate(dateOfBirth: string, onDate: Date = new Date()): number | null {
  const birthDate = parseDate(dateOfBirth);
  if (!birthDate) {
    return null;
  }
  let age = onDate.getFullYear() - birthDate.getFullYear();
  const monthDelta = onDate.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && onDate.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

export function suggestFamilyAgeFlags(dateOfBirth: string): Pick<AddFamilyMemberInput, 'isMinor' | 'isSeniorCitizen'> {
  const age = getAgeOnDate(dateOfBirth);
  return {
    isMinor: age !== null && age < 18,
    isSeniorCitizen: age !== null && age >= 60,
  };
}

function pushError(
  fieldErrors: FamilyMemberFieldError[],
  field: keyof AddFamilyMemberInput,
  messageKey: string,
) {
  fieldErrors.push({ field, messageKey });
}

export function validateFamilyMemberInput(
  input: AddFamilyMemberInput,
  context: FamilyMemberValidationContext,
): FamilyMemberValidationResult {
  const fieldErrors: FamilyMemberFieldError[] = [];
  const fullName = input.fullName.trim();
  const dateOfBirth = parseDate(input.dateOfBirth);
  const age = getAgeOnDate(input.dateOfBirth);
  const isAdult = age !== null && age >= 18;

  if (!fullName) {
    pushError(fieldErrors, 'fullName', 'resident.validation.family.fullNameRequired');
  } else if (fullName.length < 2) {
    pushError(fieldErrors, 'fullName', 'resident.validation.family.fullNameMinLength');
  }

  if (!input.dateOfBirth) {
    pushError(fieldErrors, 'dateOfBirth', 'resident.validation.family.dateOfBirthRequired');
  } else if (!dateOfBirth) {
    pushError(fieldErrors, 'dateOfBirth', 'resident.validation.family.dateOfBirthInvalid');
  } else if (dateOfBirth > new Date()) {
    pushError(fieldErrors, 'dateOfBirth', 'resident.validation.family.dateOfBirthFuture');
  }

  if (!input.relationToOwner) {
    pushError(fieldErrors, 'relationToOwner', 'resident.validation.family.relationRequired');
  }

  if (context.phoneRequiredForAdults && isAdult && !input.phoneNumber.trim()) {
    pushError(fieldErrors, 'phoneNumber', 'resident.validation.family.phoneRequiredForAdult');
  }

  if (input.phoneNumber.trim() && !INDIAN_MOBILE_PATTERN.test(input.phoneNumber.trim())) {
    pushError(fieldErrors, 'phoneNumber', 'resident.validation.family.phoneInvalid');
  }

  const duplicatePhone = context.existingMembers.some(
    (member) =>
      member.id !== context.editingFamilyMemberId &&
      member.phoneNumber.trim() === input.phoneNumber.trim() &&
      input.phoneNumber.trim().length > 0,
  );
  if (duplicatePhone) {
    pushError(fieldErrors, 'phoneNumber', 'resident.validation.family.phoneDuplicate');
  }

  if (input.emailAddress && !EMAIL_PATTERN.test(input.emailAddress.trim())) {
    pushError(fieldErrors, 'emailAddress', 'resident.validation.family.emailInvalid');
  }

  if (input.isMinor && input.isEmergencyContact) {
    pushError(fieldErrors, 'isEmergencyContact', 'resident.validation.family.minorEmergencyContact');
  }

  if (input.isMinor && input.documentAccessPermission !== 'NONE') {
    pushError(fieldErrors, 'documentAccessPermission', 'resident.validation.family.minorDocumentAccess');
  }

  return {
    isValid: fieldErrors.length === 0,
    fieldErrors,
  };
}

export function validateFamilyAccessPermissions(
  permissions: FamilyAccessPermissions,
  member: FamilyMember,
): FamilyMemberValidationResult {
  const fieldErrors: FamilyMemberFieldError[] = [];
  if (member.isMinor && permissions.documentAccessPermission !== 'NONE') {
    pushError(fieldErrors, 'documentAccessPermission', 'resident.validation.family.minorDocumentAccess');
  }
  return {
    isValid: fieldErrors.length === 0,
    fieldErrors,
  };
}

