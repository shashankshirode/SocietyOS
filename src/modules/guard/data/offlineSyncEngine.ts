import { OfflineQueueItem, OfflineSyncStatus, ConflictType, ConflictResolution, ConflictStrategy, SyncBatchRequest, SyncBatchResponse, ConflictResolutionRequest, CONFLICT_STRATEGIES, DEFAULT_MAX_RETRIES, SYNC_BATCH_SIZE, CONFLICT_REVIEW_TTL_MS, } from './offlineSync.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { apiClient } from '../../../core/api/apiClient';
import { apiEndpoints } from '../../../core/api/apiEndpoints';
import { auditService, createAuditEntry } from '../../../core/audit';
import { mockStore } from '../../../core/mockStore/mockStore';
import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { JsonObject } from '../../../core/api/api.types';
export type { OfflineQueueItem } from './offlineSync.types';
class OfflineSyncEngine {
    private queue: OfflineQueueItem[] = [];
    private pendingConflicts: Map<string, OfflineQueueItem> = new Map();
    private isSyncing = false;
    private syncInterval: ReturnType<typeof setInterval> | null = null;
    private listeners: Array<(item: OfflineQueueItem) => void> = [];
    private deviceId: string;
    private devicePublicKey: string;
    private lastSyncedAt: string | null = null;
    private schemaVersion = 1;
    constructor() {
        this.deviceId = `device_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
        this.devicePublicKey = `pub_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
        this.loadFromStorage();
    }
    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem('offline_gate_queue');
            if (stored) {
                this.queue = JSON.parse(stored);
            }
            const lastSync = localStorage.getItem('offline_gate_last_synced');
            if (lastSync) {
                this.lastSyncedAt = lastSync;
            }
        }
        catch (error) {
            console.error('[OfflineSyncEngine] Failed to load from storage:', error);
        }
    }
    private saveToStorage(): void {
        try {
            localStorage.setItem('offline_gate_queue', JSON.stringify(this.queue));
            if (this.lastSyncedAt) {
                localStorage.setItem('offline_gate_last_synced', this.lastSyncedAt);
            }
        }
        catch (error) {
            console.error('[OfflineSyncEngine] Failed to save to storage:', error);
        }
    }
    async captureEntry(entry: Omit<OfflineQueueItem, 'id' | 'clientId' | 'createdAt' | 'createdAtLocal' | 'deviceTimezone' | 'retryCount' | 'maxRetries' | 'syncStatus' | 'idempotencyKey' | 'conflict' | 'errorMessage' | 'syncedAt' | 'serverResponse'>): Promise<string> {
        const now = new Date();
        const clientId = `entry_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
        const idempotencyKey = createIdempotencyKey('gate_entry');
        const item: OfflineQueueItem = {
            id: `off_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
            clientId,
            ...entry,
            createdAt: now.toISOString(),
            createdAtLocal: now.toLocaleString(),
            deviceTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            retryCount: 0,
            maxRetries: DEFAULT_MAX_RETRIES,
            syncStatus: 'LOCAL_CAPTURED',
            idempotencyKey,
        };
        this.queue.push(item);
        this.saveToStorage();
        this.notifyListeners(item);
        createAuditEntry({
            actorUserId: entry.guardId,
            actorType: 'GUARD',
            societyId: entry.payload.societyId as string,
            action: 'GATE_ENTRY_CAPTURE',
            entityType: 'GATE_ENTRY',
            entityId: item.id,
            newState: { syncStatus: 'LOCAL_CAPTURED', entryType: entry.entryType },
            idempotencyKey,
            source: 'GATE_DEVICE',
            outcome: 'SUCCESS',
        });
        return item.id;
    }
    getQueue(): OfflineQueueItem[] {
        return [...this.queue].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    getPendingConflicts(): OfflineQueueItem[] {
        return Array.from(this.pendingConflicts.values());
    }
    async sync(): Promise<{
        success: number;
        conflicts: number;
        failed: number;
    }> {
        if (this.isSyncing)
            return { success: 0, conflicts: 0, failed: 0 };
        const pendingItems = this.queue.filter(item => item.syncStatus === 'LOCAL_CAPTURED' || item.syncStatus === 'QUEUED' || item.syncStatus === 'FAILED').slice(0, SYNC_BATCH_SIZE);
        if (pendingItems.length === 0) {
            return { success: 0, conflicts: 0, failed: 0 };
        }
        this.isSyncing = true;
        let success = 0;
        let conflicts = 0;
        let failed = 0;
        for (const item of pendingItems) {
            item.syncStatus = 'SYNCING';
            this.saveToStorage();
            this.notifyListeners(item);
            try {
                const result = await this.syncItem(item);
                if (result.status === 'ACCEPTED') {
                    item.syncStatus = 'ACCEPTED';
                    item.syncedAt = new Date().toISOString();
                    if (result.serverResponse) {
                        item.serverResponse = result.serverResponse;
                    }
                    success += 1;
                }
                else if (result.status === 'CONFLICT') {
                    await this.handleConflict(item, result.conflict!);
                    conflicts += 1;
                }
                else {
                    await this.handleRejection(item, result);
                    failed += 1;
                }
            }
            catch (error) {
                await this.handleSyncError(item, error);
                failed += 1;
            }
            this.saveToStorage();
            this.notifyListeners(item);
        }
        this.isSyncing = false;
        return { success, conflicts, failed };
    }
    private async syncItem(item: OfflineQueueItem): Promise<{
        status: 'ACCEPTED' | 'CONFLICT' | 'REJECTED';
        serverResponse?: JsonObject;
        serverId?: string;
        conflict?: {
            type: ConflictType;
            serverState: JsonObject;
            suggestedResolution: ConflictResolution;
        };
    }> {
        try {
            const response = await apiClient.post<{
                status: 'ACCEPTED' | 'CONFLICT' | 'REJECTED';
                serverId?: string;
                serverResponse?: JsonObject;
                conflict?: {
                    type: ConflictType;
                    serverState: JsonObject;
                    suggestedResolution: ConflictResolution;
                };
            }>(apiEndpoints.gate.offlineQueueSync, {
                deviceId: this.deviceId,
                devicePublicKey: this.devicePublicKey,
                items: [item] as unknown as JsonObject[],
                lastSyncedAt: this.lastSyncedAt ?? '',
            });
            return {
                status: response.status,
                ...(response.serverResponse ? { serverResponse: response.serverResponse } : {}),
                ...(response.serverId ? { serverId: response.serverId } : {}),
                ...(response.conflict ? { conflict: response.conflict } : {}),
            };
        }
        catch (error) {
            return {
                status: 'REJECTED',
                serverResponse: { error: error instanceof Error ? error.message : 'Sync failed' },
            };
        }
    }
    private async handleConflict(item: OfflineQueueItem, conflict: {
        type: ConflictType;
        serverState: JsonObject;
        suggestedResolution: ConflictResolution;
    }): Promise<void> {
        const strategy = CONFLICT_STRATEGIES[conflict.type];
        const resolution = conflict.suggestedResolution ?? strategy.resolution;
        item.conflict = {
            type: conflict.type,
            serverState: conflict.serverState,
            localState: item.payload,
            resolution,
        };
        item.syncStatus = 'CONFLICT';
        this.pendingConflicts.set(item.clientId, item);
        createAuditEntry({
            actorUserId: item.guardId,
            actorType: 'GUARD',
            societyId: item.payload.societyId as string,
            action: 'GATE_ENTRY_CONFLICT',
            entityType: 'GATE_ENTRY',
            entityId: item.id,
            previousState: { syncStatus: 'SYNCING' },
            newState: { syncStatus: 'CONFLICT', conflictType: conflict.type, suggestedResolution: resolution },
            idempotencyKey: item.idempotencyKey,
            source: 'GATE_DEVICE',
            outcome: 'PARTIAL',
            error: { code: 'CONFLICT', message: strategy.description },
        });
    }
    private async handleRejection(item: OfflineQueueItem, result: {
        status: 'ACCEPTED' | 'CONFLICT' | 'REJECTED';
        serverResponse?: JsonObject;
        serverId?: string;
        conflict?: {
            type: ConflictType;
            serverState: JsonObject;
            suggestedResolution: ConflictResolution;
        };
    }): Promise<void> {
        item.retryCount += 1;
        item.syncStatus = item.retryCount >= item.maxRetries ? 'FAILED' : 'QUEUED';
        item.errorMessage = result.serverResponse?.error as string ?? 'Server rejected entry';
        createAuditEntry({
            actorUserId: item.guardId,
            actorType: 'GUARD',
            societyId: item.payload.societyId as string,
            action: 'GATE_ENTRY_REJECTED',
            entityType: 'GATE_ENTRY',
            entityId: item.id,
            previousState: { syncStatus: 'SYNCING' },
            newState: { syncStatus: item.syncStatus, retryCount: item.retryCount },
            idempotencyKey: item.idempotencyKey,
            source: 'GATE_DEVICE',
            outcome: 'FAILURE',
            error: { code: 'REJECTED', message: item.errorMessage },
        });
    }
    private async handleSyncError(item: OfflineQueueItem, error: unknown): Promise<void> {
        item.retryCount += 1;
        item.syncStatus = item.retryCount >= item.maxRetries ? 'FAILED' : 'QUEUED';
        item.errorMessage = error instanceof Error ? error.message : 'Sync failed';
        createAuditEntry({
            actorUserId: item.guardId,
            actorType: 'GUARD',
            societyId: item.payload.societyId as string,
            action: 'GATE_ENTRY_SYNC_ERROR',
            entityType: 'GATE_ENTRY',
            entityId: item.id,
            previousState: { syncStatus: 'SYNCING' },
            newState: { syncStatus: item.syncStatus, retryCount: item.retryCount },
            idempotencyKey: item.idempotencyKey,
            source: 'GATE_DEVICE',
            outcome: 'FAILURE',
            error: { code: 'SYNC_ERROR', message: item.errorMessage },
        });
    }
    async resolveConflict(clientId: string, resolution: ConflictResolution, mergedPayload?: JsonObject): Promise<boolean> {
        const item = this.pendingConflicts.get(clientId);
        if (!item || !item.conflict)
            return false;
        item.conflict.resolution = resolution;
        item.conflict.resolvedAt = new Date().toISOString();
        item.conflict.resolvedBy = 'GUARD_SUPERVISOR';
        if (resolution === 'MERGE' && mergedPayload) {
            item.payload = mergedPayload;
        }
        else if (resolution === 'LOCAL_WINS') {
        }
        else if (resolution === 'SERVER_WINS') {
            item.payload = item.conflict.serverState!;
        }
        item.syncStatus = 'QUEUED';
        item.retryCount = 0;
        this.pendingConflicts.delete(clientId);
        this.saveToStorage();
        this.notifyListeners(item);
        createAuditEntry({
            actorUserId: item.guardId,
            actorType: 'GUARD',
            societyId: item.payload.societyId as string,
            action: 'GATE_ENTRY_CONFLICT_RESOLVED',
            entityType: 'GATE_ENTRY',
            entityId: item.id,
            previousState: { syncStatus: 'CONFLICT', conflictType: item.conflict.type },
            newState: { syncStatus: 'QUEUED', resolution },
            idempotencyKey: item.idempotencyKey,
            source: 'GATE_DEVICE',
            outcome: 'SUCCESS',
        });
        return true;
    }
    startAutoSync(intervalMs = 30000): void {
        if (this.syncInterval)
            return;
        this.syncInterval = setInterval(() => this.sync(), intervalMs);
    }
    stopAutoSync(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
    onUpdate(listener: (item: OfflineQueueItem) => void): () => void {
        this.listeners.push(listener);
        return () => {
            const idx = this.listeners.indexOf(listener);
            if (idx >= 0)
                this.listeners.splice(idx, 1);
        };
    }
    private notifyListeners(item: OfflineQueueItem): void {
        this.listeners.forEach(l => l(item));
    }
    async mockSync(): Promise<{
        success: number;
        conflicts: number;
        failed: number;
    }> {
        await withMockDelay(500);
        const pendingItems = this.queue.filter(item => item.syncStatus === 'LOCAL_CAPTURED' || item.syncStatus === 'QUEUED' || item.syncStatus === 'FAILED').slice(0, SYNC_BATCH_SIZE);
        let success = 0;
        let conflicts = 0;
        let failed = 0;
        for (const item of pendingItems) {
            item.syncStatus = 'SYNCING';
            this.saveToStorage();
            this.notifyListeners(item);
            await withMockDelay(100);
            const shouldConflict = Math.random() < 0.15;
            const shouldFail = Math.random() < 0.05;
            if (shouldConflict) {
                const conflictTypes: ConflictType[] = ['VISITOR_REVOKED', 'DUPLICATE_ENTRY', 'CLOCK_SKEW', 'SCHEMA_MISMATCH', 'PASS_EXPIRED', 'UNIT_MISMATCH', 'GUARD_UNAUTHORIZED'];
                const conflictType = conflictTypes[Math.floor(Math.random() * conflictTypes.length)]!;
                const strategy = CONFLICT_STRATEGIES[conflictType];
                item.conflict = {
                    type: conflictType,
                    serverState: { visitorId: 'server-vis-001', status: 'REVOKED' },
                    localState: item.payload,
                    resolution: strategy.resolution,
                };
                item.syncStatus = 'CONFLICT';
                this.pendingConflicts.set(item.clientId, item);
                conflicts += 1;
            }
            else if (shouldFail) {
                item.retryCount += 1;
                item.syncStatus = item.retryCount >= item.maxRetries ? 'FAILED' : 'QUEUED';
                item.errorMessage = 'Mock sync error';
                failed += 1;
            }
            else {
                item.syncStatus = 'ACCEPTED';
                item.syncedAt = new Date().toISOString();
                item.serverResponse = { serverId: `server_${item.id}` };
                success += 1;
            }
            this.saveToStorage();
            this.notifyListeners(item);
        }
        return { success, conflicts, failed };
    }
}
export const offlineSyncEngine = new OfflineSyncEngine();

