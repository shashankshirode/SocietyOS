import { EvChargingConnectorService } from '../services/evChargingConnectorService';
import type { HardwareActorContext } from '../services/hardwareActor';

describe('EV Charging Connector Invariants', () => {
  let service: EvChargingConnectorService;
  const adminActor: HardwareActorContext = {
    userId: 'admin-01',
    userName: 'EV Admin',
    userRole: 'FACILITY_MANAGER',
    societyId: 'soc-alpha',
  };

  beforeEach(() => {
    service = new EvChargingConnectorService();
    service.registerCharger({
      id: 'chg-01',
      name: 'Tower A Fast Charger',
      chargerCode: 'EV-TWA-01',
      location: 'Basement 1',
      connectorType: 'CCS2',
      status: 'AVAILABLE',
      totalEnergyDeliveredKwh: 500,
      billingReadiness: 'READY',
      societyId: 'soc-alpha',
    });
  });

  test('normal session lifecycle updates charger status and accumulates energy', () => {
    const start = service.processSessionEvent(adminActor, {
      chargerId: 'chg-01',
      externalSessionId: 'sess-abc-1',
      eventType: 'START',
      timestamp: '2026-07-01T14:00:00Z',
      claimedResidentName: 'Alice',
      claimedUnitNumber: 'A-201',
      vehicleNumberMasked: 'MH-12-**-9988',
      meterStartKwh: 1200,
    });

    expect(start.status).toBe('IN_PROGRESS');
    const chargerOccupied = service.listChargers().find(c => c.id === 'chg-01')!;
    expect(chargerOccupied.status).toBe('OCCUPIED');

    const stop = service.processSessionEvent(adminActor, {
      chargerId: 'chg-01',
      externalSessionId: 'sess-abc-1',
      eventType: 'STOP',
      timestamp: '2026-07-01T15:30:00Z',
      energyConsumedKwh: 24.5,
      meterEndKwh: 1224.5,
    });

    expect(stop.status).toBe('COMPLETED');
    expect(stop.energyConsumedKwh).toBe(24.5);
    const chargerFree = service.listChargers().find(c => c.id === 'chg-01')!;
    expect(chargerFree.status).toBe('AVAILABLE');
    expect(chargerFree.totalEnergyDeliveredKwh).toBe(524.5);
  });

  test('reconciles out-of-order session events when STOP arrives before delayed START', () => {
    const stopFirst = service.processSessionEvent(adminActor, {
      chargerId: 'chg-01',
      externalSessionId: 'sess-ooo-99',
      eventType: 'STOP',
      timestamp: '2026-07-01T16:00:00Z',
      energyConsumedKwh: 15.0,
      meterEndKwh: 2015,
    });
    expect(stopFirst.status).toBe('COMPLETED');

    const delayedStart = service.processSessionEvent(adminActor, {
      chargerId: 'chg-01',
      externalSessionId: 'sess-ooo-99',
      eventType: 'START',
      timestamp: '2026-07-01T15:00:00Z',
      meterStartKwh: 2000,
    });

    expect(delayedStart.status).toBe('COMPLETED');
    expect(delayedStart.startTime).toBe('2026-07-01T15:00:00Z');
    expect(delayedStart.endTime).toBe('2026-07-01T16:00:00Z');
    expect(delayedStart.energyConsumedKwh).toBe(15.0);
  });
});
