import {
  mockHouseholdOverview,
  mockTenantEligibilityBlockedByActiveTenant,
  mockTenantEligibilityBlockedByNoc,
  mockTenantOnboardingBlockedActiveTenant,
  mockTenantOnboardingDraft,
  mockTenantOnboardingSubmitted,
} from '../data/residentHousehold.mockData';

export const residentHouseholdScreenScenarios = {
  ownerOverview: mockHouseholdOverview,
  tenantOnboardingDraft: mockTenantOnboardingDraft,
  tenantOnboardingSubmitted: mockTenantOnboardingSubmitted,
  tenantBlockedByActiveTenant: mockTenantOnboardingBlockedActiveTenant,
  eligibilityBlockedByActiveTenant: mockTenantEligibilityBlockedByActiveTenant,
  eligibilityBlockedByPreviousNoc: mockTenantEligibilityBlockedByNoc,
} as const;

