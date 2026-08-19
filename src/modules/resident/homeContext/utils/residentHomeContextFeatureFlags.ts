import type { ActiveResidentHomeContext } from '../data/residentHomeContext.types';

export enum ResidentHomeFeatureFlag {
  MaintenanceBilling = 'maintenanceBilling',
  OwnerTenantManagement = 'ownerTenantManagement',
  FamilyMemberManagement = 'familyMemberManagement',
  TenantOnboarding = 'tenantOnboarding',
  TenantAccessPermissionManagement = 'tenantAccessPermissionManagement',
  OwnerTenantHistory = 'ownerTenantHistory',
  OccupancyHistory = 'occupancyHistory',
  ResidentDocumentArchive = 'residentDocumentArchive',
  FamilyPortability = 'familyPortability',
  RentalDeclaration = 'rentalDeclaration',
  ShortStayManagement = 'shortStayManagement',
  VisitorManagement = 'visitorManagement',
  DocumentVault = 'documentVault',
  NocRequests = 'nocRequests',
  FacilityBooking = 'facilityBooking',
  ParkingVehicles = 'parkingVehicles',
  ResidentMessenger = 'residentMessenger',
  MarketplaceListings = 'marketplaceListings',
  Governance = 'governance',
  CommunityMarketplace = 'communityMarketplace',
  MarketplaceModeration = 'marketplaceModeration',
}

const ownerOnlyFlags: readonly ResidentHomeFeatureFlag[] = [
  ResidentHomeFeatureFlag.MaintenanceBilling,
  ResidentHomeFeatureFlag.OwnerTenantManagement,
  ResidentHomeFeatureFlag.FamilyMemberManagement,
  ResidentHomeFeatureFlag.TenantOnboarding,
  ResidentHomeFeatureFlag.TenantAccessPermissionManagement,
  ResidentHomeFeatureFlag.OwnerTenantHistory,
  ResidentHomeFeatureFlag.OccupancyHistory,
  ResidentHomeFeatureFlag.ResidentDocumentArchive,
  ResidentHomeFeatureFlag.FamilyPortability,
  ResidentHomeFeatureFlag.RentalDeclaration,
  ResidentHomeFeatureFlag.ShortStayManagement,
];

const sensitiveFlags: readonly ResidentHomeFeatureFlag[] = [
  ...ownerOnlyFlags,
  ResidentHomeFeatureFlag.VisitorManagement,
  ResidentHomeFeatureFlag.DocumentVault,
  ResidentHomeFeatureFlag.NocRequests,
  ResidentHomeFeatureFlag.FacilityBooking,
  ResidentHomeFeatureFlag.ParkingVehicles,
  ResidentHomeFeatureFlag.ResidentMessenger,
  ResidentHomeFeatureFlag.MarketplaceListings,
  ResidentHomeFeatureFlag.Governance,
];

export function getResidentHomeFeatureFlagOverrides(
  activeHome: ActiveResidentHomeContext
): Partial<Record<ResidentHomeFeatureFlag, boolean>> {
  const overrides: Partial<Record<ResidentHomeFeatureFlag, boolean>> = {};

  if (activeHome.status === 'pendingApproval') {
    sensitiveFlags.forEach((flag) => {
      overrides[flag] = false;
    });
    return overrides;
  }

  if (activeHome.status === 'accessRestricted') {
    overrides.visitorManagement = false;
    overrides.facilityBooking = false;
  }

  if (activeHome.residentRole === 'familyMember' || activeHome.residentRole === 'authorizedOccupant') {
    ownerOnlyFlags.forEach((flag) => {
      overrides[flag] = false;
    });
    overrides.documentVault = false;
    overrides.nocRequests = false;
  }

  if (activeHome.residentRole === 'tenant') {
    overrides.familyMemberManagement = false;
    overrides.ownerTenantManagement = false;
    overrides.ownerTenantHistory = false;
    overrides.familyPortability = false;
    overrides.rentalDeclaration = false;
    overrides.shortStayManagement = false;
  }

  if (activeHome.featureFlagScopeId === 'scope-gp') {
    overrides.communityMarketplace = false;
    overrides.marketplaceModeration = false;
  }

  overrides.shortStayManagement = activeHome.featureFlagScopeId === 'scope-gv' && (activeHome.residentRole === 'owner' || activeHome.residentRole === 'coOwner');

  return overrides;
}
