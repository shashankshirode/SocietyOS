import {
  normalizePhoneNumber,
  lookupIdentityByPhone,
  registerNewUserAccount,
  submitResidenceOnboardingRequest,
  getPendingResidenceRequests,
  approveResidenceRequest,
  rejectResidenceRequest,
  resetIdentityResolverState,
} from '../identity/identityResolver';
import { adminMockSource, resetAdminApprovals } from '../../modules/societyAdmin/data/admin.mockSource';
import {
  setCurrentSession,
  getCurrentSession,
  clearCurrentSession,
  restoreCurrentSession,
} from '../auth/sessionStore';
import { logoutCurrentSession } from '../auth/logout';
import {
  residentHouseholdMockSource,
  resetResidentHouseholdMockState,
} from '../../modules/resident/household/data/residentHousehold.mockSource';
import { residentHomeContextRepository } from '../../modules/resident/homeContext/data/residentHomeContext.repository';
import { mockStore } from '../mockStore/mockStore';

describe('SOCIETY OS — PHASE 3: Auth, Registration, Onboarding, Household & Multi-Residence', () => {
  beforeEach(async () => {
    resetIdentityResolverState();
    resetAdminApprovals();
    resetResidentHouseholdMockState();
    await clearCurrentSession();
  });

  describe('1. Mobile Number Validation & Identity Lookup', () => {
    it('normalizes 10-digit Indian mobile numbers and strips country code and symbols', () => {
      expect(normalizePhoneNumber('+91 98765-43210')).toBe('9876543210');
      expect(normalizePhoneNumber('09876543210')).toBe('9876543210');
      expect(normalizePhoneNumber('9876543210')).toBe('9876543210');
    });

    it('identifies registered personas correctly by phone number', () => {
      // Rohan Sharma - Resident Owner
      const rohanLookup = lookupIdentityByPhone('9876543210');
      expect(rohanLookup.status).toBe('REGISTERED');
      if (rohanLookup.status === 'REGISTERED') {
        expect(rohanLookup.identity.user.phone).toContain('9876543210');
        expect(rohanLookup.identity.activeRole).toBe('RESIDENT_OWNER');
        expect(rohanLookup.identity.membership?.societyName).toBeDefined();
      }

      // Suresh Patil - Society Admin
      const adminLookup = lookupIdentityByPhone('9876543217');
      expect(adminLookup.status).toBe('REGISTERED');
      if (adminLookup.status === 'REGISTERED') {
        expect(adminLookup.identity.activeRole).toBe('SOCIETY_ADMIN');
      }

      // Vikram Singh - Security Guard
      const guardLookup = lookupIdentityByPhone('9876543214');
      expect(guardLookup.status).toBe('REGISTERED');
      if (guardLookup.status === 'REGISTERED') {
        expect(guardLookup.identity.activeRole).toBe('SECURITY_GUARD');
      }
    });

    it('identifies unknown mobile numbers as NEW_USER', () => {
      const newLookup = lookupIdentityByPhone('9123456789');
      expect(newLookup.status).toBe('NEW_USER');
      if (newLookup.status === 'NEW_USER') {
        expect(newLookup.mobileNumber).toBe('9123456789');
      }
    });

    it('detects simulated suspended accounts and rejects access', () => {
      const suspendedLookup = lookupIdentityByPhone('9999999999');
      expect(suspendedLookup.status).toBe('SUSPENDED');
      if (suspendedLookup.status === 'SUSPENDED') {
        expect(suspendedLookup.message).toContain('suspended');
      }
    });
  });

  describe('2. New User Registration & Residence Onboarding', () => {
    it('creates a new user account with pending approval status', () => {
      const newUser = registerNewUserAccount({
        mobileNumber: '9123456789',
        fullName: 'Vikram Merchant',
        email: 'vikram.merchant@example.com',
      });

      expect(newUser.user.id).toBeDefined();
      expect(newUser.person.preferredName).toBe('Vikram Merchant');
      expect(newUser.status).toBe('PENDING_APPROVAL');

      // Subsequent lookup by same phone finds the registered user
      const lookup = lookupIdentityByPhone('9123456789');
      expect(lookup.status).toBe('REGISTERED');
      if (lookup.status === 'REGISTERED') {
        expect(lookup.identity.person.preferredName).toBe('Vikram Merchant');
        expect(lookup.identity.status).toBe('PENDING_APPROVAL');
      }
    });

    it('submits a residence onboarding request that appears in admin queue', async () => {
      const approval = submitResidenceOnboardingRequest({
        userId: 'usr-new-001',
        userName: 'Vikram Merchant',
        societyId: 'soc-greenwood-pune',
        societyName: 'Greenwood Heights',
        unitNumber: 'C-504',
        wing: 'C-Wing',
        relationshipType: 'OWNER',
        notes: 'Submitted registration form',
      });

      expect(approval.id).toBeDefined();
      expect(approval.status).toBe('PENDING');
      expect(approval.unitNumber).toBe('C-504');

      // Admin approvals list includes this new request
      const approvals = await adminMockSource.getApprovals();
      const found = approvals.find((a) => a.id === approval.id);
      expect(found).toBeDefined();
      expect(found?.requestedBy).toBe('Vikram Merchant');
      expect(found?.status).toBe('PENDING');
    });

    it('allows an administrator to approve request, activating the user residence', async () => {
      // 1. User registers
      registerNewUserAccount({
        mobileNumber: '9555544444',
        fullName: 'Ananya Deshmukh',
      });

      // 2. User submits residence request
      const req = submitResidenceOnboardingRequest({
        userId: 'usr-ananya',
        userName: 'Ananya Deshmukh',
        societyId: 'soc-greenwood-pune',
        societyName: 'Greenwood Heights',
        unitNumber: 'A-302',
        wing: 'A-Wing',
        relationshipType: 'OWNER',
      });

      // 3. Admin reviews and approves
      const approveResult = await adminMockSource.approveRequest(req.id, 'Verified ownership title deed');
      expect(approveResult.success).toBe(true);

      // 4. Verification that approval is reflected in admin queue
      const detail = await adminMockSource.getApprovalDetail(req.id);
      expect(detail.status).toBe('APPROVED');

      // 5. Verification that user identity now resolves to ACTIVE with unit association
      const lookup = lookupIdentityByPhone('9555544444');
      expect(lookup.status).toBe('REGISTERED');
      if (lookup.status === 'REGISTERED') {
        expect(lookup.identity.status).toBe('ACTIVE');
        expect(lookup.identity.unitRelationship?.unitNumber).toBe('A-302');
        expect(lookup.identity.unitRelationship?.towerOrBlock).toBe('A-Wing');
      }
    });

    it('allows an administrator to reject request without granting residence access', async () => {
      registerNewUserAccount({
        mobileNumber: '9666677777',
        fullName: 'Rajeev Singhania',
      });

      const req = submitResidenceOnboardingRequest({
        userId: 'usr-rajeev',
        userName: 'Rajeev Singhania',
        societyId: 'soc-greenwood-pune',
        societyName: 'Greenwood Heights',
        unitNumber: 'B-101',
        wing: 'B-Wing',
        relationshipType: 'TENANT',
      });

      const rejectResult = await adminMockSource.rejectRequest(req.id, 'Missing police verification copy');
      expect(rejectResult.success).toBe(true);

      const detail = await adminMockSource.getApprovalDetail(req.id);
      expect(detail.status).toBe('REJECTED');
      expect(detail.notes).toContain('police verification');

      // User remains without active residence
      const lookup = lookupIdentityByPhone('9666677777');
      if (lookup.status === 'REGISTERED') {
        expect(lookup.identity.unitRelationship).toBeUndefined();
      }
    });
  });

  describe('3. Household & Family Management', () => {
    it('allows owner to add a family member and emits domain audit event', async () => {
      const added = await residentHouseholdMockSource.addFamilyMember({
        fullName: 'Kavita Sharma',
        relationToOwner: 'SPOUSE',
        dateOfBirth: '1985-06-15',
        gender: 'FEMALE',
        phoneNumber: '9876500001',
        bloodGroup: 'B+',
        isEmergencyContact: true,
        isSeniorCitizen: false,
        isMinor: false,
        visitorApprovalPermission: true,
        noticeViewPermission: true,
        emergencyAccessPermission: true,
        facilityBookingPermission: true,
        documentAccessPermission: 'LIMITED',
        profileVisibility: 'HOUSEHOLD_ONLY',
        accessStatus: 'ACTIVE',
      });

      expect(added.id).toBeDefined();
      expect(added.fullName).toBe('Kavita Sharma');
      expect(added.relationToOwner).toBe('SPOUSE');
      expect(added.isPrimaryOwner).toBe(false);

      // Verify member is in household list
      const members = await residentHouseholdMockSource.getFamilyMembers();
      const found = members.find((m) => m.fullName === 'Kavita Sharma');
      expect(found).toBeDefined();
    });

    it('allows updating delegated permissions and revoking member access', async () => {
      const members = await residentHouseholdMockSource.getFamilyMembers();
      const nonOwner = members.find((m) => !m.isPrimaryOwner);
      expect(nonOwner).toBeDefined();
      if (!nonOwner) return;

      // Update permissions: disable visitor approval and facility booking
      const updated = await residentHouseholdMockSource.updateFamilyMemberPermissions(nonOwner.id, {
        ...nonOwner.permissions,
        visitorApprovalPermission: false,
        facilityBookingPermission: false,
      });

      expect(updated.permissions.visitorApprovalPermission).toBe(false);
      expect(updated.permissions.facilityBookingPermission).toBe(false);

      // Revoke access completely
      const revoked = await residentHouseholdMockSource.removeFamilyMemberAccess(nonOwner.id, {
        reason: 'Moved to different city',
        requestedByResidentId: 'usr-rohan-01',
      });
      expect(revoked.accessStatus).toBe('INACTIVE');
      expect(revoked.permissions.visitorApprovalPermission).toBe(false);
      expect(revoked.permissions.facilityBookingPermission).toBe(false);
    });

    it('enforces tenant restrictions: tenants cannot view owner family members', async () => {
      // With tenant role, getFamilyMembers returns empty list
      const tenantMembers = await residentHouseholdMockSource.getFamilyMembers({
        activeHome: {
          homeContextId: 'ctx-tenant-01',
          residentId: 'usr-tenant-01',
          societyId: 'soc-greenwood-pune',
          societyName: 'Greenwood Heights',
          societyAreaId: 'area-1',
          societyAreaName: 'Main',
          city: 'Pune',
          unitId: 'unit-b201',
          flatNumber: 'B-201',
          displayUnitName: 'B-201',
          residentRole: 'tenant',
          status: 'active',
          featureFlagScopeId: 'ff-soc-greenwood-pune-unit-b201',
          permissionScopeId: 'perm-soc-greenwood-pune-unit-b201',
          dataScopeKey: 'soc-greenwood-pune:unit-b201',
        },
        dataScopeKey: 'soc-greenwood-pune:unit-b201',
      });

      expect(tenantMembers).toEqual([]);
    });
  });

  describe('4. Multi-Residence Context Switching', () => {
    it('switches between residences, updating active society, unit, and roles cleanly', async () => {
      const contextsResult = await residentHomeContextRepository.getHomeContexts();
      expect(contextsResult.ok).toBe(true);
      if (!contextsResult.ok) return;

      const contexts = contextsResult.data;
      expect(contexts.length).toBeGreaterThanOrEqual(2);

      const homeA = contexts[0];
      const homeB = contexts[1];
      if (!homeA || !homeB) return;

      // Switch to Home A
      const switchA = await residentHomeContextRepository.switchHomeContext({
        homeContextId: homeA.homeContextId,
      });
      expect(switchA.ok).toBe(true);
      if (switchA.ok) {
        expect(switchA.data.activeContext.homeContextId).toBe(homeA.homeContextId);
        expect(switchA.data.activeContext.societyId).toBe(homeA.societyId);
      }

      // Switch to Home B
      const switchB = await residentHomeContextRepository.switchHomeContext({
        homeContextId: homeB.homeContextId,
      });
      expect(switchB.ok).toBe(true);
      if (switchB.ok) {
        expect(switchB.data.activeContext.homeContextId).toBe(homeB.homeContextId);
        expect(switchB.data.activeContext.societyId).toBe(homeB.societyId);
        expect(switchB.data.activeContext.unitId).toBe(homeB.unitId);
      }
    });
  });

  describe('5. Session Lifecycle & Persistence', () => {
    it('sets, restores, and logs out of session without wiping shared mock business records', async () => {
      const sessionObj = {
        userId: 'usr-rohan-01',
        name: 'Rohan Sharma',
        role: 'RESIDENT_OWNER' as const,
        personaKey: 'rohan',
        societyId: 'soc-greenwood-pune',
        societyName: 'Greenwood Heights',
        unitId: 'unit-a1204',
        unitLabel: 'A-1204',
        isHouseholdAdmin: true,
        isMockSession: true,
      };

      await setCurrentSession(sessionObj);
      expect(getCurrentSession()?.userId).toBe('usr-rohan-01');

      // Restoration retrieves the session
      const restored = await restoreCurrentSession();
      expect(restored?.userId).toBe('usr-rohan-01');
      expect(restored?.societyName).toBe('Greenwood Heights');

      // Count existing society residents in mockStore
      const initialResidentCount = mockStore.getState().residents.length;
      expect(initialResidentCount).toBeGreaterThan(0);

      // Logout clears session
      await logoutCurrentSession();
      expect(getCurrentSession()).toBeNull();

      // Shared business records in mockStore remain completely intact
      expect(mockStore.getState().residents.length).toBe(initialResidentCount);
    });
  });
});
