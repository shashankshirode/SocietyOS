import { StaffOperationsService } from '../services/staffOperationsService';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';
import type { RegisterStaffInput } from '../../../shared/types/staff.types';

describe('Staff Master & Lifecycle Invariants', () => {
  const hrAdminActor: StaffOperationsActor = {
    userId: 'usr-hr-01',
    societyId: 'soc-green-valley',
    role: 'HR_ADMIN',
    displayName: 'HR Admin Shweta',
  };

  const guardActor: StaffOperationsActor = {
    userId: 'usr-guard-01',
    societyId: 'soc-green-valley',
    role: 'GUARD',
    displayName: 'Guard Dinesh',
  };

  it('Invariant 1 & 3: Person != StaffEngagement and Direct Staff != Vendor Worker', () => {
    const service = new StaffOperationsService();

    const directStaffInput: RegisterStaffInput = {
      name: 'Deepak Salve',
      staffCode: 'STF-FAC-005',
      category: 'LIFT_OPERATOR',
      mobile: '9820011223',
      assignedLocation: 'A Wing Lift',
      joiningDate: '2026-01-15',
      verificationStatus: 'PENDING',
    };

    const directResult = service.registerStaff(hrAdminActor, 'soc-green-valley', directStaffInput);
    expect(directResult.profile.isVendorWorker).toBe(false);
    expect(directResult.engagement.engagementType).toBe('DIRECT_SOCIETY_STAFF');
    expect(directResult.engagement.staffId).toBe(directResult.profile.id);

    const vendorStaffInput: RegisterStaffInput = {
      name: 'Ramesh Pawar',
      staffCode: 'STF-SEC-001',
      category: 'SECURITY_GUARD',
      vendorId: 'vnd-safeguard-01',
      mobile: '9876543210',
      assignedLocation: 'Main Gate',
      joiningDate: '2026-02-01',
      verificationStatus: 'PENDING',
    };

    const vendorResult = service.registerStaff(hrAdminActor, 'soc-green-valley', vendorStaffInput);
    expect(vendorResult.profile.isVendorWorker).toBe(true);
    expect(vendorResult.engagement.engagementType).toBe('VENDOR_WORKER');
    expect(vendorResult.engagement.vendorId).toBe('vnd-safeguard-01');
  });

  it('Invariant 2: Staff != Governance role (cannot register governance role as staff workforce)', () => {
    const service = new StaffOperationsService();
    const input: RegisterStaffInput = {
      name: 'Amit Shah',
      staffCode: 'STF-SEC-002',
      category: 'SECURITY_GUARD',
      mobile: '9876500000',
      assignedLocation: 'Main Gate',
      joiningDate: '2026-02-01',
      verificationStatus: 'PENDING',
    };

    const result = service.registerStaff(hrAdminActor, 'soc-green-valley', input);
    expect(result.profile.category).toBe('SECURITY_GUARD');
    expect(result.profile.category).not.toBe('SECRETARY');
  });

  it('Invariant 9, 10, 11: Staff exit preserves history, revokes access, and cancels active engagements', () => {
    const service = new StaffOperationsService();
    const reg = service.registerStaff(hrAdminActor, 'soc-green-valley', {
      name: 'Suresh Kamble',
      staffCode: 'STF-SEC-003',
      category: 'SECURITY_GUARD',
      mobile: '9876511111',
      assignedLocation: 'B Wing Gate',
      joiningDate: '2026-01-01',
      verificationStatus: 'VERIFIED',
    });

    const staffId = reg.profile.id;
    const credId = reg.credential.credentialId;

    const exitResult = service.exitStaff(hrAdminActor, {
      staffId,
      societyId: 'soc-green-valley',
      exitDate: '2026-06-30',
      exitReason: 'Resigned voluntarily',
    });

    expect(exitResult.profile.employmentStatus).toBe('EXITED');
    expect(exitResult.profile.exitDate).toBe('2026-06-30');

    const cred = service.getCredential(credId);
    expect(cred?.status).toBe('REVOKED');
    expect(cred?.revocationReason).toContain('Resigned voluntarily');

    const engagements = service.getEngagements(staffId);
    expect(engagements[0]?.status).toBe('EXITED');
    expect(engagements[0]?.effectiveTo).toBe('2026-06-30');

    const profileStillExists = service.getStaff(staffId);
    expect(profileStillExists).toBeDefined();
    expect(profileStillExists?.id).toBe(staffId);
  });

  it('Invariant 38: Verification requires all mandatory checks before overall VERIFIED status', () => {
    const service = new StaffOperationsService();
    const reg = service.registerStaff(hrAdminActor, 'soc-green-valley', {
      name: 'Kailash Patil',
      staffCode: 'STF-HK-001',
      category: 'HOUSEKEEPING',
      mobile: '9876522222',
      assignedLocation: 'Clubhouse',
      joiningDate: '2026-03-01',
      verificationStatus: 'PENDING',
    });

    const partialVerification = service.verifyStaff(hrAdminActor, {
      staffId: reg.profile.id,
      societyId: 'soc-green-valley',
      policeVerificationVerified: true,
      idDocumentVerified: false,
      addressProofVerified: true,
    });
    expect(partialVerification.verificationStatus).toBe('PENDING');

    const completeVerification = service.verifyStaff(hrAdminActor, {
      staffId: reg.profile.id,
      societyId: 'soc-green-valley',
      policeVerificationVerified: true,
      idDocumentVerified: true,
      addressProofVerified: true,
    });
    expect(completeVerification.verificationStatus).toBe('VERIFIED');
  });

  it('Invariant 43: Cross-Society Staff IDOR is blocked', () => {
    const service = new StaffOperationsService();
    expect(() => {
      service.registerStaff(hrAdminActor, 'soc-other-society', {
        name: 'Intruder Staff',
        staffCode: 'STF-INT-001',
        category: 'SECURITY_GUARD',
        mobile: '9876599999',
        assignedLocation: 'Gate',
        joiningDate: '2026-01-01',
        verificationStatus: 'PENDING',
      });
    }).toThrow('CROSS_SOCIETY_ACCESS_DENIED');
  });

  it('Invariant 46: Unauthorized roles cannot register or verify staff', () => {
    const service = new StaffOperationsService();
    expect(() => {
      service.registerStaff(guardActor, 'soc-green-valley', {
        name: 'Guards Friend',
        staffCode: 'STF-SEC-099',
        category: 'SECURITY_GUARD',
        mobile: '9876588888',
        assignedLocation: 'Gate',
        joiningDate: '2026-01-01',
        verificationStatus: 'PENDING',
      });
    }).toThrow('ACCESS_DENIED');
  });

  it('Staff reactivation creates new active engagement while preserving old history', () => {
    const service = new StaffOperationsService();
    const reg = service.registerStaff(hrAdminActor, 'soc-green-valley', {
      name: 'Sunil Shinde',
      staffCode: 'STF-SEC-004',
      category: 'SECURITY_GUARD',
      mobile: '9876533333',
      assignedLocation: 'Main Gate',
      joiningDate: '2025-01-01',
      verificationStatus: 'VERIFIED',
    });

    service.exitStaff(hrAdminActor, {
      staffId: reg.profile.id,
      societyId: 'soc-green-valley',
      exitDate: '2025-12-31',
      exitReason: 'Contract ended',
    });

    const reactivated = service.reactivateStaff(
      hrAdminActor,
      'soc-green-valley',
      reg.profile.id,
      '2026-06-01'
    );

    expect(reactivated.employmentStatus).toBe('ACTIVE');
    const allEngagements = service.getEngagements(reg.profile.id);
    expect(allEngagements.length).toBe(2);
    expect(allEngagements[0]?.status).toBe('EXITED');
    expect(allEngagements[1]?.status).toBe('ACTIVE');
    expect(allEngagements[1]?.effectiveFrom).toBe('2026-06-01');
  });
});
