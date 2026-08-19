import * as React from 'react';
import type {
  FamilyMember,
  TenantAgreementInput,
  TenantEligibilityResult,
  TenantOnboardingRequest,
  TenantPersonalInfoInput,
} from '../data/residentHousehold.types';
import {
  validateTenantAgreement,
  validateTenantOnboardingForSubmit,
  validateTenantPersonalInfo,
} from '../validators/tenantOnboarding.validators';

export function useTenantOnboardingValidation(
  familyMembers: FamilyMember[],
  eligibility: TenantEligibilityResult,
  maxOccupancy: number,
) {
  const personalInfoValidator = React.useCallback(
    (input: TenantPersonalInfoInput) => validateTenantPersonalInfo(input, { familyMembers }),
    [familyMembers],
  );

  const agreementValidator = React.useCallback(
    (input: TenantAgreementInput) => validateTenantAgreement(input, { maxOccupancy }),
    [maxOccupancy],
  );

  const submitValidator = React.useCallback(
    (request: TenantOnboardingRequest) =>
      validateTenantOnboardingForSubmit(request, {
        familyMembers,
        eligibility,
        maxOccupancy,
        policeVerificationCanBePending: true,
        tenantOnboardingFeatureEnabled: true,
      }),
    [eligibility, familyMembers, maxOccupancy],
  );

  return {
    validatePersonalInfo: personalInfoValidator,
    validateAgreement: agreementValidator,
    validateSubmit: submitValidator,
  };
}

