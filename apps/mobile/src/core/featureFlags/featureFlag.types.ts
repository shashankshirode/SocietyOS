export type FeatureFlagsGrouped = {
  coreMvp: {
    visitorManagement: boolean;
    guardApp: boolean;
    complaints: boolean;
    notices: boolean;
    maintenanceBilling: boolean;
    documentVault: boolean;
    nocRequests: boolean;
    ownerTenantManagement: boolean;
    familyMemberManagement: boolean;
    tenantOnboarding: boolean;
    tenantDocumentUpload: boolean;
    tenantAccessPermissionManagement: boolean;
    staffManagement: boolean;
    attendanceBasic: boolean;
    societyOffice: boolean;
    treasurerDashboard: boolean;
    facilityDashboard: boolean;
  };
  advanced: {
    communityMarketplace: boolean;
    hardwareIntegrationReadiness: boolean;
    smartAutomation: boolean;
    advancedAnalytics: boolean;
  };
  commercialHidden: {
    subscriptionBillingUI: boolean;
    pricingPage: boolean;
    upgradePrompts: boolean;
  };
  realIntegrations: {
    realPayments: boolean;
    realNotifications: boolean;
    realFileUpload: boolean;
    realBiometricIntegration: boolean;
  };
};

export type { FeatureFlagKey } from './featureFlags';
