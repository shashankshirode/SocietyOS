import { HardwareHealthObservabilityService } from '../services/hardwareHealthObservabilityService';
import { deviceRegistryService } from '../services/deviceRegistryService';
import type { HardwareActorContext } from '../services/hardwareActor';

describe('Hardware Health Observability Invariants', () => {
  let service: HardwareHealthObservabilityService;
  const adminActor: HardwareActorContext = {
    userId: 'admin-01',
    userName: 'Admin',
    userRole: 'SUPER_ADMIN',
    societyId: 'soc-alpha',
  };

  beforeEach(() => {
    service = new HardwareHealthObservabilityService();
    deviceRegistryService.seedInitialDevices([
      {
        id: 'dev-healthy',
        name: 'Gate Barrier',
        type: 'BOOM_BARRIER',
        deviceCode: 'HW-BB-01',
        vendor: 'FAAC',
        location: 'Gate 1',
        status: 'ONLINE',
        linkedModule: 'GATE',
        societyId: 'soc-alpha',
        lifecycleState: 'ACTIVE',
        healthState: 'ONLINE',
        lastHeartbeat: new Date().toISOString(),
        connectionType: 'API_CONNECTOR',
        credentialReference: 'vault://cred-01',
      },
    ]);
  });

  test('heartbeat updates device health and detects clock drift', () => {
    const normal = service.recordHeartbeat('dev-healthy', new Date().toISOString());
    expect(normal.status).toBe('ONLINE');
    expect(normal.clockDriftMinutes).toBeLessThanOrEqual(1);

    const twoHoursFuture = new Date(Date.now() + 120 * 60000).toISOString();
    const drifted = service.recordHeartbeat('dev-healthy', twoHoursFuture);
    expect(drifted.status).toBe('DEGRADED');
    expect(drifted.clockDriftMinutes).toBeGreaterThanOrEqual(119);

    const errors = service.listErrors();
    expect(errors.some(e => e.errorType === 'TIME_DRIFT')).toBe(true);
  });

  test('marks device offline when heartbeat exceeds stale threshold', () => {
    const staleDevice = deviceRegistryService.registerDevice(adminActor, {
      name: 'Stale Reader',
      type: 'RFID_READER',
      deviceCode: 'RFID-STALE',
      vendor: 'HID',
      location: 'Gate 3',
      linkedModule: 'GATE',
    });
    deviceRegistryService.activateDevice(adminActor, staleDevice.id);
    staleDevice.lastHeartbeat = new Date(Date.now() - 30 * 60000).toISOString();

    service.evaluateStaleHeartbeats(15);
    expect(staleDevice.status).toBe('OFFLINE');
    expect(staleDevice.healthState).toBe('OFFLINE');
  });

  test('computes explainable readiness score and aggregates health rows', () => {
    const home = service.getHardwareHomeData(adminActor);
    expect(home.readinessScore).toBeGreaterThan(0);
    expect(home.totalDevices).toBeGreaterThanOrEqual(1);

    const health = service.getIntegrationHealth();
    expect(health.length).toBeGreaterThan(0);
    expect(health.some(h => h.category.includes('Gate'))).toBe(true);
  });

  test('error resolution and escalation to work order', () => {
    const err = service.recordError({
      id: 'err-test-01',
      deviceId: 'dev-healthy',
      deviceName: 'Gate Barrier',
      errorType: 'VENDOR_API_ERROR',
      message: 'Gateway unreachable',
      createdAt: new Date().toISOString(),
      status: 'OPEN',
      suggestedAction: 'Check network switch',
    });

    const escalated = service.escalateError(adminActor, {
      errorId: err.id,
      targetDepartment: 'FACILITY',
      escalationNotes: 'Cable cut at main gate',
      createWorkOrder: true,
    });
    expect(escalated.status).toBe('ESCALATED');
    expect(escalated.correctiveWorkOrderId).toBeDefined();

    const resolved = service.resolveError(adminActor, {
      errorId: err.id,
      resolutionAction: 'REPLACED_CABLE',
      notes: 'New CAT6 cable installed and verified',
      correctiveWorkOrderId: escalated.correctiveWorkOrderId,
    });
    expect(resolved.status).toBe('RESOLVED');
    expect(resolved.resolvedBy).toBe('Admin');
  });
});
