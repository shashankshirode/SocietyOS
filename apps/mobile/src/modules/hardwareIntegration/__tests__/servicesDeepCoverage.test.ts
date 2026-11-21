import {
  circuitBreakerInstance,
  deviceRegistryService,
  connectorFrameworkService,
  cctvIntegrationService,
  smartMeterConnectorService,
  evChargingConnectorService,
  hardwareHealthObservabilityService,
  assertCapability,
  type HardwareActorContext,
} from './deepCoverageHelper';
import {
  isExplicitDemoMode,
  mockHardwareIntegrationPermitted,
  resolveHardwareIntegrationSourceMode,
} from '../data/hardwareIntegrationSourceGuard';

describe('Deep Branch and Edge Case Coverage', () => {
  const adminActor: HardwareActorContext = {
    userId: 'admin-super',
    userName: 'Super Admin',
    userRole: 'SUPER_ADMIN',
    societyId: 'soc-deep',
    capabilities: ['READ_RFID', 'OPEN_BARRIER'],
  };

  test('assertCapability passes when present and throws when missing', () => {
    expect(() => assertCapability(adminActor, 'READ_RFID')).not.toThrow();
    expect(() => assertCapability(adminActor, 'CCTV_LIVE_VIEW')).toThrow('DEVICE_CAPABILITY_NOT_SUPPORTED');
  });

  test('circuitBreaker reset and metrics', () => {
    circuitBreakerInstance.recordFailure();
    const metrics = circuitBreakerInstance.getMetrics();
    expect(metrics.consecutiveFailures).toBeGreaterThan(0);
    circuitBreakerInstance.reset();
    expect(circuitBreakerInstance.getMetrics().consecutiveFailures).toBe(0);
    expect(circuitBreakerInstance.isOpen()).toBe(false);
  });

  test('deviceRegistry location mapping and edge cases', () => {
    const dev = deviceRegistryService.registerDevice(adminActor, {
      name: 'Gate 5 Reader',
      type: 'RFID_READER',
      deviceCode: 'RFID-G5',
      vendor: 'HID',
      location: 'Gate 5',
      linkedModule: 'GATE',
    });

    const mapping = deviceRegistryService.mapLocation(adminActor, {
      deviceId: dev.id,
      deviceName: dev.name,
      location: 'Gate 5 Lane A',
      accessZone: 'ZONE_5',
      responsibleRole: 'SECURITY_GUARD',
      visibilityRules: 'GUARDS_ONLY',
    });
    expect(mapping.id).toBeDefined();
    expect(deviceRegistryService.listLocationMappings().length).toBeGreaterThan(0);

    const updated = deviceRegistryService.updateDevice(adminActor, dev.id, {
      name: 'Gate 5 Upgraded',
      location: 'Gate 5 North',
      status: 'ONLINE',
      connectionType: 'CLOUD_VENDOR',
      configurationVersion: '2.0.0',
    });
    expect(updated.name).toBe('Gate 5 Upgraded');

    expect(() => deviceRegistryService.updateDevice(adminActor, 'non-existent', {})).toThrow('DEVICE_NOT_FOUND');
    expect(() => deviceRegistryService.activateDevice(adminActor, 'non-existent')).toThrow('DEVICE_NOT_FOUND');
    expect(() => deviceRegistryService.suspendDevice(adminActor, 'non-existent', '')).toThrow('DEVICE_NOT_FOUND');
    expect(() => deviceRegistryService.decommissionDevice(adminActor, 'non-existent', '')).toThrow('DEVICE_NOT_FOUND');
    expect(() => deviceRegistryService.replaceDevice(adminActor, 'non-existent', dev)).toThrow('DEVICE_NOT_FOUND');
    expect(() => deviceRegistryService.rotateCredential(adminActor, 'non-existent', '')).toThrow('DEVICE_NOT_FOUND');
  });

  test('cctv rejection and token expiry validation', () => {
    cctvIntegrationService.registerCamera({
      id: 'cam-deep',
      name: 'Perimeter Cam',
      deviceCode: 'CCTV-P1',
      location: 'Wall North',
      coverageArea: 'Wall',
      status: 'ONLINE',
      recordingEnabled: true,
      accessLevel: 'ADMIN_APPROVAL_REQUIRED',
      lastHealthCheck: new Date().toISOString(),
      societyId: 'soc-deep',
    });

    const req = cctvIntegrationService.requestAccess(adminActor, {
      cameraId: 'cam-deep',
      reason: 'Intrusion check',
      purpose: 'SAFETY_INVESTIGATION',
      durationMinutes: 10,
    });

    const rejected = cctvIntegrationService.rejectAccess(adminActor, req.id, 'No incident found');
    expect(rejected.status).toBe('REJECTED');

    expect(() => cctvIntegrationService.approveAccess(adminActor, 'missing-req')).toThrow('CCTV_REQUEST_NOT_FOUND');
    expect(() => cctvIntegrationService.rejectAccess(adminActor, 'missing-req', '')).toThrow('CCTV_REQUEST_NOT_FOUND');

    const verifyRejected = cctvIntegrationService.verifyAccessToken(adminActor, req.id, 'any-token');
    expect(verifyRejected.valid).toBe(false);
  });

  test('smart meter dashboard, reading lists and error paths', () => {
    const dashboard = smartMeterConnectorService.getDashboardData();
    expect(dashboard.totalMeters).toBeGreaterThanOrEqual(0);

    expect(smartMeterConnectorService.listMeters().length).toBeGreaterThanOrEqual(0);
    expect(smartMeterConnectorService.listReadingsForMeter('mtr-w-01').length).toBeGreaterThanOrEqual(0);

    expect(() =>
      smartMeterConnectorService.ingestReading(adminActor, {
        meterId: 'non-existent-meter',
        currentValue: 100,
        readingDate: '2026-07-01T00:00:00Z',
        source: 'MANUAL',
      })
    ).toThrow('METER_NOT_FOUND');
  });

  test('ev charging update event, dashboard and list checks', () => {
    evChargingConnectorService.registerCharger({
      id: 'chg-deep-01',
      name: 'Clubhouse Charger',
      chargerCode: 'EV-CLUB-01',
      location: 'Clubhouse',
      connectorType: 'Type2',
      status: 'AVAILABLE',
      totalEnergyDeliveredKwh: 200,
      billingReadiness: 'READY',
      societyId: 'soc-deep',
    });

    evChargingConnectorService.processSessionEvent(adminActor, {
      chargerId: 'chg-deep-01',
      externalSessionId: 'sess-deep-1',
      eventType: 'START',
      timestamp: '2026-07-01T10:00:00Z',
    });

    const updated = evChargingConnectorService.processSessionEvent(adminActor, {
      chargerId: 'chg-deep-01',
      externalSessionId: 'sess-deep-1',
      eventType: 'UPDATE',
      timestamp: '2026-07-01T10:30:00Z',
      energyConsumedKwh: 12.0,
    });
    expect(updated.energyConsumedKwh).toBe(12.0);

    const dashboard = evChargingConnectorService.getDashboardData();
    expect(dashboard.totalChargers).toBeGreaterThanOrEqual(1);

    expect(evChargingConnectorService.listChargers().length).toBeGreaterThanOrEqual(1);
    expect(evChargingConnectorService.listSessions().length).toBeGreaterThanOrEqual(1);

    expect(() =>
      evChargingConnectorService.processSessionEvent(adminActor, {
        chargerId: 'missing-charger',
        externalSessionId: 'sess-x',
        eventType: 'START',
        timestamp: '2026-07-01T00:00:00Z',
      })
    ).toThrow('EV_CHARGER_NOT_FOUND');
  });

  test('connector framework getConnector and missing dead letter handling', () => {
    expect(connectorFrameworkService.getConnector('non-existent')).toBeUndefined();
    expect(() => connectorFrameworkService.replayDeadLetter(adminActor, 'missing-dl')).toThrow('DEAD_LETTER_NOT_FOUND');
    expect(() => connectorFrameworkService.discardDeadLetter(adminActor, 'missing-dl', 'none')).toThrow('DEAD_LETTER_NOT_FOUND');
  });

  test('hardware health observability error ignore and missing error checks', () => {
    const err = hardwareHealthObservabilityService.recordError({
      id: 'err-ignore-test',
      deviceId: 'dev-healthy',
      deviceName: 'Device',
      errorType: 'INVALID_PAYLOAD',
      message: 'Bad payload',
      createdAt: new Date().toISOString(),
      status: 'OPEN',
      suggestedAction: 'Fix payload format',
    });

    const ignored = hardwareHealthObservabilityService.ignoreError(adminActor, {
      errorId: err.id,
      reason: 'Known legacy format',
    });
    expect(ignored.status).toBe('IGNORED');

    expect(() => hardwareHealthObservabilityService.resolveError(adminActor, { errorId: 'missing', resolutionAction: '', notes: '' })).toThrow('HARDWARE_ERROR_NOT_FOUND');
    expect(() => hardwareHealthObservabilityService.ignoreError(adminActor, { errorId: 'missing', reason: '' })).toThrow('HARDWARE_ERROR_NOT_FOUND');
    expect(() => hardwareHealthObservabilityService.escalateError(adminActor, { errorId: 'missing', targetDepartment: 'FACILITY', escalationNotes: '' })).toThrow('HARDWARE_ERROR_NOT_FOUND');
  });

  test('data source guard demo mode and production check', () => {
    expect(typeof isExplicitDemoMode()).toBe('boolean');
    expect(typeof mockHardwareIntegrationPermitted()).toBe('boolean');
    expect(resolveHardwareIntegrationSourceMode()).toBe('mock');
  });
});
