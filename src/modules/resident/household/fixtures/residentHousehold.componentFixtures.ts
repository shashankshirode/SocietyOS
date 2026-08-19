import {
  mockCurrentTenant,
  mockFamilyMembers,
  mockHouseholdOverview,
  mockTenantDocuments,
} from '../data/residentHousehold.mockData';

export const residentHouseholdComponentFixtures = {
  overview: mockHouseholdOverview,
  familyMembers: mockFamilyMembers,
  currentTenant: mockCurrentTenant,
  tenantDocuments: mockTenantDocuments,
} as const;

