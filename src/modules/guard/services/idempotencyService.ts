import { mockStore } from '../../../core/mockStore/mockStore';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import type { JsonObject } from '../../../core/api/api.types';

export type IdempotencyRecord = {
  idempotencyKey: string;
  societyId: string;
  entityType: 'GATE_ENTRY' | 'VISITOR_APPROVAL' | 'VISITOR_PASS' | 'EMERGENCY_BYPASS';
  entityId: string;
  action: string;
  createdAt: string;
  expiresAt: string;
  metadata?: Record<string, unknown>;
};

const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;

export const idempotencyService = {
  async checkIdempotency(
    idempotencyKey: string,
    societyId: string
  ): Promise<{ exists: boolean; record?: IdempotencyRecord }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = mockStore.getState().idempotencyRecords || [];
        const record = records.find(
          (r) => r.idempotencyKey === idempotencyKey && r.societyId === societyId
        );
        
        if (record && new Date(record.expiresAt) < new Date()) {
          resolve({ exists: false });
          return;
        }
        
        resolve({ exists: !!record, record });
      }, 100);
    });
  },

  async recordIdempotency(
    idempotencyKey: string,
    societyId: string,
    entityType: 'GATE_ENTRY' | 'VISITOR_APPROVAL' | 'VISITOR_PASS' | 'EMERGENCY_BYPASS',
    entityId: string,
    action: string,
    metadata?: Record<string, unknown>
  ): Promise<IdempotencyRecord> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const record: IdempotencyRecord = {
          idempotencyKey,
          societyId,
          entityType,
          entityId,
          action,
          createdAt: now,
          expiresAt: new Date(Date.now() + IDEMPOTENCY_TTL_MS).toISOString(),
          metadata,
        };
        
        mockStore.getState().idempotencyRecords?.push(record);
        mockStore.notify();
        
        createAuditEntry({
          actorUserId: 'SYSTEM',
          actorType: 'SYSTEM',
          societyId,
          action: 'IDEMPOTENCY_RECORDED',
          entityType: 'IDEMPOTENCY_RECORD',
          entityId: idempotencyKey,
          newState: { entityType, entityId, action },
          idempotencyKey,
          source: 'SYSTEM',
          outcome: 'SUCCESS',
        });
        
        resolve(record);
      }, 100);
    });
  },

  async validateAndRecord(
    idempotencyKey: string,
    societyId: string,
    entityType: 'GATE_ENTRY' | 'VISITOR_APPROVAL' | 'VISITOR_PASS' | 'EMERGENCY_BYPASS',
    entityId: string,
    action: string,
    metadata?: Record<string, unknown>
  ): Promise<{ allowed: boolean; existingRecord?: IdempotencyRecord; newRecord?: IdempotencyRecord }> {
    const { exists, record } = await this.checkIdempotency(idempotencyKey, societyId);
    
    if (exists && record) {
      return { allowed: false, existingRecord: record };
    }
    
    const newRecord = await this.recordIdempotency(
      idempotencyKey,
      societyId,
      entityType,
      entityId,
      action,
      metadata
    );
    
    return { allowed: true, newRecord };
  },

  async cleanupExpired(): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = mockStore.getState().idempotencyRecords || [];
        const now = new Date();
        const initialLength = records.length;
        
        mockStore.getState().idempotencyRecords = records.filter(
          (r) => new Date(r.expiresAt) > now
        );
        mockStore.notify();
        
        resolve(initialLength - mockStore.getState().idempotencyRecords.length);
      }, 200);
    });
  },

  async getRecords(societyId: string, entityType?: string): Promise<IdempotencyRecord[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = mockStore.getState().idempotencyRecords || [];
        let filtered = records.filter((r) => r.societyId === societyId);
        
        if (entityType) {
          filtered = filtered.filter((r) => r.entityType === entityType);
        }
        
        resolve(filtered);
      }, 200);
    });
  },
};

export default idempotencyService;