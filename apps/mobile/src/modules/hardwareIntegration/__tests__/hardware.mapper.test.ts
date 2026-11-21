import {
  mapDevice,
  mapEvent,
  mapSmartMeterReading,
  mapEvChargingSession,
  mapSyncJob,
  mapErrorRecord,
  mapHealthRow,
  mapAuditLog,
} from '../data/hardwareIntegration.mapper';
import type {
  HardwareAuditLogEntry,
  HardwareDevice,
  HardwareErrorRecord,
  HardwareEvent,
  HardwareSyncJob,
  IntegrationHealthRow,
} from '../../../shared/types/hardware.types';
import type { SmartMeterReading } from '../../../shared/types/smartMeter.types';
import type { EvChargingSession } from '../../../shared/types/evCharging.types';

describe('Hardware Mapper Tests', () => {
  test('should map Device DTO to Domain model', () => {
    const dto: HardwareDevice = {
      id: 'dev-001',
      name: 'Main Gate Barrier',
      type: 'BOOM_BARRIER' as const,
      deviceCode: 'HW-BB-01',
      status: 'ONLINE' as const,
      location: 'Main Entry Gate',
      vendor: 'FAAC',
      linkedModule: 'GATE' as const,
      lastHeartbeat: '2026-06-30T12:00:00Z',
    };
    const domain = mapDevice(dto);
    expect(domain.id).toBe(dto.id);
    expect(domain.name).toBe(dto.name);
    expect(domain.type).toBe('BOOM_BARRIER');
    expect(domain.status).toBe('ONLINE');
    expect(domain.lastHeartbeat).toBeDefined();
  });

  test('should map GateEvent DTO to Domain model', () => {
    const dto: HardwareEvent = {
      id: 'evt-001',
      deviceId: 'dev-rfid-01',
      deviceName: 'Main Gate RFID',
      eventType: 'RFID_SCAN',
      moduleLinked: 'GATE',
      timestamp: '2026-06-30T12:00:00Z',
      status: 'MATCHED',
      matchedEntityReference: 'MH-12-AB-1234',
      riskLevel: 'LOW',
      safeMetadata: { tagCodeMasked: 'RF-***-1234' },
    };
    const domain = mapEvent(dto);
    expect(domain.id).toBe(dto.id);
    expect(domain.eventType).toBe('RFID_SCAN');
    expect(domain.status).toBe('MATCHED');
  });

  test('should map SmartMeterReading DTO to Domain model', () => {
    const dto: SmartMeterReading = {
      id: 'rdg-001',
      meterId: 'mtr-01',
      unitNumber: '101',
      type: 'ELECTRICITY' as const,
      previousReadingValue: 1200.5,
      currentReadingValue: 1250.2,
      consumptionValue: 49.7,
      readingDate: '2026-06-30T12:00:00Z',
      source: 'AUTOMATIC',
      status: 'VALIDATED',
      billingReadiness: 'READY',
    };
    const domain = mapSmartMeterReading(dto);
    expect(domain.id).toBe(dto.id);
    expect(domain.consumptionValue).toBe(49.7);
  });

  test('should map EvChargingSession DTO to Domain model', () => {
    const dto: EvChargingSession = {
      id: 'sess-001',
      chargerId: 'chg-01',
      chargerName: 'EV Charger 1',
      residentName: 'Alice Smith',
      unitNumber: '202',
      vehicleNumberMasked: 'MH-12-**-5678',
      startTime: '2026-06-30T12:00:00Z',
      endTime: '2026-06-30T14:00:00Z',
      energyConsumedKwh: 22.4,
      costEstimateAmount: 336.0,
      billingStatus: 'BILLED',
      status: 'COMPLETED',
    };
    const domain = mapEvChargingSession(dto);
    expect(domain.id).toBe(dto.id);
    expect(domain.energyConsumedKwh).toBe(22.4);
  });

  test('should map BiometricSyncJob DTO to Domain model', () => {
    const dto: HardwareSyncJob = {
      id: 'job-001',
      deviceId: 'bio-001',
      deviceName: 'Fingerprint Reader 1',
      deviceType: 'BIOMETRIC_DEVICE',
      status: 'COMPLETED',
      startedAt: '2026-06-30T12:00:00Z',
      completedAt: '2026-06-30T12:05:00Z',
      totalRecords: 120,
      importedRecords: 118,
      failedRecords: 2,
      duplicateRecords: 0,
      triggeredBy: 'Test Operator',
    };
    const domain = mapSyncJob(dto);
    expect(domain.id).toBe(dto.id);
    expect(domain.totalRecords).toBe(120);
  });

  test('should map HardwareErrorRecord DTO to Domain model', () => {
    const dto: HardwareErrorRecord = {
      id: 'err-001',
      deviceId: 'dev-02',
      deviceName: 'South Gate Barrier',
      errorType: 'DEVICE_OFFLINE',
      message: 'Connection timed out',
      createdAt: '2026-06-30T12:00:00Z',
      status: 'OPEN',
      suggestedAction: 'Check network cable',
    };
    const domain = mapErrorRecord(dto);
    expect(domain.id).toBe(dto.id);
    expect(domain.status).toBe('OPEN');
  });

  test('should map IntegrationHealthRow DTO to Domain model', () => {
    const dto: IntegrationHealthRow = {
      category: 'RFID Gates',
      status: 'HEALTHY',
      deviceCount: 4,
      onlineCount: 4,
      errorCount: 0,
      lastSync: '2026-06-30T12:00:00Z',
      riskLevel: 'LOW',
      recommendedAction: 'None',
    };
    const domain = mapHealthRow(dto);
    expect(domain.category).toBe(dto.category);
    expect(domain.status).toBe('HEALTHY');
  });

  test('should map HardwareAuditLog DTO to Domain model', () => {
    const dto: HardwareAuditLogEntry = {
      id: 'aud-001',
      timestamp: '2026-06-30T12:00:00Z',
      event: 'MANUAL_OVERRIDE',
      actorName: 'John Doe',
      actorRole: 'SUPER_ADMIN',
      deviceId: 'dev-01',
      deviceName: 'Main Gate Barrier',
      moduleLinked: 'GATE',
      entityReference: 'barrier-main-gate',
      correlationId: 'correlation-test-001',
      safeMetadata: { details: 'Forced gate open via admin panel' },
    };
    const domain = mapAuditLog(dto);
    expect(domain.id).toBe(dto.id);
    expect(domain.event).toBe('MANUAL_OVERRIDE');
  });
});
