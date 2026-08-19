import type { PlatformDashboardMetrics, SuperAdminHomeData, SuperAdminUser } from '../types/platform.types';

export const mockSuperAdmin: SuperAdminUser = {
  id: 'super-admin-001',
  name: 'Platform Owner',
  role: 'SUPER_ADMIN',
  organizationId: 'platform-001',
  organizationName: 'Society OS Platform',
  email: 'platform.owner@example.com',
};

export const mockPlatformDashboardMetrics: PlatformDashboardMetrics = {
  totalSocieties: 20,
  activeSocieties: 14,
  onboardingSocieties: 4,
  suspendedSocietiesPlaceholder: 2,
  totalUnits: 6840,
  totalActiveUsers: 12450,
  monthlyActiveUsersPlaceholder: 8930,
  openSupportTickets: 12,
  criticalAlerts: 3,
  featureFlagsChangedThisWeek: 5,
  societiesWithDisabledBilling: 16,
  societiesUsingFreeLaunch: 14,
  moduleAdoptionScore: 72,
};

export const mockSuperAdminHome: SuperAdminHomeData = {
  platformName: 'Society OS Platform',
  currentAdmin: mockSuperAdmin,
  activeSocieties: 14,
  onboardingSocieties: 4,
  openSupportTickets: 12,
  criticalAlerts: 3,
  featureFlagChangesPending: 2,
  recentAuditActions: [],
};
