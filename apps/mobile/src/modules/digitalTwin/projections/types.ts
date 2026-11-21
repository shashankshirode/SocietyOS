export type ProjectionHandlerType =
  | 'HARDWARE_INTEGRATION'
  | 'UTILITY_METER'
  | 'ASSET_MANAGEMENT'
  | 'FACILITY_BOOKING'
  | 'PARKING_MANAGEMENT'
  | 'GATE_ACCESS'
  | 'VISITOR_MANAGEMENT'
  | 'COMPLAINT_MANAGEMENT'
  | 'STAFF_ATTENDANCE'
  | 'EMERGENCY_INCIDENT'
  | 'UTILITY_BILLING'
  | 'SOLAR_GENERATION'
  | 'EV_CHARGING'
  | 'MANUAL_ENTRY';

export type ProjectionEventSource =
  | 'DOMAIN_EVENT'
  | 'WEBHOOK'
  | 'MQTT_MESSAGE'
  | 'FILE_IMPORT'
  | 'MANUAL_TRIGGER'
  | 'SCHEDULED_SYNC'
  | 'RECONCILIATION';

export interface ProjectionHandlerConfig {
  handlerType: ProjectionHandlerType;
  sourceDomain: string;
  supportedEventTypes: string[];
  eventSource: ProjectionEventSource;
  idempotencyKeyTemplate: string;
  orderingKey: string;
  processingTimeoutMs: number;
  retryPolicy: {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
  };
  circuitBreaker: {
    failureThreshold: number;
    recoveryTimeoutMs: number;
    halfOpenMaxRequests: number;
  };
  orderingGuarantee: 'AT_LEAST_ONCE' | 'EXACTLY_ONCE' | 'AT_MOST_ONCE';
  deduplicationWindowMs: number;
}

export interface ProjectionHandlerResult {
  success: boolean;
  processedCount: number;
  failedCount: number;
  errors: ProjectionError[];
  processedEventIds: string[];
  newProjectionVersion: number;
  processingTimeMs: number;
}

export interface ProjectionError {
  eventId: string;
  errorCode: string;
  errorMessage: string;
  isRetryable: boolean;
  retryCount: number;
  willRetry: boolean;
  deadLetter: boolean;
}

export type ProjectionStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED'
  | 'DEAD_LETTER'
  | 'REPLAYING';

export interface ProjectionCheckpoint {
  checkpointId: string;
  societyId: string;
  handlerType: ProjectionHandlerType;
  lastProcessedEventId: string;
  lastProcessedEventSequence: number;
  lastProcessedAt: string;
  projectionVersion: number;
  eventsProcessed: number;
  eventsFailed: number;
  status: ProjectionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectionReconciliationResult {
  reconciliationId: string;
  societyId: string;
  handlerType: ProjectionHandlerType;
  startedAt: string;
  completedAt?: string;
  totalCompared: number;
  matched: number;
  mismatched: number;
  missingInTwin: number;
  extraInTwin: number;
  driftDetected: boolean;
  driftDetails: DriftDetail[];
  repairActions: RepairAction[];
  status: 'PENDING' | 'COMPLETED' | 'COMPLETED_WITH_REPAIRS' | 'FAILED';
}

export interface DriftDetail {
  entityType: 'NODE' | 'RELATIONSHIP' | 'STATE';
  entityId: string;
  fieldName: string;
  twinValue: any;
  sourceValue: any;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedAt: string;
}

export type RepairActionType =
  | 'UPDATE_TWIN_FROM_SOURCE'
  | 'MARK_STALE_IN_TWIN'
  | 'CREATE_MISSING_IN_TWIN'
  | 'REMOVE_ORPHAN_FROM_TWIN'
  | 'RESOLVE_CONFLICT_SOURCE_WINS'
  | 'RESOLVE_CONFLICT_TWIN_WINS'
  | 'MANUAL_REVIEW_REQUIRED';

export interface RepairAction {
  actionId: string;
  actionType: RepairActionType;
  entityType: 'NODE' | 'RELATIONSHIP' | 'STATE';
  entityId: string;
  fieldName?: string;
  twinValue?: any;
  sourceValue?: any;
  status: 'PENDING' | 'EXECUTED' | 'FAILED' | 'SKIPPED';
  executedAt?: string;
  executedBy?: string;
  errorMessage?: string;
}

export interface ProjectionReplayRequest {
  societyId: string;
  handlerType: ProjectionHandlerType;
  fromEventId?: string;
  fromSequence?: number;
  toEventId?: string;
  toSequence?: number;
  fromTimestamp?: string;
  toTimestamp?: string;
  eventTypes?: string[];
  dryRun: boolean;
  requestedBy: string;
  requestedAt: string;
  reason: string;
}

export interface ProjectionReplayResult {
  replayId: string;
  societyId: string;
  handlerType: ProjectionHandlerType;
  requestedBy: string;
  startedAt: string;
  completedAt?: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED' | 'CANCELLED';
  totalEvents: number;
  processedEvents: number;
  successfulEvents: number;
  failedEvents: number;
  skippedEvents: number;
  errors: ProjectionError[];
  dryRun: boolean;
  baselineProjectionVersion: number;
  resultingProjectionVersion?: number;
};