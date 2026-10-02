export type TimelineEventType =
  | 'NODE_CREATED'
  | 'NODE_UPDATED'
  | 'NODE_REMOVED'
  | 'NODE_REPLACED'
  | 'NODE_MOVED'
  | 'NODE_STATUS_CHANGED'
  | 'RELATIONSHIP_CREATED'
  | 'RELATIONSHIP_UPDATED'
  | 'RELATIONSHIP_REMOVED'
  | 'RELATIONSHIP_SOURCE_CHANGED'
  | 'RELATIONSHIP_TARGET_CHANGED'
  | 'RELATIONSHIP_TYPE_CHANGED'
  | 'STATE_CREATED'
  | 'STATE_UPDATED'
  | 'STATE_REMOVED'
  | 'STATE_QUALITY_CHANGED'
  | 'STATE_FRESHNESS_CHANGED'
  | 'STATE_CONFLICT_INTRODUCED'
  | 'STATE_CONFLICT_RESOLVED'
  | 'RELATIONSHIP_SOURCE_CHANGED'
  | 'RELATIONSHIP_TARGET_CHANGED'
  | 'RELATIONSHIP_TYPE_CHANGED'
  | 'NODE_REPLACED_BY'
  | 'NODE_REPLACES'
  | 'NODE_MOVED_TO'
  | 'NODE_MOVED_FROM'
  | 'NODE_MERGED'
  | 'NODE_SPLIT'
  | 'STATE_CONFLICT_INTRODUCED'
  | 'STATE_CONFLICT_RESOLVED'
  | 'NODE_REPLACEMENT_INITIATED'
  | 'NODE_REPLACEMENT_COMPLETED'
  | 'NODE_REPLACEMENT_FAILED'
  | 'STATE_CONFLICT_INTRODUCED'
  | 'STATE_CONFLICT_RESOLVED'
  | 'SNAPSHOT_CREATED'
  | 'SNAPSHOT_COMPLETED'
  | 'SNAPSHOT_FAILED'
  | 'SIMULATION_STARTED'
  | 'SIMULATION_COMPLETED'
  | 'SIMULATION_FAILED'
  | 'SIMULATION_CANCELLED'
  | 'FORECAST_GENERATED'
  | 'FORECAST_EVALUATED'
  | 'FORECAST_EXPIRED'
  | 'SIMULATION_RUN'
  | 'SIMULATION_COMPLETED'
  | 'SIMULATION_FAILED'
  | 'SIMULATION_CANCELLED';

export type TimelineEventSource =
  | 'PROJECTION_ENGINE'
  | 'SIMULATION_ENGINE'
  | 'SNAPSHOT_ENGINE'
  | 'RECONCILIATION_ENGINE'
  | 'MANUAL_CORRECTION'
  | 'RECONCILIATION_ENGINE'
  | 'SOURCE_DOMAIN_SYNC'
  | 'MANUAL_CORRECTION'
  | 'SIMULATION_ENGINE'
  | 'SNAPSHOT_ENGINE';

export type TimelineEventSeverity =
  | 'INFO'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'
  | 'EMERGENCY';

export interface TimelineEvent {
  eventId: string;
  societyId: string;
  eventType: TimelineEventType;
  source: TimelineEventSource;
  severity: TimelineEventSeverity;
  entityType: 'NODE' | 'RELATIONSHIP' | 'STATE' | 'SNAPSHOT' | 'SIMULATION' | 'FORECAST';
  entityId: string;
  entityTypeDisplay: string;
  description: string;
  details: Record<string, any>;
  previousValue?: any;
  newValue?: any;
  projectionVersion: number;
  sourceEntityType?: string;
  sourceEntityId?: string;
  sourceEventId?: string;
  sourceEventSequence?: number;
  correlationId?: string;
  causationId?: string;
  correlationChain: string[];
  severityReason?: string;
  actorId?: string;
  actorRole?: string;
  actorType: 'SYSTEM' | 'USER' | 'AUTOMATION' | 'SIMULATION' | 'SNAPSHOT' | 'RECONCILIATION' | 'MANUAL';
  actorName?: string;
  timestamp: string;
  metadata: Record<string, any>;
  tags: string[];
}

export interface TimelineQuery {
  societyId: string;
  fromTimestamp?: string;
  toTimestamp?: string;
  entityTypes?: string[];
  entityIds?: string[];
  eventTypes?: TimelineEventType[];
  sources?: string[];
  severities?: TimelineEventSeverity[];
  actorIds?: string[];
  actorRoles?: string[];
  correlationId?: string;
  correlationChain?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'timestamp' | 'severity' | 'eventType';
  sortOrder?: 'ASC' | 'DESC';
}

export interface TimelineResult {
  events: TimelineEvent[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
  queryTimeMs: number;
}

export interface TimelineAggregation {
  societyId: string;
  period: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  fromTimestamp: string;
  toTimestamp: string;
  aggregations: {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySource: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    eventsByEntityType: Record<string, number>;
    topEntitiesByEventCount: Array<{ entityId: string; entityType: string; count: number }>;
    topSourcesByEventCount: Array<{ source: string; count: number }>;
    peakHour?: { hour: number; count: number };
    averageEventsPerHour: number;
  };
  anomalies: Array<{
    timestamp: string;
    eventType: string;
    count: number;
    expectedCount: number;
    deviation: number;
  }>;
}

export interface TimelineProjection {
  projectionId: string;
  societyId: string;
  entityId: string;
  entityType: 'NODE' | 'RELATIONSHIP' | 'STATE';
  timeline: TimelineEvent[];
  asOf: string;
  projectionVersion: number;
}

export interface TimelineReconstructionRequest {
  societyId: string;
  entityId: string;
  entityType: 'NODE' | 'RELATIONSHIP' | 'STATE';
  fromTimestamp: string;
  toTimestamp?: string;
  includeIntermediateStates: boolean;
  resolution?: 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY';
  projectionVersion?: number;
}

export interface TimelineReconstructionResult {
  reconstructionId: string;
  entityId: string;
  entityType: 'NODE' | 'RELATIONSHIP' | 'STATE';
  timeline: TimelineEvent[];
  reconstructedStates: Array<{
    asOf: string;
    state: any;
    projectionVersion: number;
    confidence: number;
  }>;
  gaps: Array<{
    fromTimestamp: string;
    toTimestamp: string;
    reason: 'NO_EVENTS' | 'SOURCE_UNAVAILABLE' | 'PROJECTION_GAP' | 'DATA_LOSS';
  }>;
  confidence: number;
  dataFreshness: string;
  projectionVersion: number;
  sourceCutoff: string;
}

export interface TimelineSubscription {
  subscriptionId: string;
  societyId: string;
  subscriberId: string;
  filter: TimelineQuery;
  callbackUrl?: string;
  eventTypes?: TimelineEventType[];
  minSeverity?: TimelineEventSeverity;
  active: boolean;
  createdAt: string;
  lastNotifiedAt?: string;
  notificationCount: number;
}

export interface TimelineAnomalyDetection {
  societyId: string;
  period: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  anomalies: Array<{
    anomalyId: string;
    detectedAt: string;
    anomalyType: 'SPIKE' | 'DROP' | 'PATTERN_BREAK' | 'NEW_PATTERN' | 'SEASONAL_DEVIATION' | 'CORRELATION_BREAK';
    eventType: string;
    expectedCount: number;
    actualCount: number;
    deviationPercent: number;
    affectedEntities: string[];
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidence: number;
    evidence: string[];
    suggestedAction?: string;
  }>;
  baselinePeriod: { from: string; to: string };
  analysisPeriod: { from: string; to: string };
}