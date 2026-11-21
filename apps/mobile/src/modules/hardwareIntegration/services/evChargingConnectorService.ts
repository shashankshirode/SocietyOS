import type {
  EvCharger,
  EvChargingSession,
  EvChargingDashboardData,
} from '../../../shared/types/evCharging.types';
import {
  assertSocietyAccess,
  type HardwareActorContext,
} from './hardwareActor';
import { connectorFrameworkService } from './connectorFrameworkService';

export class EvChargingConnectorService {
  private readonly chargers = new Map<string, EvCharger>();
  private readonly sessions = new Map<string, EvChargingSession>();

  registerCharger(charger: EvCharger): void {
    this.chargers.set(charger.id, charger);
  }

  processSessionEvent(
    actor: HardwareActorContext,
    input: {
      chargerId: string;
      externalSessionId: string;
      eventType: 'START' | 'UPDATE' | 'STOP';
      timestamp: string;
      energyConsumedKwh?: number;
      meterStartKwh?: number;
      meterEndKwh?: number;
      claimedResidentName?: string;
      claimedUnitNumber?: string;
      vehicleNumberMasked?: string;
    }
  ): EvChargingSession {
    const charger = this.chargers.get(input.chargerId);
    if (!charger) {
      throw new Error(`EV_CHARGER_NOT_FOUND: Charger ${input.chargerId} does not exist.`);
    }
    assertSocietyAccess(actor, charger.societyId);

    const dedupeKey = connectorFrameworkService.computeDeterministicDedupeKey(
      'EV',
      charger.id,
      `${input.externalSessionId}_${input.eventType}`,
      input.timestamp
    );

    if (connectorFrameworkService.isDuplicateEvent(dedupeKey)) {
      const existing = this.sessions.get(input.externalSessionId);
      if (existing) {
        return existing;
      }
    }

    let session = this.sessions.get(input.externalSessionId);
    const now = new Date().toISOString();

    if (!session) {
      session = {
        id: `sess-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        chargerId: charger.id,
        chargerName: charger.name,
        residentName: input.claimedResidentName || 'Authorized User',
        unitNumber: input.claimedUnitNumber || 'TBD',
        vehicleNumberMasked: input.vehicleNumberMasked || 'EV-**-****',
        startTime: input.eventType === 'START' ? input.timestamp : now,
        energyConsumedKwh: input.energyConsumedKwh || 0,
        billingStatus: 'PENDING',
        status: input.eventType === 'STOP' ? 'COMPLETED' : 'IN_PROGRESS',
        externalSessionId: input.externalSessionId,
        sourceTimestamp: input.timestamp,
        receivedAt: now,
        deduplicationKey: dedupeKey,
        ...(input.meterStartKwh !== undefined ? { meterStartKwh: input.meterStartKwh } : {}),
        ...(input.meterEndKwh !== undefined ? { meterEndKwh: input.meterEndKwh } : {}),
        ...(input.eventType === 'STOP' ? { endTime: input.timestamp } : {}),
      };
      this.sessions.set(input.externalSessionId, session);
    } else {
      if (input.eventType === 'STOP') {
        session.status = 'COMPLETED';
        session.endTime = input.timestamp;
        if (input.energyConsumedKwh !== undefined) {
          session.energyConsumedKwh = input.energyConsumedKwh;
        }
        if (input.meterEndKwh !== undefined) {
          session.meterEndKwh = input.meterEndKwh;
        }
      } else if (input.eventType === 'UPDATE' && input.energyConsumedKwh !== undefined) {
        session.energyConsumedKwh = input.energyConsumedKwh;
      } else if (input.eventType === 'START') {
        session.startTime = input.timestamp;
      }
    }

    const currentSession = session;

    if (input.eventType === 'START') {
      charger.status = 'OCCUPIED';
      charger.currentSessionId = currentSession.id;
    } else if (input.eventType === 'STOP') {
      charger.status = 'AVAILABLE';
      delete charger.currentSessionId;
      charger.totalEnergyDeliveredKwh += currentSession.energyConsumedKwh;
    }

    return currentSession;
  }

  getDashboardData(): EvChargingDashboardData {
    const all = Array.from(this.chargers.values());
    const available = all.filter(c => c.status === 'AVAILABLE').length;
    const occupied = all.filter(c => c.status === 'OCCUPIED').length;
    const offline = all.filter(c => c.status === 'OFFLINE' || c.status === 'FAULTED').length;

    let totalEnergy = 0;
    for (const s of this.sessions.values()) {
      totalEnergy += s.energyConsumedKwh;
    }

    return {
      totalChargers: all.length,
      availableChargersCount: available,
      occupiedChargersCount: occupied,
      offlineChargersCount: offline,
      totalSessionsToday: this.sessions.size,
      energyConsumedTodayKwh: totalEnergy,
      revenueTodayAmount: 0,
    };
  }

  listChargers(): EvCharger[] {
    return Array.from(this.chargers.values());
  }

  listSessions(): EvChargingSession[] {
    return Array.from(this.sessions.values());
  }

  seedInitialChargers(chargers: EvCharger[]): void {
    for (const c of chargers) {
      this.chargers.set(c.id, c);
    }
  }

  seedInitialSessions(sessions: EvChargingSession[]): void {
    for (const s of sessions) {
      const key = s.externalSessionId || s.id;
      this.sessions.set(key, s);
    }
  }
}

export const evChargingConnectorService = new EvChargingConnectorService();
