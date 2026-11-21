import type { DeadLetterRecord, CircuitState } from '../../../shared/types/hardware.types';
import { CircuitBreaker } from './circuitBreaker';
import { assertHumanPrivilege, type HardwareActorContext } from './hardwareActor';

export interface ConnectorDefinition {
  connectorId: string;
  name: string;
  connectorType: string;
  protocol: 'REST' | 'MQTT' | 'LOCAL_SOCKET' | 'WEBHOOK';
  timeoutMs: number;
  maxRetries: number;
  rateLimitPerMinute: number;
  isOnline: boolean;
}

export class ConnectorFrameworkService {
  private readonly connectors = new Map<string, ConnectorDefinition>();
  private readonly breakers = new Map<string, CircuitBreaker>();
  private readonly deadLetterRecords = new Map<string, DeadLetterRecord>();
  private readonly requestCounts = new Map<string, { count: number; windowStart: number }>();
  private readonly processedDedupeKeys = new Set<string>();

  registerConnector(connector: ConnectorDefinition): void {
    this.connectors.set(connector.connectorId, connector);
    if (!this.breakers.has(connector.connectorId)) {
      this.breakers.set(connector.connectorId, new CircuitBreaker());
    }
  }

  getConnector(connectorId: string): ConnectorDefinition | undefined {
    return this.connectors.get(connectorId);
  }

  getCircuitState(connectorId: string): CircuitState {
    const breaker = this.breakers.get(connectorId);
    return breaker ? breaker.getState() : 'CLOSED';
  }

  recordConnectorSuccess(connectorId: string): void {
    this.breakers.get(connectorId)?.recordSuccess();
    const conn = this.connectors.get(connectorId);
    if (conn) {
      conn.isOnline = true;
    }
  }

  recordConnectorFailure(connectorId: string): void {
    this.breakers.get(connectorId)?.recordFailure();
    const conn = this.connectors.get(connectorId);
    if (conn && this.breakers.get(connectorId)?.isOpen()) {
      conn.isOnline = false;
    }
  }

  checkRateLimit(connectorId: string): boolean {
    const conn = this.connectors.get(connectorId);
    const limit = conn ? conn.rateLimitPerMinute : 120;
    const now = Date.now();
    const current = this.requestCounts.get(connectorId) || { count: 0, windowStart: now };

    if (now - current.windowStart > 60000) {
      this.requestCounts.set(connectorId, { count: 1, windowStart: now });
      return true;
    }

    if (current.count >= limit) {
      return false;
    }

    current.count += 1;
    this.requestCounts.set(connectorId, current);
    return true;
  }

  computeDeterministicDedupeKey(connectorType: string, deviceId: string, eventIdOrHash: string, timestamp: string): string {
    return `${connectorType}_${deviceId}_${eventIdOrHash}_${timestamp}`;
  }

  isDuplicateEvent(dedupeKey: string): boolean {
    if (this.processedDedupeKeys.has(dedupeKey)) {
      return true;
    }
    this.processedDedupeKeys.add(dedupeKey);
    return false;
  }

  recordDeadLetter(deviceId: string, eventType: string, payload: Record<string, string>, errorReason: string): DeadLetterRecord {
    const id = `dl-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const record: DeadLetterRecord = {
      id,
      deviceId,
      eventType,
      payload,
      errorReason,
      failedAt: new Date().toISOString(),
      retryCount: 0,
      replayStatus: 'PENDING',
    };
    this.deadLetterRecords.set(id, record);
    return record;
  }

  getDeadLetterRecords(): DeadLetterRecord[] {
    return Array.from(this.deadLetterRecords.values());
  }

  replayDeadLetter(actor: HardwareActorContext, deadLetterId: string): DeadLetterRecord {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN', 'FACILITY_MANAGER']);
    const record = this.deadLetterRecords.get(deadLetterId);
    if (!record) {
      throw new Error(`DEAD_LETTER_NOT_FOUND: Dead letter record ${deadLetterId} does not exist.`);
    }
    record.replayStatus = 'REPLAYED';
    record.replayedAt = new Date().toISOString();
    record.replayedBy = actor.userName;
    record.retryCount += 1;
    return record;
  }

  discardDeadLetter(actor: HardwareActorContext, deadLetterId: string, _reason: string): DeadLetterRecord {
    assertHumanPrivilege(actor, ['SUPER_ADMIN', 'INTEGRATION_ADMIN', 'FACILITY_MANAGER']);
    const record = this.deadLetterRecords.get(deadLetterId);
    if (!record) {
      throw new Error(`DEAD_LETTER_NOT_FOUND: Dead letter record ${deadLetterId} does not exist.`);
    }
    record.replayStatus = 'DISCARDED';
    record.replayedAt = new Date().toISOString();
    record.replayedBy = actor.userName;
    return record;
  }
}

export const connectorFrameworkService = new ConnectorFrameworkService();
