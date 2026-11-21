import type { ResidentHouseholdRepository } from './residentHousehold.repository.types';

function notImplemented(): Promise<never> {
  return Promise.reject(new Error('resident.household.errors.apiSourceNotImplemented'));
}

export const residentHouseholdApiSource: ResidentHouseholdRepository = {
  getHouseholdOverview: notImplemented,
  getFamilyMembers: notImplemented,
  getFamilyMemberById: notImplemented,
  addFamilyMember: notImplemented,
  updateFamilyMember: notImplemented,
  updateFamilyMemberPermissions: notImplemented,
  removeFamilyMemberAccess: notImplemented,
  getTenantManagementSummary: notImplemented,
  runTenantEligibilityCheck: notImplemented,
  createTenantOnboardingDraft: notImplemented,
  updateTenantPersonalInfo: notImplemented,
  updateTenantAgreementInfo: notImplemented,
  uploadTenantDocumentMock: notImplemented,
  updateTenantAccessPermissions: notImplemented,
  submitTenantOnboardingRequest: notImplemented,
  getTenantOnboardingRequestById: notImplemented,
  getCurrentTenant: notImplemented,
  getTenantById: notImplemented,
  cancelTenantOnboardingRequest: notImplemented,
  initiateTenantExit: notImplemented,
  completeTenantExit: notImplemented,
};

