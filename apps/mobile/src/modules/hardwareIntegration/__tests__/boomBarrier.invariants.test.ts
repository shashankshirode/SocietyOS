import { BoomBarrierService } from '../services/boomBarrierService';
import type { HardwareActorContext } from '../services/hardwareActor';

describe('Boom Barrier Invariants', () => {
  let service: BoomBarrierService;
  const guardActor: HardwareActorContext = {
    userId: 'guard-01',
    userName: 'Main Guard',
    userRole: 'SECURITY_GUARD',
    societyId: 'soc-alpha',
  };

  beforeEach(() => {
    service = new BoomBarrierService();
    service.registerBarrier({
      id: 'bb-gate1',
      name: 'Main Gate Barrier',
      deviceCode: 'HW-BB-01',
      location: 'Main Gate Entry',
      status: 'CLOSED',
      deniedCount: 0,
    });
  });

  test('issuing command transitions through state machine and supports idempotency', () => {
    const cmd1 = service.issueCommand(guardActor, {
      barrierId: 'bb-gate1',
      commandType: 'OPEN',
      idempotencyKey: 'cmd-test-01',
      reason: 'Resident vehicle verified',
    });
    expect(cmd1.state).toBe('CONFIRMED');

    const barrier = service.getBarrier('bb-gate1')!;
    expect(barrier.status).toBe('OPEN');
    expect(barrier.lastOpenTime).toBeDefined();

    const cmd2 = service.issueCommand(guardActor, {
      barrierId: 'bb-gate1',
      commandType: 'OPEN',
      idempotencyKey: 'cmd-test-01',
    });
    expect(cmd2.commandId).toBe(cmd1.commandId);
  });

  test('unconfirmed timeout transitions to TIMED_OUT and reconciles on delayed heartbeat', () => {
    const cmd = service.issueCommand(guardActor, {
      barrierId: 'bb-gate1',
      commandType: 'OPEN',
      idempotencyKey: 'cmd-timeout-01',
      simulateTimeout: true,
    });
    expect(cmd.state).toBe('TIMED_OUT');

    const barrier = service.getBarrier('bb-gate1')!;
    expect(barrier.lastCommandState).toBe('TIMED_OUT');

    const reconciled = service.reconcilePhysicalState('bb-gate1', 'OPEN', 'OPEN');
    expect(reconciled.lastCommandState).toBe('CONFIRMED');
    expect(reconciled.status).toBe('OPEN');
  });

  test('detects disagreement between controller and physical position sensor', () => {
    const barrier = service.reconcilePhysicalState('bb-gate1', 'OPEN', 'CLOSED');
    expect(barrier.stateDiscrepancy).toBe(true);
    expect(barrier.status).toBe('ERROR');
    expect(barrier.lastCommandState).toBe('RECONCILIATION_REQUIRED');
  });

  test('manual override requires non-empty operational reason', () => {
    expect(() =>
      service.manualOverride(guardActor, {
        barrierId: 'bb-gate1',
        reason: '   ',
        overrideType: 'MANUAL_SUPERVISOR',
      })
    ).toThrow('BARRIER_OVERRIDE_REASON_REQUIRED');

    const override = service.manualOverride(guardActor, {
      barrierId: 'bb-gate1',
      reason: 'School bus entry during morning rush',
      overrideType: 'MANUAL_SUPERVISOR',
    });
    expect(override.state).toBe('CONFIRMED');
    const barrier = service.getBarrier('bb-gate1')!;
    expect(barrier.status).toBe('MANUAL_OVERRIDE');
  });

  test('emergency override links to emergency incident reference', () => {
    const override = service.manualOverride(guardActor, {
      barrierId: 'bb-gate1',
      reason: 'Ambulance arriving for flat B-402',
      overrideType: 'EMERGENCY_AMBULANCE',
      emergencyIncidentId: 'inc-sos-999',
    });
    expect(override.emergencyIncidentId).toBe('inc-sos-999');
  });
});
