import {
  deviceRegistryService,
  rfidIntegrationService,
  anprIntegrationService,
  boomBarrierService,
  cctvIntegrationService,
  smartMeterConnectorService,
  evChargingConnectorService,
  connectorFrameworkService,
  type HardwareActorContext,
  assertSocietyAccess,
  assertDeviceIngestionPrivilege,
} from '../services';

describe('Mandatory End-to-End Production Scenarios (A through J)', () => {
  const adminActor: HardwareActorContext = {
    userId: 'admin-01',
    userName: 'Integration Admin',
    userRole: 'SUPER_ADMIN',
    societyId: 'soc-canonical',
  };

  const guardActor: HardwareActorContext = {
    userId: 'guard-01',
    userName: 'Gate Guard',
    userRole: 'SECURITY_GUARD',
    societyId: 'soc-canonical',
  };

  const deviceActor: HardwareActorContext = {
    userId: 'dev-conn-01',
    userName: 'Hardware Connector',
    userRole: 'HARDWARE_CONNECTOR',
    societyId: 'soc-canonical',
    isDeviceCredential: true,
  };

  const residentActor: HardwareActorContext = {
    userId: 'res-99',
    userName: 'Resident Dave',
    userRole: 'RESIDENT',
    societyId: 'soc-canonical',
  };

  test('SCENARIO A — RFID RESIDENT VEHICLE: Tag validated, gate policy evaluates, barrier commanded', () => {
    rfidIntegrationService.createTagMapping(adminActor, {
      tagCode: 'E200-ABCD-1234',
      vehicleId: 'veh-res-101',
      vehicleNumber: 'MH-12-AB-1234',
      unitNumber: 'A-101',
      validFrom: '2026-01-01T00:00:00Z',
      validUntil: '2026-12-31T23:59:59Z',
      accessZone: 'MAIN_GATE',
      status: 'ACTIVE',
    });

    boomBarrierService.registerBarrier({
      id: 'bb-main-01',
      name: 'Main Gate Barrier',
      deviceCode: 'HW-BB-01',
      location: 'Main Entry Gate',
      status: 'CLOSED',
      deniedCount: 0,
    });

    const scan = rfidIntegrationService.processScanEvent(deviceActor, {
      deviceId: 'reader-01',
      deviceName: 'RFID Lane 1',
      tagCode: 'E200-ABCD-1234',
      timestamp: '2026-07-01T08:00:00Z',
      gateLocation: 'Main Entry Gate',
    });

    expect(scan.accessGranted).toBe(true);
    expect(scan.event.accessResult).toBe('ALLOWED');

    const barrierCmd = boomBarrierService.issueCommand(guardActor, {
      barrierId: 'bb-main-01',
      commandType: 'OPEN',
      idempotencyKey: `auto-open-${scan.event.id}`,
      reason: 'RFID Verified Entry',
    });

    expect(barrierCmd.state).toBe('CONFIRMED');
    const barrier = boomBarrierService.getBarrier('bb-main-01')!;
    expect(barrier.status).toBe('OPEN');
  });

  test('SCENARIO B — RFID OFFLINE REVOCATION RACE: Stale allowlist access flagged upon sync', () => {
    const mapping = rfidIntegrationService.createTagMapping(adminActor, {
      tagCode: 'TAG-RACE-001',
      vehicleNumber: 'MH-12-REV-001',
      validFrom: '2026-01-01T00:00:00Z',
      validUntil: '2026-12-31T23:59:59Z',
      accessZone: 'GATE_2',
      status: 'ACTIVE',
    });

    rfidIntegrationService.updateTagMapping(adminActor, mapping.id, { status: 'BLOCKED' });

    const replayScan = rfidIntegrationService.processScanEvent(deviceActor, {
      deviceId: 'reader-gate2',
      deviceName: 'Gate 2 Reader',
      tagCode: 'TAG-RACE-001',
      timestamp: '2026-07-02T10:00:00Z',
      gateLocation: 'Gate 2',
      isOfflineReplay: true,
      controllerAllowlistTimestamp: '2026-07-01T00:00:00Z',
    });

    expect(replayScan.event.stalePolicyDetected).toBe(true);
    expect(replayScan.accessGranted).toBe(false);
  });

  test('SCENARIO C — LOW-CONFIDENCE ANPR: No automatic barrier open; requires guard review', () => {
    anprIntegrationService.registerVehicleEntitlement({
      vehicleId: 'veh-555',
      vehicleNumber: 'MH12CD5555',
      unitNumber: 'C-303',
      status: 'ACTIVE',
    });

    const capture = anprIntegrationService.processCaptureEvent(deviceActor, {
      deviceId: 'cam-anpr-01',
      deviceName: 'Entry ANPR Camera',
      detectedPlateText: 'MH12CD5555',
      confidence: 0.65,
      gateLocation: 'Main Gate',
      timestamp: '2026-07-01T11:00:00Z',
    });

    expect(capture.accessGranted).toBe(false);
    expect(capture.requiresReview).toBe(true);
    expect(capture.event.status).toBe('LOW_CONFIDENCE');

    const review = anprIntegrationService.reviewMatch(guardActor, {
      eventId: capture.event.id,
      reviewerDecision: 'MATCH_TO_VEHICLE',
      notes: 'Rain on lens lowered OCR score. Guard confirmed physical plate MH12CD5555.',
      matchedVehicleId: 'veh-555',
    });

    expect(review.reviewerDecision).toBe('MATCH_TO_VEHICLE');
    expect(capture.event.status).toBe('MATCHED');
  });

  test('SCENARIO D — BARRIER TIMEOUT: Unconfirmed command marks TIMED_OUT and reconciles later', () => {
    boomBarrierService.registerBarrier({
      id: 'bb-timeout-gate',
      name: 'North Gate Barrier',
      deviceCode: 'HW-BB-02',
      location: 'North Gate',
      status: 'CLOSED',
      deniedCount: 0,
    });

    const timedOutCmd = boomBarrierService.issueCommand(guardActor, {
      barrierId: 'bb-timeout-gate',
      commandType: 'OPEN',
      idempotencyKey: 'cmd-timeout-test-1',
      simulateTimeout: true,
    });

    expect(timedOutCmd.state).toBe('TIMED_OUT');
    const barrier = boomBarrierService.getBarrier('bb-timeout-gate')!;
    expect(barrier.lastCommandState).toBe('TIMED_OUT');

    const reconciled = boomBarrierService.reconcilePhysicalState('bb-timeout-gate', 'OPEN', 'OPEN');
    expect(reconciled.lastCommandState).toBe('CONFIRMED');
    expect(reconciled.status).toBe('OPEN');
  });

  test('SCENARIO E — CCTV INCIDENT ACCESS: Scope and purpose enforced; private evidence verified', () => {
    cctvIntegrationService.registerCamera({
      id: 'cam-lobby-01',
      name: 'Tower B Lobby Camera',
      deviceCode: 'CCTV-TB-01',
      location: 'Tower B',
      coverageArea: 'Lobby',
      status: 'ONLINE',
      recordingEnabled: true,
      accessLevel: 'ADMIN_APPROVAL_REQUIRED',
      lastHealthCheck: new Date().toISOString(),
      societyId: 'soc-canonical',
    });

    const req = cctvIntegrationService.requestAccess(guardActor, {
      cameraId: 'cam-lobby-01',
      reason: 'Theft reported in lobby bicycle rack',
      purpose: 'SECURITY_INCIDENT',
      durationMinutes: 45,
      incidentReferenceId: 'inc-theft-991',
    });

    expect(req.status).toBe('PENDING');

    const approved = cctvIntegrationService.approveAccess(adminActor, req.id);
    expect(approved.status).toBe('APPROVED');
    expect(approved.accessToken).toBeDefined();

    const verified = cctvIntegrationService.verifyAccessToken(guardActor, req.id, approved.accessToken!);
    expect(verified.valid).toBe(true);
    expect(verified.evidenceReference).toContain('cctv://vault/evidence');

    expect(() =>
      cctvIntegrationService.requestAccess(residentActor, {
        cameraId: 'cam-lobby-01',
        reason: 'Checking neighbors',
        purpose: 'SECURITY_INCIDENT',
        durationMinutes: 45,
      })
    ).toThrow('CCTV_ACCESS_DENIED');
  });

  test('SCENARIO F — CONNECTOR OUTAGE: Circuit breaker opens on repeated failure; manual operation continues', () => {
    connectorFrameworkService.registerConnector({
      connectorId: 'conn-anpr-vendor',
      name: 'External ANPR Cloud',
      connectorType: 'ANPR',
      protocol: 'REST',
      timeoutMs: 2000,
      maxRetries: 3,
      rateLimitPerMinute: 60,
      isOnline: true,
    });

    expect(connectorFrameworkService.getCircuitState('conn-anpr-vendor')).toBe('CLOSED');

    connectorFrameworkService.recordConnectorFailure('conn-anpr-vendor');
    connectorFrameworkService.recordConnectorFailure('conn-anpr-vendor');
    connectorFrameworkService.recordConnectorFailure('conn-anpr-vendor');

    expect(connectorFrameworkService.getCircuitState('conn-anpr-vendor')).toBe('OPEN');

    const manualCmd = boomBarrierService.manualOverride(guardActor, {
      barrierId: 'bb-main-01',
      reason: 'ANPR provider offline; manual check performed for visitor DL-04-XY-1010',
      overrideType: 'MANUAL_SUPERVISOR',
    });
    expect(manualCmd.state).toBe('CONFIRMED');
  });

  test('SCENARIO G — DUPLICATE DEVICE EVENT: Five identical RFID retries produce one logical admission', () => {
    let allowedCount = 0;
    for (let i = 0; i < 5; i++) {
      const res = rfidIntegrationService.processScanEvent(deviceActor, {
        deviceId: 'reader-01',
        deviceName: 'RFID Lane 1',
        tagCode: 'E200-ABCD-1234',
        timestamp: '2026-07-01T12:00:00Z',
        gateLocation: 'Main Entry Gate',
      });
      if (res.accessGranted) allowedCount += 1;
    }

    expect(allowedCount).toBe(5);
    const events = rfidIntegrationService.listEvents().filter(e => e.timestamp === '2026-07-01T12:00:00Z');
    expect(events.length).toBe(1);
  });

  test('SCENARIO H — METER CONNECTOR: Replays deduped, decreasing reset detected, no direct bill created', () => {
    smartMeterConnectorService.registerMeter({
      id: 'mtr-w-e2e',
      meterCode: 'WM-E2E-01',
      unitNumber: 'B-302',
      type: 'WATER',
      status: 'ONLINE',
      lastReadingValue: 200.0,
      lastReadingDate: '2026-07-01T00:00:00Z',
      billingReadiness: 'READY',
      societyId: 'soc-canonical',
    });

    const reading1 = smartMeterConnectorService.ingestReading(deviceActor, {
      meterId: 'mtr-w-e2e',
      currentValue: 220.0,
      readingDate: '2026-07-02T00:00:00Z',
      source: 'AUTOMATIC',
    });
    expect(reading1.consumptionValue).toBe(20.0);

    const replayed = smartMeterConnectorService.ingestReading(deviceActor, {
      meterId: 'mtr-w-e2e',
      currentValue: 220.0,
      readingDate: '2026-07-02T00:00:00Z',
      source: 'AUTOMATIC',
    });
    expect(replayed.id).toBe(reading1.id);

    const decreasing = smartMeterConnectorService.ingestReading(deviceActor, {
      meterId: 'mtr-w-e2e',
      currentValue: 50.0,
      readingDate: '2026-07-03T00:00:00Z',
      source: 'AUTOMATIC',
    });
    expect(decreasing.isDecreasingReset).toBe(true);
    expect(decreasing.consumptionValue).toBe(0);
    expect(decreasing.status).toBe('ERROR');
  });

  test('SCENARIO I — EV CONNECTOR: START and STOP out-of-order reconciled without ledger posting', () => {
    evChargingConnectorService.registerCharger({
      id: 'chg-e2e-01',
      name: 'Basement Fast Charger',
      chargerCode: 'EV-FC-01',
      location: 'Basement Lane A',
      connectorType: 'Type2',
      status: 'AVAILABLE',
      totalEnergyDeliveredKwh: 100,
      billingReadiness: 'READY',
      societyId: 'soc-canonical',
    });

    const stopEvent = evChargingConnectorService.processSessionEvent(deviceActor, {
      chargerId: 'chg-e2e-01',
      externalSessionId: 'sess-ooo-e2e',
      eventType: 'STOP',
      timestamp: '2026-07-01T18:00:00Z',
      energyConsumedKwh: 30.5,
      meterEndKwh: 130.5,
    });
    expect(stopEvent.status).toBe('COMPLETED');

    const delayedStartEvent = evChargingConnectorService.processSessionEvent(deviceActor, {
      chargerId: 'chg-e2e-01',
      externalSessionId: 'sess-ooo-e2e',
      eventType: 'START',
      timestamp: '2026-07-01T16:30:00Z',
      meterStartKwh: 100.0,
    });

    expect(delayedStartEvent.status).toBe('COMPLETED');
    expect(delayedStartEvent.startTime).toBe('2026-07-01T16:30:00Z');
    expect(delayedStartEvent.endTime).toBe('2026-07-01T18:00:00Z');
    expect(delayedStartEvent.energyConsumedKwh).toBe(30.5);
    expect(delayedStartEvent.billingStatus).toBe('PENDING');
  });

  test('SCENARIO J — DEVICE SPOOFING: Human token cannot inject raw device event; cross-society spoofing blocked', () => {
    expect(() => assertDeviceIngestionPrivilege(residentActor)).toThrow('HUMAN_TOKEN_CANNOT_INJECT_DEVICE_EVENTS');

    deviceRegistryService.registerDevice(adminActor, {
      name: 'Gate 1 RFID',
      type: 'RFID_READER',
      deviceCode: 'DEV-A-001',
      vendor: 'HID',
      location: 'Gate 1',
      linkedModule: 'GATE',
    });

    const rogueDeviceActor: HardwareActorContext = {
      userId: 'dev-rogue',
      userName: 'Rogue Device',
      userRole: 'HARDWARE_CONNECTOR',
      societyId: 'soc-malicious',
      isDeviceCredential: true,
    };

    expect(() => assertSocietyAccess(rogueDeviceActor, 'soc-canonical')).toThrow('CROSS_SOCIETY_ACCESS_DENIED');
  });
});
