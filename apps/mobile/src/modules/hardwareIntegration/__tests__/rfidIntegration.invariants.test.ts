import { RfidIntegrationService } from '../services/rfidIntegrationService';
import type { HardwareActorContext } from '../services/hardwareActor';

describe('RFID Integration Invariants', () => {
  let service: RfidIntegrationService;
  const adminActor: HardwareActorContext = {
    userId: 'admin-01',
    userName: 'Admin',
    userRole: 'SUPER_ADMIN',
    societyId: 'soc-alpha',
  };

  beforeEach(() => {
    service = new RfidIntegrationService();
  });

  test('creates effective-dated tag mapping and enforces temporal non-overlap for active tags', () => {
    service.createTagMapping(adminActor, {
      tagCode: 'TAG-100',
      vehicleNumber: 'MH-12-AB-1234',
      validFrom: '2026-01-01T00:00:00Z',
      validUntil: '2026-06-30T23:59:59Z',
      accessZone: 'MAIN_GATE',
      status: 'ACTIVE',
    });

    expect(() =>
      service.createTagMapping(adminActor, {
        tagCode: 'TAG-100',
        vehicleNumber: 'MH-12-CD-5678',
        validFrom: '2026-04-01T00:00:00Z',
        validUntil: '2026-12-31T23:59:59Z',
        accessZone: 'MAIN_GATE',
        status: 'ACTIVE',
      })
    ).toThrow('RFID_MAPPING_CONFLICT');
  });

  test('correctly evaluates gate access for active, expired, blocked, and unknown tags', () => {
    service.createTagMapping(adminActor, {
      tagCode: 'TAG-ACTIVE',
      vehicleNumber: 'MH-12-OK-1111',
      validFrom: '2026-01-01T00:00:00Z',
      validUntil: '2026-12-31T23:59:59Z',
      accessZone: 'MAIN_GATE',
      status: 'ACTIVE',
    });

    service.createTagMapping(adminActor, {
      tagCode: 'TAG-BLOCKED',
      vehicleNumber: 'MH-12-BAD-9999',
      validFrom: '2026-01-01T00:00:00Z',
      validUntil: '2026-12-31T23:59:59Z',
      accessZone: 'MAIN_GATE',
      status: 'BLOCKED',
    });

    const activeRes = service.processScanEvent(adminActor, {
      deviceId: 'reader-01',
      deviceName: 'Gate Reader',
      tagCode: 'TAG-ACTIVE',
      timestamp: '2026-06-15T12:00:00Z',
      gateLocation: 'Main Gate',
    });
    expect(activeRes.accessGranted).toBe(true);
    expect(activeRes.event.accessResult).toBe('ALLOWED');

    const blockedRes = service.processScanEvent(adminActor, {
      deviceId: 'reader-01',
      deviceName: 'Gate Reader',
      tagCode: 'TAG-BLOCKED',
      timestamp: '2026-06-15T12:01:00Z',
      gateLocation: 'Main Gate',
    });
    expect(blockedRes.accessGranted).toBe(false);
    expect(blockedRes.event.accessResult).toBe('BLOCKED_VEHICLE');

    const expiredRes = service.processScanEvent(adminActor, {
      deviceId: 'reader-01',
      deviceName: 'Gate Reader',
      tagCode: 'TAG-ACTIVE',
      timestamp: '2027-01-15T12:00:00Z',
      gateLocation: 'Main Gate',
    });
    expect(expiredRes.accessGranted).toBe(false);
    expect(expiredRes.event.accessResult).toBe('EXPIRED_TAG');

    const unknownRes = service.processScanEvent(adminActor, {
      deviceId: 'reader-01',
      deviceName: 'Gate Reader',
      tagCode: 'TAG-UNKNOWN-99',
      timestamp: '2026-06-15T12:02:00Z',
      gateLocation: 'Main Gate',
    });
    expect(unknownRes.accessGranted).toBe(false);
    expect(unknownRes.event.accessResult).toBe('UNKNOWN_TAG');
  });

  test('detects offline revocation race conditions upon reconciliation', () => {
    const mapping = service.createTagMapping(adminActor, {
      tagCode: 'TAG-OFFLINE-RACE',
      vehicleNumber: 'MH-12-RC-2020',
      validFrom: '2026-01-01T00:00:00Z',
      validUntil: '2026-12-31T23:59:59Z',
      accessZone: 'MAIN_GATE',
      status: 'ACTIVE',
    });

    service.updateTagMapping(adminActor, mapping.id, { status: 'LOST' });

    const scan = service.processScanEvent(adminActor, {
      deviceId: 'reader-offline',
      deviceName: 'Offline Gate Reader',
      tagCode: 'TAG-OFFLINE-RACE',
      timestamp: '2026-06-20T10:00:00Z',
      gateLocation: 'Emergency Gate',
      isOfflineReplay: true,
      controllerAllowlistTimestamp: '2026-06-19T00:00:00Z',
    });

    expect(scan.event.stalePolicyDetected).toBe(true);
    expect(scan.accessGranted).toBe(false);
  });
});
