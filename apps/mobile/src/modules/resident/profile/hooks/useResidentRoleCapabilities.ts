import { useMemo } from 'react';
import { useAuthSession } from '../../../../core/auth/useAuthSession';
import {
  getResidentRoleCapabilityProfile,
  residentRoleCapabilities,
} from '../data/residentRoleCapabilities';
import type {
  ResidentRoleCapabilityProfile,
  ResidentRoleVariant,
} from '../data/residentRoleCapabilities.types';

function resolveResidentRole(role?: string): ResidentRoleVariant {
  if (role === 'RESIDENT_TENANT' || role === 'RESIDENT_FAMILY') {
    return role;
  }

  return 'RESIDENT_OWNER';
}

export function useResidentRoleCapabilities(
  roleOverride?: ResidentRoleVariant
): ResidentRoleCapabilityProfile {
  const { session } = useAuthSession();
  const resolvedRole = roleOverride ?? resolveResidentRole(session?.role);

  return useMemo(
    () => getResidentRoleCapabilityProfile(resolvedRole),
    [resolvedRole]
  );
}

export function useAllResidentRoleCapabilities() {
  return useMemo(() => residentRoleCapabilities, []);
}

