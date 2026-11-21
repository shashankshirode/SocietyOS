import { AmcContractService } from '../services/amcContractService';
import { createActorFromSession } from '../data/facilityOpsActor';

describe('AMC Contract Lifecycle', () => {
  const manager = createActorFromSession({
    userId: 'usr-mgr-1',
    name: 'Facility Manager',
    societyId: 'soc-1',
    role: 'FACILITY_MANAGER',
  });

  const amcService = AmcContractService.getInstance();

  beforeEach(() => {
    amcService.clear();
  });

  test('creates contract and detects overlapping coverage on same asset', () => {
    const c1 = amcService.createContract(
      {
        vendorId: 'vnd-fire-1',
        vendorName: 'Fire Protection Ltd',
        category: 'FIRE_SAFETY',
        linkedAssets: ['ast-sprinkler-zone-a'],
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        contractAmount: 80000,
        serviceFrequency: 'QUARTERLY',
        slaTerms: '4hr SLA',
        emergencyResponseTime: '2 hours',
        includedServices: ['Quarterly inspection'],
        excludedServices: [],
      },
      manager
    );

    expect(c1.id).toBeDefined();
    expect(c1.status).toBe('ACTIVE');

    expect(() => {
      amcService.createContract(
        {
          vendorId: 'vnd-fire-2',
          vendorName: 'Alternative Fire Ltd',
          category: 'FIRE_SAFETY',
          linkedAssets: ['ast-sprinkler-zone-a'],
          startDate: '2026-06-01',
          endDate: '2027-05-31',
          contractAmount: 85000,
          serviceFrequency: 'QUARTERLY',
          slaTerms: '4hr SLA',
          emergencyResponseTime: '2 hours',
          includedServices: ['Quarterly inspection'],
          excludedServices: [],
        },
        manager
      );
    }).toThrow('CONTRACT_OVERLAP');
  });

  test('validates start and end dates', () => {
    expect(() => {
      amcService.createContract(
        {
          vendorId: 'vnd-gen-1',
          vendorName: 'GenCorp',
          category: 'GENERATOR',
          linkedAssets: ['ast-gen-1'],
          startDate: '2026-12-31',
          endDate: '2026-01-01',
          contractAmount: 50000,
          serviceFrequency: 'MONTHLY',
          slaTerms: 'Standard',
          emergencyResponseTime: '4 hours',
          includedServices: [],
          excludedServices: [],
        },
        manager
      );
    }).toThrow('VALIDATION_ERROR: Contract end date must be after start date');
  });

  test('derives reminder states based on remaining days', () => {
    const contract = amcService.createContract(
      {
        vendorId: 'vnd-lift-1',
        vendorName: 'Schindler',
        category: 'LIFT',
        linkedAssets: ['ast-lift-main'],
        startDate: '2025-04-01',
        endDate: '2026-04-30',
        contractAmount: 150000,
        serviceFrequency: 'MONTHLY',
        slaTerms: '2hr response',
        emergencyResponseTime: '1 hour',
        includedServices: ['Monthly service'],
        excludedServices: [],
      },
      manager
    );

    const reminder10Days = amcService.deriveReminder(contract, new Date('2026-04-20'));
    expect(reminder10Days.daysRemaining).toBe(10);
    expect(reminder10Days.status).toBe('DUE_SOON');
    expect(reminder10Days.priority).toBe('URGENT');

    const reminderExpired = amcService.deriveReminder(contract, new Date('2026-05-02'));
    expect(reminderExpired.daysRemaining).toBeLessThan(0);
    expect(reminderExpired.status).toBe('OVERDUE');
    expect(reminderExpired.priority).toBe('URGENT');
  });

  test('terminates contract cleanly', () => {
    const contract = amcService.createContract(
      {
        vendorId: 'vnd-pest-1',
        vendorName: 'PestAway',
        category: 'PEST_CONTROL',
        linkedAssets: ['ast-facility-garden'],
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        contractAmount: 40000,
        serviceFrequency: 'MONTHLY',
        slaTerms: 'Standard',
        emergencyResponseTime: '24 hours',
        includedServices: ['Spraying'],
        excludedServices: [],
      },
      manager
    );

    const terminated = amcService.terminateContract(contract.id, 'Vendor default on SLA commitments', manager);
    expect(terminated.status).toBe('TERMINATED');
    expect(terminated.notes).toContain('Vendor default');
  });
});
