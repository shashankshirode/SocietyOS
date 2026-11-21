import type { PrerequisiteRuntimeContext } from '../../../../shared/prerequisites';

export const residentPrerequisiteScenarios = {
  missingBill: {
    featureEnabled: true,
    currentBillExists: false,
    billPublished: false,
    outstandingAmountExists: false,
    paymentMethodsConfigured: true,
    permissionEnabled: true,
  },
  tenantBlockedByPreviousNoc: {
    currentResidentIsOwner: true,
    ownerProfileActive: true,
    activeTenantExists: false,
    previousTenantNocCompleted: false,
    rentAgreementAvailable: true,
  },
  restrictedDocument: {
    featureEnabled: true,
    documentPermissionEnabled: false,
  },
  missingWeatherArea: {
    activeSocietyAreaExists: false,
    weatherSnapshotExists: false,
    localAdvisoryFeedAvailable: false,
  },
} satisfies Record<string, PrerequisiteRuntimeContext>;
