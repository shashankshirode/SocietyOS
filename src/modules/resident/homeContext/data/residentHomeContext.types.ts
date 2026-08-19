export type ResidentHomeRole =
  | 'owner'
  | 'coOwner'
  | 'tenant'
  | 'familyMember'
  | 'authorizedOccupant';

export type ResidentHomeStatus =
  | 'active'
  | 'pendingApproval'
  | 'accessRestricted'
  | 'moveOutPending'
  | 'inactive';

export type ResidentHomeFeatureCoverage =
  | 'full'
  | 'limited'
  | 'tenantFocused'
  | 'pending'
  | 'restricted';

export type ResidentHomeContext = {
  homeContextId: string;
  societyId: string;
  societyName: string;
  societyAreaId: string;
  societyAreaName: string;
  city: string;
  country?: string;
  locale?: string;
  timezone?: string;
  unitId: string;
  buildingName?: string;
  towerName?: string;
  wingName?: string;
  flatNumber: string;
  displayUnitName: string;
  residentRole: ResidentHomeRole;
  status: ResidentHomeStatus;
  isPrimary: boolean;
  isCurrent: boolean;
  pendingCount: number;
  unreadNotificationCount: number;
  activeVisitorCount: number;
  outstandingBillAmount?: number;
  featureFlagScopeId: string;
  permissionScopeId: string;
  isGuardianManaged?: boolean;
  featureCoverage: ResidentHomeFeatureCoverage;
  lastSwitchedAt?: string;
  effectiveFrom?: string;
};

export type ActiveResidentHomeContext = {
  homeContextId: string;
  residentId: string;
  societyId: string;
  societyName: string;
  societyAreaId: string;
  societyAreaName: string;
  city: string;
  country?: string;
  locale?: string;
  timezone?: string;
  unitId: string;
  flatNumber: string;
  displayUnitName: string;
  buildingName?: string;
  towerName?: string;
  wingName?: string;
  residentRole: ResidentHomeRole;
  status: ResidentHomeStatus;
  featureFlagScopeId: string;
  permissionScopeId: string;
  isGuardianManaged?: boolean;
  dataScopeKey: string;
  pendingCount?: number;
  effectiveFrom?: string;
};

export type SwitchResidentHomeInput = {
  homeContextId: string;
};

export type SwitchResidentHomeResult = {
  activeContext: ActiveResidentHomeContext;
  availableContexts: ResidentHomeContext[];
};

export type ResidentRepositoryRequestContext = {
  activeHome: ActiveResidentHomeContext;
  dataScopeKey: string;
};

export type ScopedRepositoryInput<TInput> = {
  context: ResidentRepositoryRequestContext;
  input: TInput;
};
