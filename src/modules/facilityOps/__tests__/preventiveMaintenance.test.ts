import { PreventiveMaintenanceService } from '../services/preventiveMaintenanceService';
import { createActorFromSession } from '../data/facilityOpsActor';

describe('Preventive Maintenance Engine', () => {
  const manager = createActorFromSession({
    userId: 'usr-mgr-1',
    name: 'Facility Manager',
    societyId: 'soc-1',
    role: 'FACILITY_MANAGER',
  });

  const pmService = PreventiveMaintenanceService.getInstance();

  beforeEach(() => {
    pmService.clear();
  });

  test('creates maintenance plan and calculates next due dates correctly', () => {
    const plan = pmService.createPlan(
      {
        assetId: 'ast-wtp-filter',
        assetName: 'WTP Multigrade Filter',
        title: 'Quarterly Media Regeneration',
        frequency: 'QUARTERLY',
        checklist: [
          { id: 'c1', taskDescription: 'Backwash filter bed', isMandatory: true },
          { id: 'c2', taskDescription: 'Refill media if depleted', isMandatory: false },
        ],
        slaHours: 48,
        requiredEvidence: ['PHOTO_AFTER'],
        nextDueRule: 'FIXED_CALENDAR',
        effectiveStartDate: '2026-01-01',
      },
      manager
    );

    expect(plan.id).toBeDefined();
    expect(plan.checklist.length).toBe(2);

    const nextDateDaily = pmService.calculateNextDueDate('DAILY', 'FIXED_CALENDAR', '2026-01-01');
    expect(nextDateDaily).toBe('2026-01-02');

    const nextDateWeekly = pmService.calculateNextDueDate('WEEKLY', 'FIXED_CALENDAR', '2026-01-01');
    expect(nextDateWeekly).toBe('2026-01-08');

    const nextDateMonthly = pmService.calculateNextDueDate('MONTHLY', 'FIXED_CALENDAR', '2026-01-01');
    expect(nextDateMonthly).toBe('2026-02-01');

    const nextDateQuarterly = pmService.calculateNextDueDate('QUARTERLY', 'FIXED_CALENDAR', '2026-01-01');
    expect(nextDateQuarterly).toBe('2026-04-01');

    const nextDateYearly = pmService.calculateNextDueDate('YEARLY', 'FIXED_CALENDAR', '2026-01-01');
    expect(nextDateYearly).toBe('2027-01-01');
  });

  test('requires at least one checklist item in maintenance plan', () => {
    expect(() => {
      pmService.createPlan(
        {
          assetId: 'ast-gen',
          assetName: 'DG Set',
          title: 'Empty checklist plan',
          frequency: 'MONTHLY',
          checklist: [],
          slaHours: 24,
          requiredEvidence: [],
          nextDueRule: 'FIXED_CALENDAR',
          effectiveStartDate: '2026-01-01',
        },
        manager
      );
    }).toThrow('VALIDATION_ERROR: Maintenance plan must have at least one checklist item');
  });
});
