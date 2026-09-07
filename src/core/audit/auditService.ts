import type { AuditLogEntry, AuditConfig, AuditQuery, AuditLogResult, AuditActorType, AuditAction, AuditEntityType } from './audit.types';
import { createCorrelationId } from '../api/requestContext';
import type { JsonObject } from '../api/api.types';
import type { Absent } from "../../shared/types/absence.types";
const DEFAULT_CONFIG: AuditConfig = {
    enabled: true,
    retentionDays: 2555,
    sensitiveFields: ['password', 'token', 'secret', 'key', 'ssn', 'pan', 'aadhaar', 'creditCard', 'bankAccount'],
    asyncWrite: true,
    batchSize: 50,
    flushIntervalMs: 5000,
};
class AuditService {
    private config: AuditConfig = DEFAULT_CONFIG;
    private buffer: AuditLogEntry[] = [];
    private flushTimer: ReturnType<typeof setInterval> | null = null;
    private isFlushing = false;
    private listeners: Array<(entry: AuditLogEntry) => void> = [];
    constructor(config?: Partial<AuditConfig>) {
        if (config) {
            this.config = { ...DEFAULT_CONFIG, ...config };
        }
        if (this.config.asyncWrite) {
            this.startFlushTimer();
        }
    }
    private startFlushTimer(): void {
        this.flushTimer = setInterval(() => this.flush(), this.config.flushIntervalMs);
    }
    private stopFlushTimer(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
            this.flushTimer = null;
        }
    }
    configure(config: Partial<AuditConfig>): void {
        this.config = { ...this.config, ...config };
    }
    log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): string {
        const id = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
        const timestamp = new Date().toISOString();
        const fullEntry: AuditLogEntry = {
            id,
            timestamp,
            ...entry,
            newState: entry.newState ? this.sanitize(entry.newState) : undefined,
            previousState: entry.previousState ? this.sanitize(entry.previousState) : undefined,
        };
        if (this.config.asyncWrite) {
            this.buffer.push(fullEntry);
            if (this.buffer.length >= this.config.batchSize) {
                this.flush();
            }
        }
        else {
            this.persist(fullEntry);
        }
        this.listeners.forEach(listener => listener(fullEntry));
        return id;
    }
    private sanitize(data: JsonObject): JsonObject {
        const result: JsonObject = {};
        for (const [key, value] of Object.entries(data)) {
            if (this.config.sensitiveFields.some(sf => key.toLowerCase().includes(sf.toLowerCase()))) {
                result[key] = '[REDACTED]';
            }
            else if (value && typeof value === 'object' && !Array.isArray(value)) {
                result[key] = this.sanitize(value as JsonObject);
            }
            else {
                result[key] = value as JsonObject[string];
            }
        }
        return result;
    }
    async flush(): Promise<void> {
        if (this.isFlushing || this.buffer.length === 0)
            return;
        this.isFlushing = true;
        const toFlush = [...this.buffer];
        this.buffer = [];
        try {
            await this.persistBatch(toFlush);
        }
        catch (error) {
            this.buffer.unshift(...toFlush);
            console.error('[AuditService] Failed to flush audit logs:', error);
        }
        finally {
            this.isFlushing = false;
        }
    }
    private async persist(entry: AuditLogEntry): Promise<void> {
        try {
            const response = await fetch('/api/audit/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry),
            });
            if (!response.ok) {
                throw new Error(`Audit log failed: ${response.status}`);
            }
        }
        catch (error) {
            console.error('[AuditService] Failed to persist audit log:', error);
        }
    }
    private async persistBatch(entries: AuditLogEntry[]): Promise<void> {
        try {
            const response = await fetch('/api/audit/logs/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entries }),
            });
            if (!response.ok) {
                throw new Error(`Audit batch failed: ${response.status}`);
            }
        }
        catch (error) {
            console.error('[AuditService] Failed to persist audit batch:', error);
        }
    }
    async query(query: AuditQuery): Promise<AuditLogResult> {
        const params = new URLSearchParams();
        params.set('societyId', query.societyId);
        if (query.entityType)
            params.set('entityType', query.entityType);
        if (query.entityId)
            params.set('entityId', query.entityId);
        if (query.actorUserId)
            params.set('actorUserId', query.actorUserId);
        if (query.action)
            params.set('action', query.action);
        if (query.dateFrom)
            params.set('dateFrom', query.dateFrom);
        if (query.dateTo)
            params.set('dateTo', query.dateTo);
        if (query.limit)
            params.set('limit', String(query.limit));
        if (query.offset)
            params.set('offset', String(query.offset));
        const response = await fetch(`/api/audit/logs?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Audit query failed: ${response.status}`);
        }
        return response.json();
    }
    onLog(listener: (entry: AuditLogEntry) => void): () => void {
        this.listeners.push(listener);
        return () => {
            const idx = this.listeners.indexOf(listener);
            if (idx >= 0)
                this.listeners.splice(idx, 1);
        };
    }
    destroy(): void {
        this.stopFlushTimer();
        this.flush();
        this.listeners = [];
    }
}
export const auditService = new AuditService();
export function createAuditEntry(params: {
    actorUserId: string;
    actorType: AuditActorType;
    societyId: string;
    unitId?: string | Absent;
    role?: string | Absent;
    action: AuditAction;
    entityType: AuditEntityType;
    entityId: string;
    previousState?: JsonObject | Absent;
    newState?: JsonObject | Absent;
    idempotencyKey?: string | Absent;
    source?: ('MOBILE' | 'WEB' | 'API' | 'GATE_DEVICE' | 'BIOMETRIC_DEVICE' | 'SYSTEM_JOB' | 'AI_SERVICE') | Absent;
    ipAddress?: string | Absent;
    deviceId?: string | Absent;
    modelVersion?: string | Absent;
    confidence?: number | Absent;
    reason?: string | Absent;
    outcome?: ('SUCCESS' | 'FAILURE' | 'PARTIAL') | Absent;
    error?: {
        code: string;
        message: string;
    } | Absent;
}): Omit<AuditLogEntry, 'id' | 'timestamp'> {
    return {
        correlationId: createCorrelationId('audit'),
        actor: {
            userId: params.actorUserId,
            type: params.actorType,
            societyId: params.societyId,
            unitId: params.unitId,
            role: params.role,
        },
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        previousState: params.previousState,
        newState: params.newState,
        metadata: {
            idempotencyKey: params.idempotencyKey,
            source: params.source ?? 'MOBILE',
            ipAddress: params.ipAddress,
            deviceId: params.deviceId,
            modelVersion: params.modelVersion,
            confidence: params.confidence,
            reason: params.reason,
        },
        outcome: params.outcome ?? 'SUCCESS',
        error: params.error,
    };
}

