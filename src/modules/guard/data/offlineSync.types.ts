import type { JsonObject } from '../../../core/api/api.types';

export type GateEntryType =
  | 'GUEST'
  | 'DELIVERY'
  | 'CAB'
  | 'VENDOR'
  | 'MATERIAL'
  | 'STAFF'
  | 'DOMESTIC_HELP';

export type GatePassStatus =
  | 'EXPECTED'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type EntrySource = 'QR' | 'OTP' | 'MANUAL' | 'OFFLINE';

export type ApprovalSource =
  | 'RESIDENT'
  | 'PRE_APPROVED'
  | 'GUARD'
  | 'SUPERVISOR'
  | 'SYSTEM';

export type OfflineSyncStatus =
  | 'LOCAL_CAPTURED'
  | 'QUEUED'
  | 'SYNCING'
  | 'ACCEPTED'
  | 'CONFLICT'
  | 'REJECTED'
  | 'ACKNOWLEDGED'
  | 'FAILED';

export type ConflictType =
  | 'VISITOR_REVOKED'
  | 'DUPLICATE_ENTRY'
  | 'CLOCK_SKEW'
  | 'SCHEMA_MISMATCH'
  | 'PASS_EXPIRED'
  | 'UNIT_MISMATCH'
  | 'GUARD_UNAUTHORIZED';

export type ConflictResolution =
  | 'SERVER_WINS'
  | 'LOCAL_WINS'
  | 'MERGE'
  | 'MANUAL_REVIEW'
  | 'REJECT_LOCAL'
  | 'REJECT_SERVER';

export type ConflictStrategy = {
  conflictType: ConflictType;
  resolution: ConflictResolution;
  description: string;
};

export interface OfflineQueueItem {
  id: string;
  clientId: string;
  entryType: GateEntryType;
  personName: string;
  flatNumber: string;
  guardId: string;
  guardName: string;
  gateId: string;
  gateName: string;
  createdAt: string;
  createdAtLocal: string;
  deviceTimezone: string;
  retryCount: number;
  maxRetries: number;
  syncStatus: OfflineSyncStatus;
  idempotencyKey: string;
  payload: JsonObject;
  conflict?: {
    type: ConflictType;
    serverState?: JsonObject;
    localState: JsonObject;
    resolution?: ConflictResolution;
    resolvedAt?: string;
    resolvedBy?: string;
  };
  errorMessage?: string;
  syncedAt?: string;
  serverResponse?: JsonObject;
}

export interface SyncBatchRequest {
  deviceId: string;
  devicePublicKey: string;
  items: OfflineQueueItem[];
  lastSyncedAt?: string;
}

export interface SyncBatchResponse {
  batchId: string;
  results: Array<{
    clientId: string;
    idempotencyKey: string;
    status: 'ACCEPTED' | 'CONFLICT' | 'REJECTED';
    serverId?: string;
    conflict?: {
      type: ConflictType;
      serverState: JsonObject;
      suggestedResolution: ConflictResolution;
    };
  }>;
  serverTime: string;
  schemaVersion: number;
}

export interface ConflictResolutionRequest {
  batchId: string;
  resolutions: Array<{
    clientId: string;
    idempotencyKey: string;
    resolution: ConflictResolution;
    mergedPayload?: JsonObject;
  }>;
}

export const CONFLICT_STRATEGIES: Record<ConflictType, ConflictStrategy> = {
  VISITOR_REVOKED: {
    conflictType: 'VISITOR_REVOKED',
    resolution: 'SERVER_WINS',
    description: 'Visitor pass was revoked before offline entry; server state is authoritative',
  },
  DUPLICATE_ENTRY: {
    conflictType: 'DUPLICATE_ENTRY',
    resolution: 'SERVER_WINS',
    description: 'Entry already exists on server; use server record',
  },
  CLOCK_SKEW: {
    conflictType: 'CLOCK_SKEW',
    resolution: 'MERGE',
    description: 'Time discrepancy detected; merge with server timestamp as authoritative',
  },
  SCHEMA_MISMATCH: {
    conflictType: 'SCHEMA_MISMATCH',
    resolution: 'MANUAL_REVIEW',
    description: 'Incompatible schema version; requires manual review',
  },
  PASS_EXPIRED: {
    conflictType: 'PASS_EXPIRED',
    resolution: 'SERVER_WINS',
    description: 'Visitor pass expired during offline period; server state is authoritative',
  },
  UNIT_MISMATCH: {
    conflictType: 'UNIT_MISMATCH',
    resolution: 'MANUAL_REVIEW',
    description: 'Unit number mismatch between local and server records',
  },
  GUARD_UNAUTHORIZED: {
    conflictType: 'GUARD_UNAUTHORIZED',
    resolution: 'REJECT_LOCAL',
    description: 'Guard not authorized for this gate; reject local entry',
  },
};

export const DEFAULT_MAX_RETRIES = 5;
export const SYNC_BATCH_SIZE = 50;
export const CONFLICT_REVIEW_TTL_MS = 24 * 60 * 60 * 1000;