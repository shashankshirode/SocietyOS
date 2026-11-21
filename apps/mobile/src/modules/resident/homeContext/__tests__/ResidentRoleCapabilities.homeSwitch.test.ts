import { mapContextRoleToAppRole } from '../utils/residentHomeContextPermissions';

describe('ResidentRoleCapabilities switcher permissions', () => {
  it('correctly maps switcher roles to AppRoles', () => {
    expect(mapContextRoleToAppRole('owner')).toBe('RESIDENT_OWNER');
    expect(mapContextRoleToAppRole('coOwner')).toBe('RESIDENT_OWNER');
    expect(mapContextRoleToAppRole('tenant')).toBe('RESIDENT_TENANT');
    expect(mapContextRoleToAppRole('familyMember')).toBe('RESIDENT_FAMILY');
    expect(mapContextRoleToAppRole('authorizedOccupant')).toBe('RESIDENT_FAMILY');
  });
});
