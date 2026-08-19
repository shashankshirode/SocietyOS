import { residentCapabilityRegistry } from '../configuration/residentCapabilityRegistry';
import { residentRequiredScenarioMatrix } from '../models/ResidentScenario';
import { hasOwnerConfiguredFamilyCapability } from '../configuration/residentFamilyCapabilityGrants';
import { hasPermission } from '../../../core/permissions/permissionMatrix';

describe('residentCapabilityRegistry', () => {
  it('uses unique capability identifiers and routes', () => {
    const identifiers = residentCapabilityRegistry.map((capability) => capability.id);
    expect(new Set(identifiers).size).toBe(identifiers.length);
    expect(residentCapabilityRegistry.every((capability) => capability.route.length > 0)).toBe(true);
  });

  it('binds every capability to roles, a feature flag, a repository, actions, states, and the release scenario matrix', () => {
    residentCapabilityRegistry.forEach((capability) => {
      expect(capability.allowedRoles.length).toBeGreaterThan(0);
      expect(capability.requiredFeatureFlag.length).toBeGreaterThan(0);
      expect(capability.repository.length).toBeGreaterThan(0);
      expect(capability.supportedActions.length).toBeGreaterThan(0);
      expect(capability.supportedStates.length).toBeGreaterThan(0);
      expect(capability.requiredTests).toEqual(residentRequiredScenarioMatrix);
    });
  });

  it('keeps owner-sensitive capabilities unavailable to family and guardian-managed profiles', () => {
    const sensitiveIds = [
      'resident.household',
      'resident.familyPortability',
      'resident.rentalDeclaration',
      'resident.shortStay',
    ] as const;

    sensitiveIds.forEach((id) => {
      const capability = residentCapabilityRegistry.find((entry) => entry.id === id);
      expect(capability?.allowedRoles).not.toContain('familyMember');
      expect(capability?.allowedRoles).not.toContain('authorizedOccupant');
      expect(capability?.guardianManagedAccessAllowed).toBe(false);
    });
  });

  it('enforces residence-scoped owner grants for family and guardian-managed capabilities', () => {
    expect(hasOwnerConfiguredFamilyCapability('scope-gv-family', 'resident.visitors')).toBe(true);
    expect(hasOwnerConfiguredFamilyCapability('scope-gv-family', 'resident.billing')).toBe(false);
    expect(hasOwnerConfiguredFamilyCapability('scope-guardian-managed', 'resident.emergency')).toBe(true);
    expect(hasOwnerConfiguredFamilyCapability('scope-guardian-managed', 'resident.visitors')).toBe(false);
  });

  it('grants domestic-help viewing and management only to resident owner and tenant roles', () => {
    expect(hasPermission(['RESIDENT_OWNER'], 'DOMESTIC_HELP_VIEW')).toBe(true);
    expect(hasPermission(['RESIDENT_OWNER'], 'DOMESTIC_HELP_MANAGE')).toBe(true);
    expect(hasPermission(['RESIDENT_TENANT'], 'DOMESTIC_HELP_VIEW')).toBe(true);
    expect(hasPermission(['RESIDENT_TENANT'], 'DOMESTIC_HELP_MANAGE')).toBe(true);
    expect(hasPermission(['RESIDENT_FAMILY'], 'DOMESTIC_HELP_VIEW')).toBe(false);
  });
});
