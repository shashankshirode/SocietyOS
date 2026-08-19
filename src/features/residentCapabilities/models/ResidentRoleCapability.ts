import type { ResidentHomeRole, ResidentHomeStatus } from '../../../modules/resident/homeContext/data/residentHomeContext.types';

export type ResidentCapabilityAudience = ResidentHomeRole | 'guardianManagedChild';

export type ResidentRoleCapability = {
  allowedRoles: readonly ResidentCapabilityAudience[];
  allowedMembershipStatuses: readonly ResidentHomeStatus[];
  ownerConfiguredFamilyPermissionRequired: boolean;
  guardianManagedAccessAllowed: boolean;
};
