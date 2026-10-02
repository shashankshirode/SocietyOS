import { SmartMeterConnectorService } from '../services/smartMeterConnectorService';
import type { HardwareActorContext } from '../services/hardwareActor';

describe('Smart Meter Connector Invariants', () => {
  let service: SmartMeterConnectorService;
  const adminActor: HardwareActorContext = {
    userId: 'admin-01',
    userName: 'Utility Admin',
    userRole: 'FACILITY_MANAGER',
    societyId: 'soc-alpha',
  };

  beforeEach(() => {
    service = new SmartMeterConnectorService();
    service.registerMeter({
      id: 'mtr-w-01',
      meterCode: 'WM-A101',
      unitNumber: 'A-101',
      type: 'WATER',
      status: 'ONLINE',
      lastReadingValue: 100.0,
      lastReadingDate: '2026-06-01T00:00:00Z',
      billingReadiness: 'READY',
      societyId: 'soc-alpha',
    });
  });

  test('normal reading calculates positive consumption with VALIDATED status', () => {
    const reading = service.ingestReading(adminActor, {
      meterId: 'mtr-w-01',
      currentValue: 125.5,
      readingDate: '2026-06-02T00:00:00Z',
      source: 'AUTOMATIC',
    });

    expect(reading.consumptionValue).toBe(25.5);
    expect(reading.status).toBe('VALIDATED');
    expect(reading.billingReadiness).toBe('READY');
    expect(reading.isDecreasingReset).toBe(false);
  });

  test('decreasing reading flags meter reset anomaly and avoids negative consumption', () => {
    const reading = service.ingestReading(adminActor, {
      meterId: 'mtr-w-01',
      currentValue: 80.0,
      readingDate: '2026-06-03T00:00:00Z',
      source: 'AUTOMATIC',
    });

    expect(reading.consumptionValue).toBe(0);
    expect(reading.status).toBe('ERROR');
    expect(reading.billingReadiness).toBe('ERROR');
    expect(reading.isDecreasingReset).toBe(true);
  });

  test('consumption outlier is flagged for operational review', () => {
    const reading = service.ingestReading(adminActor, {
      meterId: 'mtr-w-01',
      currentValue: 850.0,
      readingDate: '2026-06-04T00:00:00Z',
      source: 'AUTOMATIC',
    });

    expect(reading.isOutlier).toBe(true);
    expect(reading.billingReadiness).toBe('PENDING_VALIDATION');
  });

  test('batch import validates each reading and isolates invalid rows', () => {
    const res = service.importReadings(adminActor, {
      readings: [
        { meterCode: 'WM-A101', readingValue: 110.0, readingDate: '2026-06-05T00:00:00Z', source: 'IMPORT' },
        { meterCode: 'WM-NONEXISTENT', readingValue: 99.0, readingDate: '2026-06-05T00:00:00Z', source: 'IMPORT' },
      ],
    });

    expect(res.imported).toBe(1);
    expect(res.failed).toBe(1);
  });
});
