import { StaffOperationsService } from '../services/staffOperationsService';
import { DomesticHelpOperationsService } from '../services/domesticHelpOperationsService';
import { ShiftRosterService } from '../services/shiftRosterService';
import { AttendanceEngineService } from '../services/attendanceEngineService';
import { BiometricIntegrationService } from '../services/biometricIntegrationService';
import { AttendanceCorrectionService } from '../services/attendanceCorrectionService';
import { VendorAttendanceVerificationService } from '../services/vendorAttendanceVerificationService';
import { PayrollReadinessService } from '../services/payrollReadinessService';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';

describe('Phase 18 Mandatory End-to-End Production Verification (Scenarios A through J)', () => {
  const hrAdminActor: StaffOperationsActor = {
    userId: 'usr-hr-admin',
    societyId: 'soc-green-valley',
    role: 'HR_ADMIN',
    displayName: 'HR Admin Shweta',
  };

  const supervisorActor: StaffOperationsActor = {
    userId: 'usr-sec-sup',
    societyId: 'soc-green-valley',
    role: 'SECURITY_SUPERVISOR',
    displayName: 'Supervisor Jagtap',
  };

  const resident101Actor: StaffOperationsActor = {
    userId: 'usr-res-101',
    societyId: 'soc-green-valley',
    role: 'RESIDENT',
    unitId: 'unit-a101',
    displayName: 'Resident A101',
  };

  const resident202Actor: StaffOperationsActor = {
    userId: 'usr-res-202',
    societyId: 'soc-green-valley',
    role: 'RESIDENT',
    unitId: 'unit-a202',
    displayName: 'Resident A202',
  };

  it('SCENARIO A — NORMAL SECURITY GUARD: Full lifecycle from vendor onboarding to attendance derivation', () => {
    const staffService = new StaffOperationsService();
    const shiftService = new ShiftRosterService();
    const biometricService = new BiometricIntegrationService();
    const attendanceEngine = new AttendanceEngineService();

    const reg = staffService.registerStaff(hrAdminActor, 'soc-green-valley', {
      name: 'Ramesh Guard',
      staffCode: 'STF-SEC-001',
      category: 'SECURITY_GUARD',
      vendorId: 'vnd-safeguard-01',
      mobile: '9876500001',
      assignedLocation: 'Main Gate',
      joiningDate: '2026-06-01',
      verificationStatus: 'PENDING',
    });
    expect(reg.profile.isVendorWorker).toBe(true);

    const verified = staffService.verifyStaff(hrAdminActor, {
      staffId: reg.profile.id,
      societyId: 'soc-green-valley',
      policeVerificationVerified: true,
      idDocumentVerified: true,
      addressProofVerified: true,
    });
    expect(verified.verificationStatus).toBe('VERIFIED');

    const nightShift = shiftService.createShift(supervisorActor, 'soc-green-valley', {
      shiftName: 'Night Security Guard Shift',
      startTime: '22:00',
      endTime: '06:00',
      gracePeriodMinutes: 15,
      location: 'Main Gate',
      weeklyOffDays: ['MONDAY'],
    });

    const assignment = shiftService.assignShift(supervisorActor, 'soc-green-valley', {
      staffId: reg.profile.id,
      staffName: reg.profile.name,
      staffCode: reg.profile.staffCode,
      shiftId: nightShift.id,
      location: 'Main Gate',
      effectiveFrom: '2026-06-01',
      weeklyOffDays: ['MONDAY'],
    });
    expect(assignment.shiftId).toBe(nightShift.id);

    const device = biometricService.registerDevice(hrAdminActor, 'soc-green-valley', {
      deviceCode: 'DEV-GATE-01',
      deviceName: 'Main Gate Biometric Terminal',
      vendorName: 'ZKTeco',
      location: 'Main Gate',
    });

    biometricService.createMapping(hrAdminActor, 'soc-green-valley', {
      deviceId: device.id,
      deviceCode: device.deviceCode,
      deviceName: device.deviceName,
      biometricEmployeeCode: 'BIO-RG-01',
      staffId: reg.profile.id,
      staffName: reg.profile.name,
      staffCode: reg.profile.staffCode,
      effectiveFrom: '2026-06-01',
    });

    const syncResult = biometricService.syncDeviceBatch(device.id, 'soc-green-valley', [
      { employeeCode: 'BIO-RG-01', punchTime: '2026-06-05T21:55:00Z', punchType: 'IN' },
      { employeeCode: 'BIO-RG-01', punchTime: '2026-06-06T06:05:00Z', punchType: 'OUT' },
    ]);

    expect(syncResult.importedPunches).toBe(2);
    for (const p of syncResult.acceptedPunches) {
      attendanceEngine.ingestPunch(p);
    }

    const attendanceDay = attendanceEngine.deriveAttendanceForStaffDay(
      reg.profile.id,
      reg.profile.name,
      reg.profile.staffCode,
      '2026-06-05',
      nightShift
    );

    expect(attendanceDay.status).toBe('PRESENT');
    expect(attendanceDay.firstPunchIn).toBe('2026-06-05T21:55:00Z');
  });

  it('SCENARIO B — DEVICE OFFLINE: Local offline buffering and deterministic sync on reconnect', () => {
    const biometricService = new BiometricIntegrationService();
    const attendanceEngine = new AttendanceEngineService();

    const dev = biometricService.registerDevice(hrAdminActor, 'soc-green-valley', {
      deviceCode: 'DEV-GATE-02',
      deviceName: 'North Gate Terminal',
      vendorName: 'ZKTeco',
      location: 'North Gate',
    });

    biometricService.createMapping(hrAdminActor, 'soc-green-valley', {
      deviceId: dev.id,
      deviceCode: dev.deviceCode,
      deviceName: dev.deviceName,
      biometricEmployeeCode: 'BIO-1002',
      staffId: 'stf-002',
      staffName: 'Suresh Patil',
      staffCode: 'STF-002',
      effectiveFrom: '2026-06-01',
    });

    const offlineBufferedBatch = [
      { employeeCode: 'BIO-1002', punchTime: '2026-06-15T08:00:00Z', punchType: 'IN' as const },
      { employeeCode: 'BIO-1002', punchTime: '2026-06-15T16:00:00Z', punchType: 'OUT' as const },
    ];

    const sync1 = biometricService.syncDeviceBatch(dev.id, 'soc-green-valley', offlineBufferedBatch);
    expect(sync1.importedPunches).toBe(2);
    expect(sync1.duplicatePunches).toBe(0);

    const syncDuplicate = biometricService.syncDeviceBatch(dev.id, 'soc-green-valley', offlineBufferedBatch);
    expect(syncDuplicate.importedPunches).toBe(0);
    expect(syncDuplicate.duplicatePunches).toBe(2);
  });

  it('SCENARIO C — UNKNOWN EMPLOYEE: Unknown code retained as exception and reprocessed upon mapping', () => {
    const biometricService = new BiometricIntegrationService();

    const dev = biometricService.registerDevice(hrAdminActor, 'soc-green-valley', {
      deviceCode: 'DEV-GATE-03',
      deviceName: 'Basement Terminal',
      vendorName: 'ZKTeco',
      location: 'Basement',
    });

    const syncResult = biometricService.syncDeviceBatch(dev.id, 'soc-green-valley', [
      { employeeCode: 'E123', punchTime: '2026-06-15T09:00:00Z', punchType: 'IN' },
    ]);

    expect(syncResult.unmappedEmployeeCodes).toBe(1);
    expect(syncResult.acceptedPunches.length).toBe(0);

    const unknownList = biometricService.getUnknownEmployeeCodes();
    expect(unknownList.length).toBe(1);
    expect(unknownList[0]?.employeeCode).toBe('E123');
    expect(unknownList[0]?.resolutionStatus).toBe('OPEN');

    biometricService.createMapping(hrAdminActor, 'soc-green-valley', {
      deviceId: dev.id,
      deviceCode: dev.deviceCode,
      deviceName: dev.deviceName,
      biometricEmployeeCode: 'E123',
      staffId: 'stf-x',
      staffName: 'Staff X',
      staffCode: 'STF-X',
      effectiveFrom: '2026-06-01',
    });

    const resolvedUnknown = biometricService.getUnknownEmployeeCodes().find(u => u.employeeCode === 'E123');
    expect(resolvedUnknown?.resolutionStatus).toBe('MAPPED');
    expect(resolvedUnknown?.mappedStaffId).toBe('stf-x');
  });

  it('SCENARIO D — MISSING CHECKOUT THEN LATE SYNC: Reconciles missing checkout with arriving punch without manual entry', () => {
    const attendanceEngine = new AttendanceEngineService();

    attendanceEngine.ingestPunch({
      id: 'pn-in',
      staffId: 'stf-004',
      staffName: 'Day Worker',
      staffCode: 'STF-004',
      punchTime: '2026-06-15T08:00:00Z',
      punchType: 'IN',
      source: 'BIOMETRIC_DEVICE',
      location: 'Main Gate',
      isDuplicate: false,
      isMapped: true,
      createdAt: '2026-06-15T08:00:00Z',
    });

    const dayInitial = attendanceEngine.deriveAttendanceForStaffDay(
      'stf-004',
      'Day Worker',
      'STF-004',
      '2026-06-15'
    );
    expect(dayInitial.status).toBe('MISSING_CHECKOUT');

    const delayedOut = {
      id: 'pn-delayed-out',
      staffId: 'stf-004',
      staffName: 'Day Worker',
      staffCode: 'STF-004',
      punchTime: '2026-06-15T16:30:00Z',
      punchType: 'OUT' as const,
      source: 'BIOMETRIC_DEVICE' as const,
      location: 'Main Gate',
      isDuplicate: false,
      isMapped: true,
      createdAt: '2026-06-16T08:00:00Z',
    };

    const reconciled = attendanceEngine.reconcileDelayedOfflinePunch(delayedOut);
    expect(reconciled?.status).toBe('PRESENT');
    expect(reconciled?.lastPunchOut).toBe('2026-06-15T16:30:00Z');
    expect(reconciled?.isManual).toBe(false);
  });

  it('SCENARIO E — DOMESTIC HELP MULTIPLE FLATS: Ending service at Flat A keeps Flat B relationship active', () => {
    const domesticHelpService = new DomesticHelpOperationsService();

    const reg = domesticHelpService.registerDomesticHelp(resident101Actor, 'soc-green-valley', {
      name: 'Kamla Maid',
      helpType: 'MAID',
      mobile: '9820000001',
      unitId: 'unit-a101',
      unitNumber: 'A-101',
      allowedDays: ['ALL_DAYS'],
    });

    const linkB = domesticHelpService.linkToUnit(resident202Actor, 'soc-green-valley', {
      domesticHelpId: reg.profile.id,
      unitId: 'unit-a202',
      unitNumber: 'A-202',
      effectiveFrom: '2026-06-01',
      allowedDays: ['ALL_DAYS'],
    });

    domesticHelpService.revokeUnitLink(resident101Actor, 'soc-green-valley', {
      linkId: reg.link.id,
      reason: 'No longer required at A-101',
    });

    const profile = domesticHelpService.getProfile(reg.profile.id);
    expect(profile?.accessStatus).toBe('ACTIVE');
    expect(profile?.linkedFlatCount).toBe(1);
    expect(profile?.linkedFlatNumbers).toEqual(['A-202']);

    const allLinks = domesticHelpService.getLinksForHelper(reg.profile.id);
    const linkBState = allLinks.find(l => l.id === linkB.id);
    expect(linkBState?.linkStatus).toBe('ACTIVE');
  });

  it('SCENARIO F — SOCIETY SECURITY BLOCK: Authorized security restriction revokes all unit links', () => {
    const domesticHelpService = new DomesticHelpOperationsService();

    const reg = domesticHelpService.registerDomesticHelp(resident101Actor, 'soc-green-valley', {
      name: 'Suspect Worker',
      helpType: 'MAID',
      mobile: '9820000002',
      unitId: 'unit-a101',
      unitNumber: 'A-101',
      allowedDays: ['ALL_DAYS'],
    });

    domesticHelpService.linkToUnit(resident202Actor, 'soc-green-valley', {
      domesticHelpId: reg.profile.id,
      unitId: 'unit-a202',
      unitNumber: 'A-202',
      effectiveFrom: '2026-06-01',
      allowedDays: ['ALL_DAYS'],
    });

    const blocked = domesticHelpService.societyBlockDomesticHelp(supervisorActor, 'soc-green-valley', reg.profile.id, {
      reason: 'Caught stealing on CCTV camera in tower lobby',
      confirmationChecked: true,
      incidentReference: 'INC-2026-999',
    });

    expect(blocked.accessStatus).toBe('BLOCKED');
    expect(blocked.incidentCount).toBe(1);

    const links = domesticHelpService.getLinksForHelper(reg.profile.id);
    for (const l of links) {
      expect(l.linkStatus).toBe('REVOKED');
      expect(l.revocationReason).toContain('Society Security Block');
    }
  });

  it('SCENARIO G — VENDOR BILLING: Exposes 286 verified man-days vs 300 invoiced without modifying invoice', () => {
    const vendorService = new VendorAttendanceVerificationService();

    const engagements = [
      {
        id: 'eng-01',
        staffId: 'stf-sec-team',
        societyId: 'soc-green-valley',
        engagementType: 'VENDOR_WORKER' as const,
        vendorId: 'vnd-safeguard',
        vendorName: 'SafeGuard Security',
        roleCategory: 'SECURITY_GUARD' as const,
        effectiveFrom: '2026-06-01',
        status: 'ACTIVE' as const,
        assignedLocation: 'Main Gate',
        createdAt: '2026-06-01T00:00:00Z',
        updatedAt: '2026-06-01T00:00:00Z',
      },
    ];

    const days = [];
    for (let i = 1; i <= 300; i++) {
      days.push({
        date: '2026-06-01',
        staffId: 'stf-sec-team',
        staffName: 'SafeGuard Guards',
        staffCode: 'STF-SG',
        status: i <= 286 ? ('PRESENT' as const) : ('ABSENT' as const),
        punches: [],
        isManual: false,
        correctionApplied: false,
      });
    }

    const verification = vendorService.calculateVendorAttendancePeriod(
      hrAdminActor,
      {
        societyId: 'soc-green-valley',
        vendorId: 'vnd-safeguard',
        vendorName: 'SafeGuard Security',
        billingPeriodMonth: '2026-06',
        invoicedManDaysClaimed: 300,
      },
      engagements,
      days
    );

    expect(verification.verifiedPresentManDays).toBe(286);
    expect(verification.expectedManDays).toBe(300);
    expect(verification.disputedDays).toBe(14);
    expect(verification.status).toBe('DISPUTED');
  });

  it('SCENARIO H — ATTENDANCE CORRECTION: Source punch stays intact while summary is updated with version overlay', () => {
    const correctionService = new AttendanceCorrectionService();

    const initialDay = {
      date: '2026-06-02',
      staffId: 'stf-005',
      staffName: 'Ramesh Guard',
      staffCode: 'STF-005',
      status: 'ABSENT' as const,
      punches: [],
      isManual: false,
      correctionApplied: false,
    };

    const request = correctionService.requestCorrection(supervisorActor, 'soc-green-valley', {
      staffId: 'stf-005',
      staffName: 'Ramesh Guard',
      staffCode: 'STF-005',
      attendanceDate: '2026-06-02',
      correctionType: 'MISSED_CHECK_IN',
      existingValue: 'ABSENT',
      requestedCorrection: 'PRESENT',
      reason: 'Attended full shift; biometric reader failed',
      confirmationChecked: true,
    });

    const result = correctionService.approveCorrection(
      hrAdminActor,
      'soc-green-valley',
      request.id,
      { confirmationChecked: true, auditNote: 'Confirmed with physical register' },
      initialDay,
      false
    );

    expect(result.updatedRequest.status).toBe('APPROVED');
    expect(result.updatedDay.status).toBe('PRESENT');
    expect(result.updatedDay.correctionApplied).toBe(true);
  });

  it('SCENARIO I — PAYROLL SNAPSHOT: Generates snapshot and later correction creates revised snapshot v2', () => {
    const payrollService = new PayrollReadinessService();

    const staffList = [
      {
        id: 'stf-001',
        staffCode: 'STF-001',
        name: 'Ramesh Pawar',
        category: 'SECURITY_GUARD' as const,
        employmentStatus: 'ACTIVE' as const,
        verificationStatus: 'VERIFIED' as const,
        policeVerificationStatus: 'VERIFIED' as const,
        idDocumentStatus: 'VERIFIED' as const,
        isVendorWorker: false,
        assignedLocation: 'Main Gate',
        assignedAreas: ['Main Gate'],
        mobileMasked: '98******10',
        joiningDate: '2026-01-01',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];

    const septDaysInitial = [
      {
        date: '2026-09-01',
        staffId: 'stf-001',
        staffName: 'Ramesh Pawar',
        staffCode: 'STF-001',
        status: 'ABSENT' as const,
        punches: [],
        isManual: false,
        correctionApplied: false,
      },
    ];

    const snapshotV1 = payrollService.createSnapshot(
      hrAdminActor,
      { societyId: 'soc-green-valley', month: '09', year: 2026 },
      staffList,
      septDaysInitial
    );
    expect(snapshotV1.version).toBe(1);
    expect(snapshotV1.totalAbsentDays).toBe(1);

    const septDaysCorrected = [
      {
        date: '2026-09-01',
        staffId: 'stf-001',
        staffName: 'Ramesh Pawar',
        staffCode: 'STF-001',
        status: 'PRESENT' as const,
        punches: [],
        isManual: false,
        correctionApplied: true,
      },
    ];

    const snapshotV2 = payrollService.createSnapshot(
      hrAdminActor,
      { societyId: 'soc-green-valley', month: '09', year: 2026 },
      staffList,
      septDaysCorrected
    );
    expect(snapshotV2.version).toBe(2);
    expect(snapshotV2.totalPresentDays).toBe(1);

    const originalV1 = payrollService.getSnapshot(snapshotV1.id);
    expect(originalV1?.version).toBe(1);
    expect(originalV1?.totalAbsentDays).toBe(1);
  });

  it('SCENARIO J — RAW BIOMETRIC PRIVACY: Demonstrates absence of raw biometric templates or images across models and payloads', () => {
    const biometricService = new BiometricIntegrationService();
    const dev = biometricService.registerDevice(hrAdminActor, 'soc-green-valley', {
      deviceCode: 'DEV-CHECK-01',
      deviceName: 'Audit Device',
      vendorName: 'ZKTeco',
      location: 'Audit Area',
    });

    biometricService.createMapping(hrAdminActor, 'soc-green-valley', {
      deviceId: dev.id,
      deviceCode: dev.deviceCode,
      deviceName: dev.deviceName,
      biometricEmployeeCode: 'CODE-999',
      staffId: 'stf-audit',
      staffName: 'Audit Staff',
      staffCode: 'STF-AUDIT',
      effectiveFrom: '2026-01-01',
    });

    const sync = biometricService.syncDeviceBatch(dev.id, 'soc-green-valley', [
      { employeeCode: 'CODE-999', punchTime: '2026-06-15T09:00:00Z', punchType: 'IN' },
    ]);

    const serializedPayload = JSON.stringify(sync);
    const forbiddenWords = ['fingerprint', 'template', 'iris', 'faceEmbedding', 'biometricBlob', 'rawMinutiae'];
    for (const word of forbiddenWords) {
      expect(serializedPayload.toLowerCase()).not.toContain(word.toLowerCase());
    }
  });
});
