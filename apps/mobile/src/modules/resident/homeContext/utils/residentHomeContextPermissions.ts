import type { AppRole } from '../../../../core/permissions/permission.types';
import type { ResidentHomeRole } from '../data/residentHomeContext.types';

export function mapContextRoleToAppRole(role: ResidentHomeRole): AppRole {
  switch (role) {
    case 'owner':
    case 'coOwner':
      return 'RESIDENT_OWNER';
    case 'tenant':
      return 'RESIDENT_TENANT';
    case 'familyMember':
    case 'authorizedOccupant':
      return 'RESIDENT_FAMILY';
    default:
      return 'RESIDENT_OWNER';
  }
}
