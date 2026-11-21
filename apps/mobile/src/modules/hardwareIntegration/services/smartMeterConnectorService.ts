import type {
  SmartMeter,
  SmartMeterReading,
  SmartMeterDashboardData,
} from '../../../shared/types/smartMeter.types';
import type { ImportMeterReadingsCommand } from '../../../shared/types/hardware.types';
import {
  assertSocietyAccess,
  assertHumanPrivilege,
  type HardwareActorContext,
} from './hardwareActor';
import { connectorFrameworkService } from './connectorFrameworkService';

export class SmartMeterConnectorService {
  private readonly meters = new Map<string, SmartMeter>();
  private readonly readings = new Map<string, SmartMeterReading[]>();

  registerMeter(meter: SmartMeter): void {
    this.meters.set(meter.id, meter);
    if (!this.readings.has(meter.id)) {
      this.readings.set(meter.id, []);
    }
  }

  ingestReading(
    actor: HardwareActorContext,
    input: {
      meterId: string;
      currentValue: number;
      readingDate: string;
      source: 'AUTOMATIC' | 'MANUAL' | 'IMPORT' | 'ESTIMATED';
      unitNumber?: string;
    }
  ): SmartMeterReading {
    const meter = this.meters.get(input.meterId);
    if (!meter) {
      throw new Error(`METER_NOT_FOUND: Smart meter ${input.meterId} does not exist.`);
    }
    assertSocietyAccess(actor, meter.societyId);

    const dedupeKey = connectorFrameworkService.computeDeterministicDedupeKey(
      'METER',
      meter.id,
      String(input.currentValue),
      input.readingDate
    );

    if (connectorFrameworkService.isDuplicateEvent(dedupeKey)) {
      const existing = (this.readings.get(meter.id) || []).find(r => r.deduplicationKey === dedupeKey);
      if (existing) {
        return existing;
      }
    }

    const previousValue = meter.lastReadingValue;
    const isDecreasing = input.currentValue < previousValue;
    const rawConsumption = isDecreasing ? 0 : input.currentValue - previousValue;
    const isOutlier = previousValue > 0 && rawConsumption > previousValue * 5;

    let status: SmartMeterReading['status'] = 'VALIDATED';
    let billingReadiness: SmartMeterReading['billingReadiness'] = 'READY';
    let note: string | undefined;

    if (isDecreasing) {
      status = 'ERROR';
      billingReadiness = 'ERROR';
      note = 'REVERSE_OR_RESET_DETECTED: Reading is lower than previous recorded reading.';
    } else if (isOutlier) {
      status = 'VALIDATED';
      billingReadiness = 'PENDING_VALIDATION';
      note = 'CONSUMPTION_OUTLIER: Consumption exceeds 5x historical reading baseline.';
    }

    const reading: SmartMeterReading = {
      id: `smr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      meterId: meter.id,
      meterCode: meter.meterCode,
      unitNumber: input.unitNumber || meter.unitNumber,
      type: meter.type,
      previousReadingValue: previousValue,
      currentReadingValue: input.currentValue,
      consumptionValue: rawConsumption,
      readingDate: input.readingDate,
      source: input.source,
      status,
      billingReadiness,
      errorNote: note,
      sourceTimestamp: input.readingDate,
      receivedAt: new Date().toISOString(),
      isOutlier,
      isDecreasingReset: isDecreasing,
      deduplicationKey: dedupeKey,
    };

    if (!isDecreasing) {
      meter.lastReadingValue = input.currentValue;
      meter.lastReadingDate = input.readingDate;
    }

    const list = this.readings.get(meter.id) || [];
    list.push(reading);
    this.readings.set(meter.id, list);

    return reading;
  }

  importReadings(actor: HardwareActorContext, command: ImportMeterReadingsCommand): { imported: number; failed: number } {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'FACILITY_MANAGER', 'INTEGRATION_ADMIN']);
    let imported = 0;
    let failed = 0;

    for (const r of command.readings) {
      const meter = Array.from(this.meters.values()).find(m => m.meterCode === r.meterCode);
      if (!meter) {
        failed += 1;
        continue;
      }
      try {
        this.ingestReading(actor, {
          meterId: meter.id,
          currentValue: r.readingValue,
          readingDate: r.readingDate,
          source: r.source,
        });
        imported += 1;
      } catch {
        failed += 1;
      }
    }

    return { imported, failed };
  }

  getDashboardData(): SmartMeterDashboardData {
    const allMeters = Array.from(this.meters.values());
    const online = allMeters.filter(m => m.status === 'ONLINE').length;
    const offline = allMeters.filter(m => m.status === 'OFFLINE').length;
    const electricity = allMeters.filter(m => m.type === 'ELECTRICITY').length;
    const water = allMeters.filter(m => m.type === 'WATER').length;
    const gas = allMeters.filter(m => m.type === 'GAS').length;

    let readingErrors = 0;
    for (const list of this.readings.values()) {
      readingErrors += list.filter(r => r.status === 'ERROR' || r.isDecreasingReset).length;
    }

    return {
      totalMeters: allMeters.length,
      electricityMetersCount: electricity,
      waterMetersCount: water,
      gasMetersCount: gas,
      onlineMetersCount: online,
      offlineMetersCount: offline,
      readingErrorsCount: readingErrors,
      lastImportDate: new Date().toISOString(),
    };
  }

  listMeters(): SmartMeter[] {
    return Array.from(this.meters.values());
  }

  listReadingsForMeter(meterId: string): SmartMeterReading[] {
    return this.readings.get(meterId) || [];
  }

  seedInitialMeters(meters: SmartMeter[]): void {
    for (const m of meters) {
      this.meters.set(m.id, m);
    }
  }

  seedInitialReadings(readings: SmartMeterReading[]): void {
    for (const r of readings) {
      const list = this.readings.get(r.meterId) || [];
      list.push(r);
      this.readings.set(r.meterId, list);
    }
  }
}

export const smartMeterConnectorService = new SmartMeterConnectorService();
