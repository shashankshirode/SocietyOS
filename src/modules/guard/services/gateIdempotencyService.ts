import { mockStore } from '../../../core/mockStore/mockStore';
import { createIdempotencyKey } from '../../../core/api/idempotency';

export interface IdempotencyRecord {
  readonly key: string;
  readonly societyId: string;
  readonly operationType: string;
  readonly entityId?: string;
  readonly status: 'PENDING' | 'COMPLETED' | 'FAILED';
  readonly requestPayload: Record<string, unknown>;
  readonly responsePayload?: Record<string, unknown>;
  readonly createdAt: string;
  readonly completedAt?: string;
  readonly expiresAt: string;
}

export interface IdempotencyCheckResult {
  readonly exists: boolean;
  readonly record?: IdempotencyRecord;
}

export class GateIdempotencyService {
  private static instance: GateIdempotencyService;

  static getInstance(): GateIdempotencyService {
    if (!GateIdempotencyService.instance) {
      GateIdempotencyService.instance = new GateIdempotencyService();
    }
    return GateIdempotencyService.instance;
  }

  private constructor() {}

  async checkIdempotency(key: string, societyId: string): Promise<IdempotencyCheckResult> {
    const records = mockStore.getState().idempotencyRecords || [];
    const record = records.find(r => r.key === key && r.societyId === societyId);

    if (record) {
      if (record.status === 'COMPLETED') {
        return { exists: true, record };
      }
      if (record.status === 'PENDING') {
        return { exists: true, record };
      }
      if (record.status === 'FAILED') {
        return { exists: false, record };
      }
    }

    return { exists: false };
  }

  async createIdempotencyRecord(
    key: string,
    societyId: string,
    operationType: string,
    requestPayload: Record<string, unknown>,
    ttlMinutes: number = 60
  ): Promise<void> {
    const record: IdempotencyRecord = {
      key,
      societyId,
      operationType,
      status: 'PENDING',
      requestPayload,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString(),
    };

    mockStore.getState().idempotencyRecords = [...(mockStore.getState().idempotencyRecords || []), record];
    mockStore.notify();
  }

  async completeIdempotency(
    key: string,
    societyId: string,
    entityId: string,
    responsePayload: Record<string, unknown>
  ): Promise<void> {
    const records = mockStore.getState().idempotencyRecords || [];
    const index = records.findIndex(r => r.key === key && r.societyId === societyId);

    if (index !== -1) {
      records[index] = {
        ...records[index],
        status: 'COMPLETED',
        entityId,
        responsePayload,
        completedAt: new Date().toISOString(),
      };
      mockStore.getState().idempotencyRecords = records;
      mockStore.notify();
    } else {
      const newRecord: IdempotencyRecord = {
        key,
        societyId,
        operationType: 'OPERATION',
        status: 'COMPLETED',
        requestPayload: {},
        entityId,
        responsePayload,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };
      mockStore.getState().idempotencyRecords = [...records, newRecord];
      mockStore.notify();
    }
  }

  async failIdempotency(
    key: string,
    societyId: string,
    error: string
  ): Promise<void> {
    const records = mockStore.getState().idempotencyRecords || [];
    const index = records.findIndex(r => r.key === key && r.societyId === societyId);

    if (index !== -1) {
      records[index] = {
        ...records[index],
        status: 'FAILED',
        completedAt: new Date().toISOString(),
      };
      mockStore.getState().idempotencyRecords = records;
      mockStore.notify();
    }
  }

  async cleanupExpired(): Promise<number> {
    const records = mockStore.getState().idempotencyRecords || [];
    const now = new Date().toISOString();
    const initialLength = records.length;

    mockStore.getState().idempotencyRecords = records.filter(r => r.expiresAt > now);
    mockStore.notify();

    return initialLength - mockStore.getState().idempotencyRecords.length;
  }
}

export const gateIdempotencyService = GateIdempotencyService.getInstance();