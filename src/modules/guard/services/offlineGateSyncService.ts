import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import type {
  GateEvent,
  GateEventType,
  EntrySource,
  ApprovalSource,
  VisitorType,
  VehicleType,
  EmergencyType,
  VisitorPassStatus,
} from '../../../shared/types/visitorPhase8.types';
import type { OfflineQueueItem, OfflineSyncStatus, ConflictType, ConflictResolution } from './offlineSync.types';

export interface OfflineGateEvent {
  id: string;
  localId: string;
  idempotencyKey: string;
  eventType: GateEventType;
  gateId: string;
  visitorId?: string;
  visitorName?: string;
  visitorPhone?: string;
  visitorType?: VisitorType;
  visitorPassId?: string;
  visitorPassCode?: string;
  unitId?: string;
  unitNumber?: string;
  flatNumber?: string;
  eventTimestamp: string;
  deviceTimestamp: string;
  guardId: string;
  guardName: string;
  guardRole: string;
  entrySource: EntrySource;
  approvalSource?: ApprovalSource;
  vehicleRegistration?: string;
  vehicleType?: VehicleType;
  vehicleColor?: string;
  emergencyType?: EmergencyType;
  emergencyDescription?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  deviceId?: string;
  deviceInfo?: string;
  appVersion?: string;
  networkType?: string;
  syncStatus: OfflineSyncStatus;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  createdAt: string;
  syncedAt?: string;
  conflict?: {
    type: ConflictType;
    serverState: Record<string, unknown>;
    localState: Record<string, unknown>;
    resolution: ConflictResolution;
    resolvedAt?: string;
    resolvedBy?: string;
  };
}

const SYNC_BATCH_SIZE = 20;
const DEFAULT_MAX_RETRIES = 3;
const CONFLICT_REVIEW_TTL_MS = 24 * 60 * 60 * 1000;

const CONFLICT_STRATEGIES: Record<ConflictType, { resolution: ConflictResolution; description: string }> = {
  VISITOR_REVOKED: { resolution: 'SERVER_WINS', description: 'Visitor pass was revoked' },
  DUPLICATE_ENTRY: { resolution: 'SERVER_WINS', description: 'Duplicate entry detected' },
  CLOCK_SKEW: { resolution: 'MERGE', description: 'Clock synchronization issue' },
  SCHEMA_MISMATCH: { resolution: 'SERVER_WINS', description: 'Data schema mismatch' },
  PASS_EXPIRED: { resolution: 'SERVER_WINS', description: 'Visitor pass expired' },
  UNIT_MISMATCH: { resolution: 'SERVER_WINS', description: 'Unit number mismatch' },
  GUARD_UNAUTHORIZED: { resolution: 'SERVER_WINS', description: 'Guard not authorized for this gate' },
  WATCHLIST_MATCH: { resolution: 'SERVER_WINS', description: 'Visitor matched watchlist' },
  EMERGENCY_OVERRIDE: { resolution: 'LOCAL_WINS', description: 'Emergency bypass takes precedence' },
};

class OfflineGateSyncService {
  private queue: OfflineGateEvent[] = [];
  private pendingConflicts: Map<string, OfflineGateEvent> = new Map();
  private isSyncing = false;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Array<(item: OfflineGateEvent) => void> = [];
  private deviceId: string;
  private lastSyncedAt: string | null = null;

  constructor() {
    this.deviceId = `device_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
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
    } catch (error) {
      console.error('[OfflineGateSyncService] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('offline_gate_queue', JSON.stringify(this.queue));
      if (this.lastSyncedAt) {
        localStorage.setItem('offline_gate_last_synced', this.lastSyncedAt);
      }
    } catch (error) {
      console.error('[OfflineGateSyncService] Failed to save to storage:', error);
    }
  }

  async captureEvent(
    event: Omit<
      OfflineGateEvent,
      | 'id'
      | 'localId'
      | 'idempotencyKey'
      | 'createdAt'
      | 'deviceTimestamp'
      | 'retryCount'
      | 'maxRetries'
      | 'syncStatus'
      | 'conflict'
      | 'errorMessage'
      | 'syncedAt'
    >
  ): Promise<string> {
    const now = new Date();
    const localId = `off_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
    const idempotencyKey = createIdempotencyKey(`gate_${event.eventType.toLowerCase()}`);

    const existingDuplicate = this.queue.find(
      (item) =>
        item.idempotencyKey === idempotencyKey &&
        item.syncStatus !== 'FAILED'
    );

    if (existingDuplicate) {
      createAuditEntry({
        actorUserId: event.guardId,
        actorType: 'GUARD',
        societyId: event.visitorPassId ? 'unknown' : 'unknown',
        action: 'GATE_EVENT_DUPLICATE_PREVENTED',
        entityType: 'GATE_EVENT',
        entityId: existingDuplicate.id,
        newState: { syncStatus: existingDuplicate.syncStatus, duplicateOf: localId },
        idempotencyKey,
        source: 'GATE_DEVICE',
        outcome: 'SUCCESS',
      });
      return existingDuplicate.id;
    }

    const item: OfflineGateEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      localId,
      ...event,
      deviceTimestamp: now.toISOString(),
      retryCount: 0,
      maxRetries: DEFAULT_MAX_RETRIES,
      syncStatus: 'LOCAL_CAPTURED',
      idempotencyKey,
    };

    this.queue.push(item);
    this.saveToStorage();
    this.notifyListeners(item);

    createAuditEntry({
      actorUserId: event.guardId,
      actorType: 'GUARD',
      societyId: event.visitorPassId ? 'unknown' : 'unknown',
      action: 'GATE_EVENT_CAPTURE',
      entityType: 'GATE_EVENT',
      entityId: item.id,
      newState: { syncStatus: 'LOCAL_CAPTURED', eventType: event.eventType },
      idempotencyKey,
      source: 'GATE_DEVICE',
      outcome: 'SUCCESS',
    });

    return item.id;
  }

  getQueue(): OfflineGateEvent[] {
    return [...this.queue].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getPendingConflicts(): OfflineGateEvent[] {
    return Array.from(this.pendingConflicts.values());
  }

  getUnsyncedCount(): number {
    return this.queue.filter((item) =>
      ['LOCAL_CAPTURED', 'QUEUED', 'FAILED', 'SYNCING'].includes(item.syncStatus)
    ).length;
  }

  async sync(
    apiSyncFn: (items: OfflineGateEvent[]) => Promise<
      Array<{
        localId: string;
        status: 'ACCEPTED' | 'CONFLICT' | 'REJECTED';
        serverId?: string;
        serverResponse?: Record<string, unknown>;
        conflict?: {
          type: ConflictType;
          serverState: Record<string, unknown>;
          suggestedResolution: ConflictResolution;
        };
      }>
    >
  ): Promise<{ success: number; conflicts: number; failed: number }> {
    if (this.isSyncing) return { success: 0, conflicts: 0, failed: 0 };

    const pendingItems = this.queue
      .filter((item) => ['LOCAL_CAPTURED', 'QUEUED', 'FAILED'].includes(item.syncStatus))
      .slice(0, SYNC_BATCH_SIZE);

    if (pendingItems.length === 0) return { success: 0, conflicts: 0, failed: 0 };

    this.isSyncing = true;
    let success = 0;
    let conflicts = 0;
    let failed = 0;

    for (const item of pendingItems) {
      item.syncStatus = 'SYNCING';
      this.saveToStorage();
      this.notifyListeners(item);

      try {
        const results = await apiSyncFn([item]);
        const result = results[0];

        if (result.status === 'ACCEPTED') {
          item.syncStatus = 'ACCEPTED';
          item.syncedAt = new Date().toISOString();
          if (result.serverId) item.id = result.serverId;
          if (result.serverResponse) item.conflict = undefined;
          success += 1;
        } else if (result.status === 'CONFLICT') {
          await this.handleConflict(item, result.conflict!);
          conflicts += 1;
        } else {
          await this.handleRejection(item, result);
          failed += 1;
        }
      } catch (error) {
        await this.handleSyncError(item, error);
        failed += 1;
      }

      this.saveToStorage();
      this.notifyListeners(item);
    }

    this.isSyncing = false;
    this.lastSyncedAt = new Date().toISOString();
    this.saveToStorage();
    return { success, conflicts, failed };
  }

  private async handleConflict(
    item: OfflineGateEvent,
    conflict: {
      type: ConflictType;
      serverState: Record<string, unknown>;
      suggestedResolution: ConflictResolution;
    }
  ): Promise<void> {
    const strategy = CONFLICT_STRATEGIES[conflict.type] ?? { resolution: 'SERVER_WINS', description: 'Unknown conflict' };
    const resolution = conflict.suggestedResolution ?? strategy.resolution;

    item.conflict = {
      type: conflict.type,
      serverState: conflict.serverState,
      localState: { ...item },
      resolution,
    };
    item.syncStatus = 'CONFLICT';
    this.pendingConflicts.set(item.localId, item);

    createAuditEntry({
      actorUserId: item.guardId,
      actorType: 'GUARD',
      societyId: item.visitorPassId ? 'unknown' : 'unknown',
      action: 'GATE_EVENT_CONFLICT',
      entityType: 'GATE_EVENT',
      entityId: item.id,
      previousState: { syncStatus: 'SYNCING' },
      newState: { syncStatus: 'CONFLICT', conflictType: conflict.type, suggestedResolution: resolution },
      idempotencyKey: item.idempotencyKey,
      source: 'GATE_DEVICE',
      outcome: 'PARTIAL',
      error: { code: 'CONFLICT', message: strategy.description },
    });
  }

  private async handleRejection(
    item: OfflineGateEvent,
    result: {
      status: 'ACCEPTED' | 'CONFLICT' | 'REJECTED';
      serverResponse?: Record<string, unknown>;
      serverId?: string;
      conflict?: {
        type: ConflictType;
        serverState: Record<string, unknown>;
        suggestedResolution: ConflictResolution;
      };
    }
  ): Promise<void> {
    item.retryCount += 1;
    item.syncStatus = item.retryCount >= item.maxRetries ? 'FAILED' : 'QUEUED';
    item.errorMessage = (result.serverResponse?.error as string) ?? 'Server rejected entry';

    createAuditEntry({
      actorUserId: item.guardId,
      actorType: 'GUARD',
      societyId: item.visitorPassId ? 'unknown' : 'unknown',
      action: 'GATE_EVENT_REJECTED',
      entityType: 'GATE_EVENT',
      entityId: item.id,
      previousState: { syncStatus: 'SYNCING' },
      newState: { syncStatus: item.syncStatus, retryCount: item.retryCount },
      idempotencyKey: item.idempotencyKey,
      source: 'GATE_DEVICE',
      outcome: 'FAILURE',
      error: { code: 'REJECTED', message: item.errorMessage },
    });
  }

  private async handleSyncError(item: OfflineGateEvent, error: unknown): Promise<void> {
    item.retryCount += 1;
    item.syncStatus = item.retryCount >= item.maxRetries ? 'FAILED' : 'QUEUED';
    item.errorMessage = error instanceof Error ? error.message : 'Sync failed';

    createAuditEntry({
      actorUserId: item.guardId,
      actorType: 'GUARD',
      societyId: item.visitorPassId ? 'unknown' : 'unknown',
      action: 'GATE_EVENT_SYNC_ERROR',
      entityType: 'GATE_EVENT',
      entityId: item.id,
      previousState: { syncStatus: 'SYNCING' },
      newState: { syncStatus: item.syncStatus, retryCount: item.retryCount },
      idempotencyKey: item.idempotencyKey,
      source: 'GATE_DEVICE',
      outcome: 'FAILURE',
      error: { code: 'SYNC_ERROR', message: item.errorMessage },
    });
  }

  async resolveConflict(
    localId: string,
    resolution: ConflictResolution,
    mergedPayload?: Record<string, unknown>
  ): Promise<boolean> {
    const item = this.pendingConflicts.get(localId);
    if (!item || !item.conflict) return false;

    item.conflict.resolution = resolution;
    item.conflict.resolvedAt = new Date().toISOString();
    item.conflict.resolvedBy = 'GUARD_SUPERVISOR';

    if (resolution === 'MERGE' && mergedPayload) {
      Object.assign(item, mergedPayload);
    } else if (resolution === 'LOCAL_WINS') {
      // Keep local state
    } else if (resolution === 'SERVER_WINS') {
      Object.assign(item, item.conflict.serverState);
    }

    item.syncStatus = 'QUEUED';
    item.retryCount = 0;
    this.pendingConflicts.delete(localId);
    this.saveToStorage();
    this.notifyListeners(item);

    createAuditEntry({
      actorUserId: item.guardId,
      actorType: 'GUARD',
      societyId: item.visitorPassId ? 'unknown' : 'unknown',
      action: 'GATE_EVENT_CONFLICT_RESOLVED',
      entityType: 'GATE_EVENT',
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
    if (this.syncInterval) return;
    this.syncInterval = setInterval(() => this.sync(async () => []), intervalMs);
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  onUpdate(listener: (item: OfflineGateEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  private notifyListeners(item: OfflineGateEvent): void {
    this.listeners.forEach((l) => l(item));
  }

  async retryFailed(): Promise<number> {
    const failedItems = this.queue.filter((item) => item.syncStatus === 'FAILED');
    for (const item of failedItems) {
      item.syncStatus = 'QUEUED';
      item.retryCount = 0;
      item.errorMessage = undefined;
    }
    this.saveToStorage();
    return failedItems.length;
  }

  clearSynced(): number {
    const before = this.queue.length;
    this.queue = this.queue.filter((item) => item.syncStatus !== 'ACCEPTED');
    this.saveToStorage();
    return before - this.queue.length;
  }
}

export const offlineGateSyncService = new OfflineGateSyncService();
export default offlineGateSyncService;