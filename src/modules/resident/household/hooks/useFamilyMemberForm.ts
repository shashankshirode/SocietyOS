import * as React from 'react';
import type { AddFamilyMemberInput, FamilyMember } from '../data/residentHousehold.types';
import {
  suggestFamilyAgeFlags,
  validateFamilyMemberInput,
  type FamilyMemberValidationResult,
} from '../validators/familyMember.validators';

export const defaultFamilyMemberFormInput: AddFamilyMemberInput = {
  fullName: '',
  dateOfBirth: '',
  gender: 'PREFER_NOT_TO_SAY',
  relationToOwner: 'OTHER',
  phoneNumber: '',
  emailAddress: '',
  isEmergencyContact: false,
  isSeniorCitizen: false,
  isMinor: false,
  bloodGroup: 'UNKNOWN',
  medicalNotes: '',
  visitorApprovalPermission: false,
  noticeViewPermission: true,
  emergencyAccessPermission: true,
  facilityBookingPermission: false,
  documentAccessPermission: 'NONE',
  profileVisibility: 'HOUSEHOLD_ONLY',
  accessStatus: 'ACTIVE',
};

export function useFamilyMemberForm(existingMembers: FamilyMember[], initialInput = defaultFamilyMemberFormInput) {
  const [input, setInput] = React.useState<AddFamilyMemberInput>(initialInput);
  const [validation, setValidation] = React.useState<FamilyMemberValidationResult>({
    isValid: true,
    fieldErrors: [],
  });

  React.useEffect(() => {
    setInput(initialInput);
  }, [initialInput]);

  const updateInput = React.useCallback((patch: Partial<AddFamilyMemberInput>) => {
    setInput((current) => {
      const next = { ...current, ...patch };
      if (patch.dateOfBirth !== undefined) {
        return { ...next, ...suggestFamilyAgeFlags(patch.dateOfBirth) };
      }
      return next;
    });
  }, []);

  const validate = React.useCallback(() => {
    const result = validateFamilyMemberInput(input, {
      existingMembers,
      phoneRequiredForAdults: true,
    });
    setValidation(result);
    return result;
  }, [existingMembers, input]);

  return {
    input,
    validation,
    updateInput,
    validate,
  };
}
