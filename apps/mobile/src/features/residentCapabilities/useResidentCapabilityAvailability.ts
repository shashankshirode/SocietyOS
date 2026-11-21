import { useCallback } from 'react';
import { useFeatureFlags } from '../../core/featureFlags/featureFlags';
import { hasPermission } from '../../core/permissions/permissionMatrix';
import { useActiveResidentHome } from '../../modules/resident/homeContext/hooks/useActiveResidentHome';
import { mapContextRoleToAppRole } from '../../modules/resident/homeContext/utils/residentHomeContextPermissions';
import { getResidentCapability } from './configuration/residentCapabilityRegistry';
import { hasOwnerConfiguredFamilyCapability } from './configuration/residentFamilyCapabilityGrants';
import type { ResidentCapabilityId } from './models/ResidentCapability';

export function useResidentCapabilityAvailability() {
  const { activeContext } = useActiveResidentHome();
  const { isEnabled } = useFeatureFlags();

  const getCapabilityAvailability = useCallback((capabilityId: ResidentCapabilityId): 'available' | 'featureDisabled' | 'restricted' => {
    const capability = getResidentCapability(capabilityId);
    const appRole = mapContextRoleToAppRole(activeContext.residentRole);
    const familyPermissionAllowed = !capability.ownerConfiguredFamilyPermissionRequired
      || (activeContext.residentRole !== 'familyMember' && activeContext.residentRole !== 'authorizedOccupant')
      || hasOwnerConfiguredFamilyCapability(activeContext.permissionScopeId, capability.id);

    if (!isEnabled(capability.requiredFeatureFlag)) return 'featureDisabled';
    return capability.allowedRoles.includes(activeContext.residentRole)
      && capability.allowedMembershipStatuses.includes(activeContext.status)
      && (capability.permission ? hasPermission([appRole], capability.permission) : true)
      && (!activeContext.isGuardianManaged || capability.guardianManagedAccessAllowed)
      && familyPermissionAllowed
      ? 'available'
      : 'restricted';
  }, [activeContext, isEnabled]);

  const canAccessCapability = useCallback(
    (capabilityId: ResidentCapabilityId) => getCapabilityAvailability(capabilityId) === 'available',
    [getCapabilityAvailability],
  );

  return { canAccessCapability, getCapabilityAvailability };
}
