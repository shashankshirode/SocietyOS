import type { ResidentCapabilityId } from '../models/ResidentCapability';

type ResidentFamilyCapabilityGrant = {
  permissionScopeId: string;
  capabilityIds: readonly ResidentCapabilityId[];
};

const residentFamilyCapabilityGrants: readonly ResidentFamilyCapabilityGrant[] = [
  {
    permissionScopeId: 'scope-gv-family',
    capabilityIds: [
      'resident.homeContext',
      'resident.visitors',
      'resident.complaints',
      'resident.notices',
      'resident.facilities',
      'resident.chat',
      'resident.residentConnect',
      'resident.emergency',
      'resident.settings',
      'resident.notifications',
    ],
  },
  {
    permissionScopeId: 'scope-guardian-managed',
    capabilityIds: [
      'resident.homeContext',
      'resident.notices',
      'resident.emergency',
      'resident.settings',
      'resident.notifications',
    ],
  },
];

export function hasOwnerConfiguredFamilyCapability(
  permissionScopeId: string,
  capabilityId: ResidentCapabilityId,
): boolean {
  return residentFamilyCapabilityGrants
    .find((grant) => grant.permissionScopeId === permissionScopeId)
    ?.capabilityIds.includes(capabilityId) ?? false;
}
