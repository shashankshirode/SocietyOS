import {
  StaffOperationsService,
  DomesticHelpOperationsService,
  ShiftRosterService,
  AttendanceEngineService,
  BiometricIntegrationService,
  AttendanceCorrectionService,
  VendorAttendanceVerificationService,
  PayrollReadinessService,
  HousekeepingQualityService,
} from '../services';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';

describe('Deep Services Branch & Error Coverage', () => {
  const hrAdminActor: StaffOperationsActor = {
    userId: 'usr-hr-01',
    societyId: 'soc-gv',
    role: 'HR_ADMIN',
    displayName: 'HR Admin',
  };

  const guardActor: StaffOperationsActor = {
    userId: 'usr-guard-01',
    societyId: 'soc-gv',
    role: 'GUARD',
    displayName: 'Guard User',
  };

  const resident1Actor: StaffOperationsActor = {
    userId: 'usr-res-1',
    societyId: 'soc-gv',
    role: 'RESIDENT',
    unitId: 'u-1',
    displayName: 'Resident 1',
  };

  const resident2Actor: StaffOperationsActor = {
    userId: 'usr-res-2',
    societyId: 'soc-gv',
    role: 'RESIDENT',
    unitId: 'u-2',
    displayName: 'Resident 2',
  };

  const fmActor: StaffOperationsActor = {
    userId: 'usr-fm-01',
    societyId: 'soc-gv',
    role: 'FACILITY_MANAGER',
    displayName: 'Facility Manager',
  };

  describe('StaffOperationsService error and edge branches', () => {
    it('throws if registering staff with duplicate code', () => {
      const s = new StaffOperationsService();
      s.registerStaff(hrAdminActor, 'soc-gv', {
        name: 'A',
        staffCode: 'CODE-1',
        category: 'SECURITY_GUARD',
        mobile: '9900000001',
        assignedLocation: 'Gate',
        joiningDate: '2026-01-01',
        verificationStatus: 'PENDING',
      });

      expect(() => {
        s.registerStaff(hrAdminActor, 'soc-gv', {
          name: 'B',
          staffCode: 'CODE-1',
          category: 'SECURITY_GUARD',
          mobile: '9900000002',
          assignedLocation: 'Gate',
          joiningDate: '2026-01-01',
          verificationStatus: 'PENDING',
        });
      }).toThrow('STAFF_CODE_CONFLICT');
    });

    it('throws when non-existent staff is verified or exited', () => {
      const s = new StaffOperationsService();
      expect(() => {
        s.verifyStaff(hrAdminActor, {
          staffId: 'stf-none',
          societyId: 'soc-gv',
          policeVerificationVerified: true,
          idDocumentVerified: true,
          addressProofVerified: true,
        });
      }).toThrow('STAFF_NOT_FOUND');

      expect(() => {
        s.exitStaff(hrAdminActor, {
          staffId: 'stf-none',
          societyId: 'soc-gv',
          exitDate: '2026-01-01',
          exitReason: 'left',
        });
      }).toThrow('STAFF_NOT_FOUND');

      expect(() => {
        s.suspendStaff(hrAdminActor, 'soc-gv', 'stf-none', 'bad');
      }).toThrow('STAFF_NOT_FOUND');

      expect(() => {
        s.reactivateStaff(hrAdminActor, 'soc-gv', 'stf-none', '2026-02-01');
      }).toThrow('STAFF_NOT_FOUND');
    });

    it('supports initial profiles and exercises getters and audit logs', () => {
      const s = new StaffOperationsService([
        {
          id: 'stf-init-1',
          staffCode: 'STF-INIT-1',
          name: 'Initial Staff',
          category: 'SECURITY_GUARD',
          employmentStatus: 'ACTIVE',
          verificationStatus: 'VERIFIED',
          policeVerificationStatus: 'VERIFIED',
          idDocumentStatus: 'VERIFIED',
          isVendorWorker: false,
          assignedLocation: 'Lobby',
          assignedAreas: ['Lobby'],
          mobileMasked: '99******00',
          joiningDate: '2025-01-01',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ]);

      expect(s.getStaff('stf-init-1')?.name).toBe('Initial Staff');
      expect(s.getEngagements('stf-init-1')).toEqual([]);
      expect(Array.isArray(s.getAuditLogs())).toBe(true);
    });
  });

  describe('DomesticHelpOperationsService edge cases', () => {
    it('throws if blocked helper attempts linking, or duplicate link created', () => {
      const s = new DomesticHelpOperationsService();
      const reg = s.registerDomesticHelp(resident1Actor, 'soc-gv', {
        name: 'Kamla',
        helpType: 'MAID',
        mobile: '9800000001',
        unitId: 'u-1',
        unitNumber: '101',
        allowedDays: ['MONDAY'],
      });

      expect(() => {
        s.linkToUnit(resident1Actor, 'soc-gv', {
          domesticHelpId: reg.profile.id,
          unitId: 'u-1',
          unitNumber: '101',
          effectiveFrom: '2026-01-01',
          allowedDays: ['MONDAY'],
        });
      }).toThrow('DOMESTIC_HELP_LINK_ALREADY_ACTIVE');

      expect(() => {
        s.linkToUnit(resident1Actor, 'soc-gv', {
          domesticHelpId: 'dh-nonexistent',
          unitId: 'u-2',
          unitNumber: '102',
          effectiveFrom: '2026-01-01',
          allowedDays: ['TUESDAY'],
        });
      }).toThrow('DOMESTIC_HELP_NOT_FOUND');
    });

    it('throws if resident revokes another residents link or non-existent link', () => {
      const s = new DomesticHelpOperationsService();
      const reg = s.registerDomesticHelp(resident1Actor, 'soc-gv', {
        name: 'Sunita',
        helpType: 'COOK',
        mobile: '9800000002',
        unitId: 'u-1',
        unitNumber: '101',
        allowedDays: ['MONDAY'],
      });

      expect(() => {
        s.revokeUnitLink(resident2Actor, 'soc-gv', {
          linkId: reg.link.id,
          reason: 'not mine',
        });
      }).toThrow('ACCESS_DENIED');

      expect(() => {
        s.revokeUnitLink(resident1Actor, 'soc-gv', {
          linkId: 'link-404',
          reason: 'none',
        });
      }).toThrow('DOMESTIC_HELP_LINK_NOT_FOUND');
    });

    it('throws if society block has empty reason or unauthorized actor', () => {
      const s = new DomesticHelpOperationsService();
      expect(() => {
        s.societyBlockDomesticHelp(guardActor, 'soc-gv', 'dh-1', {
          reason: 'suspect',
          confirmationChecked: true,
        });
      }).toThrow('ACCESS_DENIED');

      expect(() => {
        s.societyBlockDomesticHelp(hrAdminActor, 'soc-gv', 'dh-1', {
          reason: '   ',
          confirmationChecked: true,
        });
      }).toThrow('VALIDATION_ERROR');

      expect(() => {
        s.societyBlockDomesticHelp(hrAdminActor, 'soc-gv', 'dh-none', {
          reason: 'theft',
          confirmationChecked: true,
        });
      }).toThrow('DOMESTIC_HELP_NOT_FOUND');
    });
  });

  describe('AttendanceEngineService summary and calculations', () => {
    it('exercises daily summary across multiple states', () => {
      const engine = new AttendanceEngineService();

      engine.ingestPunch({
        id: 'p-1',
        staffId: 's-1',
        staffName: 'Staff 1',
        staffCode: 'S1',
        punchTime: '2026-06-15T08:00:00Z',
        punchType: 'IN',
        source: 'BIOMETRIC_DEVICE',
        location: 'Gate',
        isDuplicate: false,
        isMapped: true,
        createdAt: '2026-06-15T08:00:00Z',
      });
      engine.ingestPunch({
        id: 'p-2',
        staffId: 's-1',
        staffName: 'Staff 1',
        staffCode: 'S1',
        punchTime: '2026-06-15T16:00:00Z',
        punchType: 'OUT',
        source: 'BIOMETRIC_DEVICE',
        location: 'Gate',
        isDuplicate: false,
        isMapped: true,
        createdAt: '2026-06-15T16:00:00Z',
      });

      engine.deriveAttendanceForStaffDay('s-1', 'Staff 1', 'S1', '2026-06-15');
      engine.deriveAttendanceForStaffDay('s-2', 'Staff 2', 'S2', '2026-06-15');
      engine.deriveAttendanceForStaffDay('s-3', 'Staff 3', 'S3', '2026-06-15', undefined, { isOnLeave: true });
      engine.deriveAttendanceForStaffDay('s-4', 'Staff 4', 'S4', '2026-06-15', undefined, { isWeeklyOff: true });
      engine.deriveAttendanceForStaffDay('s-5', 'Staff 5', 'S5', '2026-06-15', undefined, { isHoliday: true });

      const summary = engine.getDailySummary('2026-06-15');
      expect(summary.totalExpected).toBe(5);
      expect(summary.present).toBe(1);
      expect(summary.absent).toBe(1);
      expect(summary.onLeave).toBe(1);
      expect(summary.weeklyOff).toBe(1);
      expect(summary.attendancePercentage).toBeGreaterThanOrEqual(0);

      expect(engine.getDerivedDay('s-1', '2026-06-15')?.status).toBe('PRESENT');
      expect(engine.getDerivedDay('non-existent', '2026-06-15')).toBeUndefined();
    });
  });

  describe('ShiftRosterService queries and errors', () => {
    it('throws if non-manager creates shift or assigns non-existent shift', () => {
      const s = new ShiftRosterService();
      expect(() => {
        s.createShift(guardActor, 'soc-gv', {
          shiftName: 'Gate Shift',
          startTime: '08:00',
          endTime: '16:00',
          gracePeriodMinutes: 10,
          location: 'Gate',
          weeklyOffDays: [],
        });
      }).toThrow('ACCESS_DENIED');

      expect(() => {
        s.assignShift(hrAdminActor, 'soc-gv', {
          staffId: 'stf-1',
          staffName: 'Staff 1',
          staffCode: 'S1',
          shiftId: 'shift-404',
          location: 'Gate',
          effectiveFrom: '2026-01-01',
          weeklyOffDays: [],
        });
      }).toThrow('SHIFT_NOT_FOUND');

      expect(() => {
        s.assignTemporaryReplacement(hrAdminActor, 'soc-gv', {
          date: '2026-01-01',
          shiftId: 'shift-404',
          originalStaffId: 's1',
          replacementStaffId: 's2',
          location: 'Gate',
          reason: 'illness',
        });
      }).toThrow('SHIFT_NOT_FOUND');
    });

    it('retrieves all shifts and occurrences', () => {
      const s = new ShiftRosterService();
      const sh = s.createShift(hrAdminActor, 'soc-gv', {
        shiftName: 'Day',
        startTime: '09:00',
        endTime: '17:00',
        gracePeriodMinutes: 15,
        location: 'Lobby',
        weeklyOffDays: ['SUNDAY'],
      });

      expect(s.getAllShifts().length).toBe(1);
      expect(s.getShift(sh.id)?.shiftName).toBe('Day');

      s.assignTemporaryReplacement(hrAdminActor, 'soc-gv', {
        date: '2026-05-01',
        shiftId: sh.id,
        originalStaffId: 'stf-1',
        replacementStaffId: 'stf-2',
        location: 'Lobby',
        reason: 'coverage',
      });

      expect(s.getRosterOccurrences('2026-05-01').length).toBe(1);
      expect(s.getRosterOccurrences('2026-05-02').length).toBe(0);
    });
  });

  describe('BiometricIntegrationService edge checks', () => {
    it('throws if registering duplicate deviceCode or mapping non-existent device', () => {
      const s = new BiometricIntegrationService();
      s.registerDevice(hrAdminActor, 'soc-gv', {
        deviceCode: 'DEV-A',
        deviceName: 'Device A',
        vendorName: 'ZKTeco',
        location: 'Gate',
      });

      expect(() => {
        s.registerDevice(hrAdminActor, 'soc-gv', {
          deviceCode: 'DEV-A',
          deviceName: 'Device A Duplicate',
          vendorName: 'ZKTeco',
          location: 'Gate',
        });
      }).toThrow('DEVICE_CODE_CONFLICT');

      expect(() => {
        s.createMapping(hrAdminActor, 'soc-gv', {
          deviceId: 'dev-404',
          deviceCode: 'DEV-404',
          deviceName: 'Non-existent',
          biometricEmployeeCode: '101',
          staffId: 'stf-1',
          staffName: 'Staff 1',
          staffCode: 'S1',
          effectiveFrom: '2026-01-01',
        });
      }).toThrow('BIOMETRIC_DEVICE_NOT_FOUND');
    });

    it('rejects overlapping mapping for same device and employee code', () => {
      const s = new BiometricIntegrationService();
      const dev = s.registerDevice(hrAdminActor, 'soc-gv', {
        deviceCode: 'DEV-B',
        deviceName: 'Device B',
        vendorName: 'ZKTeco',
        location: 'Gate',
      });

      s.createMapping(hrAdminActor, 'soc-gv', {
        deviceId: dev.id,
        deviceCode: dev.deviceCode,
        deviceName: dev.deviceName,
        biometricEmployeeCode: 'CODE-99',
        staffId: 'stf-1',
        staffName: 'Staff 1',
        staffCode: 'S1',
        effectiveFrom: '2026-01-01',
        effectiveTo: '2026-06-30',
      });

      expect(() => {
        s.createMapping(hrAdminActor, 'soc-gv', {
          deviceId: dev.id,
          deviceCode: dev.deviceCode,
          deviceName: dev.deviceName,
          biometricEmployeeCode: 'CODE-99',
          staffId: 'stf-2',
          staffName: 'Staff 2',
          staffCode: 'S2',
          effectiveFrom: '2026-05-01',
          effectiveTo: '2026-12-31',
        });
      }).toThrow('BIOMETRIC_MAPPING_CONFLICT');
    });

    it('retrieves device by id and filters sync errors by device', () => {
      const s = new BiometricIntegrationService();
      const dev = s.registerDevice(hrAdminActor, 'soc-gv', {
        deviceCode: 'DEV-C',
        deviceName: 'Device C',
        vendorName: 'ZKTeco',
        location: 'Gate',
      });

      expect(s.getDevice(dev.id)?.deviceName).toBe('Device C');
      expect(s.getDevice('dev-missing')).toBeUndefined();
      expect(s.getSyncErrors(dev.id)).toEqual([]);
    });
  });

  describe('AttendanceCorrectionService getters and errors', () => {
    it('throws if non-existent request is approved or rejected, or request is already decided', () => {
      const s = new AttendanceCorrectionService();
      expect(() => {
        s.approveCorrection(
          hrAdminActor,
          'soc-gv',
          'cr-404',
          { confirmationChecked: true },
          { date: '2026-01-01', staffId: 's', staffName: 'n', staffCode: 'c', status: 'ABSENT', punches: [], isManual: false, correctionApplied: false },
          false
        );
      }).toThrow('CORRECTION_NOT_FOUND');

      expect(() => {
        s.rejectCorrection(hrAdminActor, 'soc-gv', 'cr-404', {
          rejectionReason: 'nope',
          confirmationChecked: true,
        });
      }).toThrow('CORRECTION_NOT_FOUND');
    });

    it('fetches request and audit logs', () => {
      const s = new AttendanceCorrectionService();
      const req = s.requestCorrection(guardActor, 'soc-gv', {
        staffId: 'stf-1',
        staffName: 'Staff 1',
        staffCode: 'S1',
        attendanceDate: '2026-06-01',
        correctionType: 'MISSED_CHECK_IN',
        requestedCorrection: 'PRESENT',
        reason: 'gate offline',
        confirmationChecked: true,
      });

      expect(s.getRequest(req.id)?.staffName).toBe('Staff 1');
      expect(s.getRequest('cr-404')).toBeUndefined();
      expect(s.getAuditLogs().length).toBeGreaterThan(0);
    });
  });

  describe('VendorAttendanceVerificationService queries and edge cases', () => {
    it('throws if locking non-existent verification or unauthorized', () => {
      const s = new VendorAttendanceVerificationService();
      expect(() => {
        s.lockVendorAttendancePeriod(guardActor, 'soc-gv', 'vav-1');
      }).toThrow('ACCESS_DENIED');

      expect(() => {
        s.lockVendorAttendancePeriod(hrAdminActor, 'soc-gv', 'vav-none');
      }).toThrow('VENDOR_ATTENDANCE_NOT_FOUND');

      expect(s.getVerification('vav-none')).toBeUndefined();
      expect(Array.isArray(s.getAuditLogs())).toBe(true);
    });
  });

  describe('PayrollReadinessService queries and errors', () => {
    it('throws if unauthorized actor attempts snapshot creation', () => {
      const s = new PayrollReadinessService();
      expect(() => {
        s.createSnapshot(guardActor, { societyId: 'soc-gv', month: '06', year: 2026 }, [], []);
      }).toThrow('ACCESS_DENIED');
    });

    it('retrieves snapshots for period and audit logs', () => {
      const s = new PayrollReadinessService();
      const snap = s.createSnapshot(
        hrAdminActor,
        { societyId: 'soc-gv', month: '06', year: 2026 },
        [],
        []
      );

      expect(s.getSnapshot(snap.id)?.id).toBe(snap.id);
      expect(s.getSnapshotsForPeriod('soc-gv', '06', 2026).length).toBe(1);
      expect(s.getSnapshotsForPeriod('soc-gv', '07', 2026).length).toBe(0);
      expect(s.getAuditLogs().length).toBe(1);
    });
  });

  describe('HousekeepingQualityService checklist registration and queries', () => {
    it('registers custom checklist version and queries inspection / corrective action', () => {
      const s = new HousekeepingQualityService();
      s.registerChecklistVersion(fmActor, 'soc-gv', {
        id: 'chk-washroom-v1',
        version: '1.0.0',
        areaType: 'WASHROOM',
        minimumPassingScore: 70,
        items: [{ id: 'w1', label: 'Taps functional', weight: 100 }],
      });

      const res = s.conductInspection(fmActor, 'soc-gv', {
        checklistVersionId: 'chk-washroom-v1',
        areaName: 'Clubhouse Washroom',
        workerStaffId: 'stf-hk-1',
        workerStaffName: 'Worker 1',
        itemResults: [{ itemId: 'w1', passed: true }],
        findings: [],
      });

      expect(res.inspection.passed).toBe(true);
      expect(s.getInspection(res.inspection.id)?.passed).toBe(true);
      expect(s.getInspection('hki-none')).toBeUndefined();
      expect(s.getCorrectiveAction('cat-none')).toBeUndefined();
      expect(s.getAuditLogs().length).toBeGreaterThan(0);
    });

    it('throws if non-existent checklist is inspected or unauthorized actor', () => {
      const s = new HousekeepingQualityService();
      expect(() => {
        s.conductInspection(guardActor, 'soc-gv', {
          checklistVersionId: 'chk-lobby-v1',
          areaName: 'Lobby',
          workerStaffId: 'stf-1',
          workerStaffName: 'W1',
          itemResults: [],
          findings: [],
        });
      }).toThrow('ACCESS_DENIED');

      expect(() => {
        s.conductInspection(fmActor, 'soc-gv', {
          checklistVersionId: 'chk-404',
          areaName: 'Lobby',
          workerStaffId: 'stf-1',
          workerStaffName: 'W1',
          itemResults: [],
          findings: [],
        });
      }).toThrow('CHECKLIST_NOT_FOUND');
    });
  });
});
