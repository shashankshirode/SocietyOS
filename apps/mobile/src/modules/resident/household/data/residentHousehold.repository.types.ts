import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type {
  AddFamilyMemberInput,
  CancelTenantOnboardingInput,
  FamilyMember,
  HouseholdOverview,
  RemoveFamilyMemberAccessInput,
  SubmitTenantOnboardingInput,
  TenantAccessPermissionsInput,
  TenantAgreementInput,
  TenantEligibilityResult,
  TenantManagementSummary,
  TenantOnboardingRequest,
  TenantPersonalInfoInput,
  TenantProfile,
  UpdateFamilyAccessPermissionsInput,
  UpdateFamilyMemberInput,
  UploadTenantDocumentInput,
} from './residentHousehold.types';

export type ResidentHouseholdRepository = {
  getHouseholdOverview: (context?: ResidentRepositoryRequestContext) => Promise<HouseholdOverview>;
  getFamilyMembers: (context?: ResidentRepositoryRequestContext) => Promise<FamilyMember[]>;
  getFamilyMemberById: (familyMemberId: string) => Promise<FamilyMember>;
  addFamilyMember: (input: AddFamilyMemberInput) => Promise<FamilyMember>;
  updateFamilyMember: (familyMemberId: string, input: UpdateFamilyMemberInput) => Promise<FamilyMember>;
  updateFamilyMemberPermissions: (
    familyMemberId: string,
    input: UpdateFamilyAccessPermissionsInput,
  ) => Promise<FamilyMember>;
  removeFamilyMemberAccess: (
    familyMemberId: string,
    input: RemoveFamilyMemberAccessInput,
  ) => Promise<FamilyMember>;
  getTenantManagementSummary: (context?: ResidentRepositoryRequestContext) => Promise<TenantManagementSummary>;
  runTenantEligibilityCheck: () => Promise<TenantEligibilityResult>;
  createTenantOnboardingDraft: () => Promise<TenantOnboardingRequest>;
  updateTenantPersonalInfo: (
    requestId: string,
    input: TenantPersonalInfoInput,
  ) => Promise<TenantOnboardingRequest>;
  updateTenantAgreementInfo: (
    requestId: string,
    input: TenantAgreementInput,
  ) => Promise<TenantOnboardingRequest>;
  uploadTenantDocumentMock: (
    requestId: string,
    input: UploadTenantDocumentInput,
  ) => Promise<TenantOnboardingRequest>;
  updateTenantAccessPermissions: (
    requestId: string,
    input: TenantAccessPermissionsInput,
  ) => Promise<TenantOnboardingRequest>;
  submitTenantOnboardingRequest: (
    requestId: string,
    input: SubmitTenantOnboardingInput,
  ) => Promise<TenantOnboardingRequest>;
  getTenantOnboardingRequestById: (requestId: string) => Promise<TenantOnboardingRequest>;
  getCurrentTenant: () => Promise<TenantProfile | null>;
  getTenantById: (tenantId: string) => Promise<TenantProfile>;
  cancelTenantOnboardingRequest: (
    requestId: string,
    input: CancelTenantOnboardingInput,
  ) => Promise<TenantOnboardingRequest>;
  initiateTenantExit: () => Promise<void>;
  completeTenantExit: () => Promise<void>;
};

