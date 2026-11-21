import { HousekeepingQualityService } from '../services/housekeepingQualityService';
import type { StaffOperationsActor } from '../data/staffAttendanceActor.types';

describe('Housekeeping Quality & Corrective Action Invariants', () => {
  const supervisorActor: StaffOperationsActor = {
    userId: 'usr-sup-01',
    societyId: 'soc-green-valley',
    role: 'FACILITY_MANAGER',
    displayName: 'FM Rajesh',
  };

  it('Invariant 49: Housekeeping inspection failure creates an automated corrective action with SLA and re-cleaning task', () => {
    const service = new HousekeepingQualityService();

    const failedResult = service.conductInspection(supervisorActor, 'soc-green-valley', {
      checklistVersionId: 'chk-lobby-v1',
      areaName: 'Tower A Entrance Lobby',
      workerStaffId: 'stf-hk-01',
      workerStaffName: 'Kailash Housekeeping',
      itemResults: [
        { itemId: 'item-1', passed: true },
        { itemId: 'item-2', passed: false },
        { itemId: 'item-3', passed: false },
        { itemId: 'item-4', passed: false },
      ],
      findings: ['Dustbins overflowing', 'Glass stained with fingerprints', 'Sofa dusty'],
    });

    expect(failedResult.inspection.passed).toBe(false);
    expect(failedResult.inspection.scorePercentage).toBe(30);
    expect(failedResult.correctiveAction).toBeDefined();
    expect(failedResult.correctiveAction?.assignedStaffId).toBe('stf-hk-01');
    expect(failedResult.correctiveAction?.status).toBe('PENDING');
    expect(failedResult.correctiveAction?.slaHours).toBe(4);
    expect(failedResult.correctiveAction?.taskDescription).toContain('Re-cleaning required');

    const passedResult = service.conductInspection(supervisorActor, 'soc-green-valley', {
      checklistVersionId: 'chk-lobby-v1',
      areaName: 'Tower B Entrance Lobby',
      workerStaffId: 'stf-hk-02',
      workerStaffName: 'Suman Housekeeping',
      itemResults: [
        { itemId: 'item-1', passed: true },
        { itemId: 'item-2', passed: true },
        { itemId: 'item-3', passed: true },
        { itemId: 'item-4', passed: true },
      ],
      findings: [],
    });

    expect(passedResult.inspection.passed).toBe(true);
    expect(passedResult.inspection.scorePercentage).toBe(100);
    expect(passedResult.correctiveAction).toBeUndefined();
  });
});
