import type { SupportedCallingCode } from '../data/membership.types';
import type { NormalizedContact, DuplicateDetectionResult } from '../data/registration.types';

const INDIAN_MOBILE_PATTERN = /^(\+91|91|0)?([6-9]\d{9})$/;

export function normalizeIndianMobile(mobile: string): { normalized: string; countryCode: SupportedCallingCode } | null {
  const cleaned = mobile.replace(/[\s\-\(\)]/g, '');
  const match = cleaned.match(INDIAN_MOBILE_PATTERN);
  if (!match) return null;
  const number = match[2];
  return { normalized: number, countryCode: '+91' };
}

export function normalizeMobileNumber(mobile: string, countryCode: SupportedCallingCode): { normalized: string; countryCode: SupportedCallingCode } | null {
  const cleaned = mobile.replace(/[\s\-\(\)]/g, '');
  
  if (countryCode === '+91') {
    return normalizeIndianMobile(cleaned);
  }
  
  if (cleaned.startsWith('+')) {
    return { normalized: cleaned, countryCode };
  }
  
  if (cleaned.startsWith(countryCode.replace('+', ''))) {
    return { normalized: cleaned, countryCode };
  }
  
  return { normalized: `${countryCode}${cleaned}`, countryCode };
}

export function normalizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const [localPart, domain] = trimmed.split('@');
  if (!localPart || !domain) return trimmed;
  
  const normalizedLocal = localPart.replace(/\./g, '').split('+')[0];
  return `${normalizedLocal}@${domain.toLowerCase()}`;
}

export function normalizeContact(
  mobile: string,
  countryCode: SupportedCallingCode,
  email: string
): NormalizedContact | null {
  const mobileResult = normalizeMobileNumber(mobile, countryCode);
  if (!mobileResult) return null;
  
  return {
    mobileNumber: mobileResult.normalized,
    countryCode: mobileResult.countryCode,
    email: normalizeEmail(email),
  };
}

export function formatMobileForDisplay(normalized: string, countryCode: SupportedCallingCode): string {
  if (countryCode === '+91' && normalized.length === 10) {
    return `+91 ${normalized.slice(0, 5)} ${normalized.slice(5)}`;
  }
  return `${countryCode} ${normalized}`;
}

export function areContactsEquivalent(
  contact1: NormalizedContact,
  contact2: NormalizedContact
): boolean {
  return contact1.mobileNumber === contact2.mobileNumber &&
         contact1.countryCode === contact2.countryCode &&
         contact1.email === contact2.email;
}

export function detectDuplicateRegistration(
  newContact: NormalizedContact,
  existingRegistrations: readonly {
    id: string;
    mobileNumber: string;
    countryCode: SupportedCallingCode;
    email: string;
    fullName: string;
    societyId: string;
  }[],
  currentSocietyId: string,
  excludeRegistrationId?: string
): DuplicateDetectionResult {
  const sameSocietyRegistrations = existingRegistrations.filter(
    (r) => r.societyId === currentSocietyId && r.id !== excludeRegistrationId
  );

  for (const existing of sameSocietyRegistrations) {
    const existingContact: NormalizedContact = {
      mobileNumber: existing.mobileNumber,
      countryCode: existing.countryCode,
      email: existing.email,
    };

    if (areContactsEquivalent(newContact, existingContact)) {
      return {
        hasDuplicate: true,
        duplicateType: 'EXACT_MATCH',
        existingRegistrationId: existing.id,
        existingRegistrationName: existing.fullName,
        existingSocietyId: existing.societyId,
        message: `An account with this mobile number and email already exists for ${existing.fullName}`,
        requiresManualReview: false,
      };
    }

    if (newContact.mobileNumber === existingContact.mobileNumber && 
        newContact.countryCode === existingContact.countryCode) {
      return {
        hasDuplicate: true,
        duplicateType: 'PHONE_MATCH',
        existingRegistrationId: existing.id,
        existingRegistrationName: existing.fullName,
        existingSocietyId: existing.societyId,
        message: `A registration with mobile ${formatMobileForDisplay(existing.mobileNumber, existing.countryCode)} already exists for ${existing.fullName}`,
        requiresManualReview: true,
      };
    }

    if (newContact.email === existingContact.email) {
      return {
        hasDuplicate: true,
        duplicateType: 'EMAIL_MATCH',
        existingRegistrationId: existing.id,
        existingRegistrationName: existing.fullName,
        existingSocietyId: existing.societyId,
        message: `A registration with email ${existing.email} already exists for ${existing.fullName}`,
        requiresManualReview: true,
      };
    }
  }

  const otherSocietyRegistrations = existingRegistrations.filter(
    (r) => r.societyId !== currentSocietyId
  );

  for (const existing of otherSocietyRegistrations) {
    const existingContact: NormalizedContact = {
      mobileNumber: existing.mobileNumber,
      countryCode: existing.countryCode,
      email: existing.email,
    };

    if (areContactsEquivalent(newContact, existingContact)) {
      return {
        hasDuplicate: true,
        duplicateType: 'EXACT_MATCH',
        existingRegistrationId: existing.id,
        existingRegistrationName: existing.fullName,
        existingSocietyId: existing.societyId,
        message: `This identity is already registered in ${existing.societyId}. You can add another residence to your existing account.`,
        requiresManualReview: false,
      };
    }

    if (newContact.mobileNumber === existingContact.mobileNumber && 
        newContact.countryCode === existingContact.countryCode) {
      return {
        hasDuplicate: true,
        duplicateType: 'PHONE_MATCH',
        existingRegistrationId: existing.id,
        existingRegistrationName: existing.fullName,
        existingSocietyId: existing.societyId,
        message: `Mobile ${formatMobileForDisplay(existing.mobileNumber, existing.countryCode)} is registered in ${existing.societyId} for ${existing.fullName}. Verify if this is the same person.`,
        requiresManualReview: true,
      };
    }
  }

  return {
    hasDuplicate: false,
    message: 'No duplicate found',
    requiresManualReview: false,
  };
}

export function isRecycledPhoneScenario(
  newContact: NormalizedContact,
  existingRegistration: {
    id: string;
    mobileNumber: string;
    countryCode: SupportedCallingCode;
    email: string;
    fullName: string;
    verifiedAt: string;
    societyMemberships: readonly { societyId: string; unitId: string }[];
  }
): boolean {
  if (newContact.mobileNumber !== existingRegistration.mobileNumber ||
      newContact.countryCode !== existingRegistration.countryCode ||
      newContact.email !== existingRegistration.email) {
    return false;
  }

  const nameDifferent = newContact.email.split('@')[0] !== existingRegistration.email.split('@')[0];
  
  return nameDifferent;
}