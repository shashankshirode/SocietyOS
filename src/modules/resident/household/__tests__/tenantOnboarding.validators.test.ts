import {
  mockFamilyMembers,
  mockTenantEligibilityPassed,
  mockTenantOnboardingDraft,
} from '../data/residentHousehold.mockData';
import type { TenantAgreementInput } from '../data/residentHousehold.types';
import {
  validateTenantAgreement,
  validateTenantOnboardingForSubmit,
} from '../validators/tenantOnboarding.validators';

const validAgreement: TenantAgreementInput = {
  agreementStartDate: '2026-08-01',
  agreementEndDate: '2027-07-31',
  numberOfOccupants: 2,
  tenantMoveInDate: '2026-08-05',
  ownerApprovalConfirmed: true,
  rulesAcknowledgementRequired: true,
  rentAgreementDocumentId: 'doc-rent',
};

describe('tenant onboarding validators', () => {
  it('catches invalid agreement dates', () => {
    const result = validateTenantAgreement(
      { ...validAgreement, agreementEndDate: '2026-07-01' },
      { maxOccupancy: 4 },
    );

    expect(result.isValid).toBe(false);
    expect(result.fieldErrors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'agreementEndDate', messageKey: 'resident.validation.tenant.agreementEndAfterStart' }),
      ]),
    );
  });

  it('catches missing rent agreement document before submit', () => {
    const result = validateTenantOnboardingForSubmit(mockTenantOnboardingDraft, {
      familyMembers: mockFamilyMembers,
      eligibility: mockTenantEligibilityPassed,
      maxOccupancy: 6,
      policeVerificationCanBePending: true,
      tenantOnboardingFeatureEnabled: true,
    });

    expect(result.isValid).toBe(false);
    expect(result.fieldErrors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'documents', messageKey: 'resident.validation.tenant.rentAgreementDocumentRequired' }),
      ]),
    );
  });
});

