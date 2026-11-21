



import { useMemo } from 'react';
import type { SosPermission } from '../data/sosResponsePlan.types';
import { SOS_PERMISSIONS_BY_ROLE } from '../data/sosResponsePlan.types';
import { useSosResidenceContext } from './useSosResidenceContext';

export interface UseSosPermissionsResult {
  permissions: SosPermission[];
  hasPermission: (permission: SosPermission) => boolean;
  canTrigger: boolean;
  canManagePlans: boolean;
  canManageContacts: boolean;
  canRunTest: boolean;
}

export function useSosPermissions(): UseSosPermissionsResult {
  const context = useSosResidenceContext();

  return useMemo(() => {
    const role = context?.residentRole ?? 'familyMember';
    const permissions = SOS_PERMISSIONS_BY_ROLE[role] ?? [];
    const permSet = new Set(permissions);

    return {
      permissions,
      hasPermission: (perm: SosPermission) => permSet.has(perm),
      canTrigger: permSet.has('triggerSos'),
      canManagePlans: permSet.has('editResponsePlans'),
      canManageContacts: permSet.has('manageEmergencyContacts'),
      canRunTest: permSet.has('triggerTestSos'),
    };
  }, [context?.residentRole]);
}
