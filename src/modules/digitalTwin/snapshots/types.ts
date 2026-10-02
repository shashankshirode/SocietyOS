export type SnapshotStatus =
  | 'PENDING'
  | 'CREATING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_WARNINGS'
  | 'FAILED'
  | 'CORRUPTED'
  | 'EXPIRED'
  | 'ARCHIVED';

export type SnapshotType =
  | 'FULL'
  | 'INCREMENTAL'
  | 'DIFFERENTIAL'
  | 'SELECTIVE'
  | 'SIMULATION_BASELINE'
  | 'SIMULATION_RESULT'
  | 'SCHEDULED'
  | 'ON_DEMAND'
  | 'PRE_MIGRATION'
  | 'POST_MIGRATION'
  | 'PRE_DEPLOYMENT'
  | 'POST_DEPLOYMENT'
  | 'COMPLIANCE'
  | 'AUDIT'
  | 'BACKUP';

export type SnapshotTrigger =
  | 'SCHEDULED'
  | 'MANUAL'
  | 'EVENT_DRIVEN'
  | 'SIMULATION_BASELINE'
  | 'SIMULATION_RESULT'
  | 'PRE_MIGRATION'
  | 'POST_MIGRATION'
  | 'COMPLIANCE_SCHEDULE'
  | 'AD_HOC';

export type SnapshotScope =
  | 'FULL'
  | 'SELECTIVE_NODES'
  | 'SELECTIVE_TYPES'
  | 'SELECTIVE_AREA'
  | 'INCREMENTAL_SINCE_LAST';

export interface TwinSnapshot {
  snapshotId: string;
  societyId: string;
  snapshotType: SnapshotType;
  snapshotScope: SnapshotScope;
  trigger: SnapshotTrigger;
  status: SnapshotStatus;
  projectionVersion: number;
  sourceCutoff: string;
  asOf: string;
  nodeCount: number;
  relationshipCount: number;
  stateCount: number;
  sizeBytes: number;
  checksum: string;
  checksumAlgorithm: 'SHA256' | 'SHA512' | 'BLAKE3';
  compressionAlgorithm?: 'GZIP' | 'LZ4' | 'ZSTD' | 'NONE';
  sourceVersions: SourceVersionInfo[];
  qualityMetrics: SnapshotQualityMetrics;
  initiatedBy: string;
  initiatedAt: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  errorMessage?: string;
  warnings: SnapshotWarning[];
  retentionPolicy: SnapshotRetentionPolicy;
  expiresAt?: string;
  legalHold: boolean;
  legalHoldReason?: string;
  metadata: Record<string, any>;
}

export interface SourceVersionInfo {
  sourceDomain: string;
  sourceEntityType: string;
  version: string;
  lastEventSequence: number;
  lastEventTimestamp: string;
  eventCount: number;
}

export interface SnapshotQualityMetrics {
  totalNodes: number;
  totalRelationships: number;
  totalStates: number;
  statesWithConfirmedQuality: number;
  statesWithEstimatedQuality: number;
  statesWithStaleQuality: number;
  statesWithConflictedQuality: number;
  statesWithUnknownQuality: number;
  missingSourceCoverage: number;
  orphanNodes: number;
  conflictedStates: number;
  dataQualityScore: number;
  freshnessScore: number;
  completenessScore: number;
}

export interface SnapshotWarning {
  warningCode: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  affectedEntityType?: string;
  affectedEntityId?: string;
  recommendation?: string;
}

export type SnapshotRetentionPolicy =
  | 'PERMANENT'
  | 'DAYS_30'
  | 'DAYS_90'
  | 'DAYS_180'
  | 'DAYS_365'
  | 'DAYS_730'
  | 'DAYS_2555'
  | 'DAYS_3650'
  | 'LEGAL_HOLD'
  | 'COMPLIANCE_REQUIRED'
  | 'UNTIL_SUPERSEDED'
  | 'CUSTOM';

export interface SnapshotRetentionPolicyConfig {
  policy: SnapshotRetentionPolicy;
  customDays?: number;
  legalHoldReason?: string;
  complianceRequirement?: string;
}

export interface SnapshotCreationRequest {
  societyId: string;
  snapshotType: SnapshotType;
  snapshotScope: SnapshotScope;
  trigger: SnapshotTrigger;
  scopeFilters?: SnapshotScopeFilters;
  retentionPolicy: SnapshotRetentionPolicyConfig;
  initiatedBy: string;
  legalHold?: boolean;
  legalHoldReason?: string;
  metadata?: Record<string, any>;
}

export interface SnapshotScopeFilters {
  nodeTypes?: string[];
  nodeIds?: string[];
  areaIds?: string[];
  towerIds?: string[];
  relationshipTypes?: string[];
  stateKeys?: string[];
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface SnapshotCreationResult {
  snapshotId: string;
  status: SnapshotStatus;
  estimatedCompletionAt?: string;
  warnings: SnapshotWarning[];
}

export interface SnapshotAccessRequest {
  snapshotId: string;
  requestedBy: string;
  purpose: string;
  expiresAt?: string;
}

export interface SnapshotAccessGrant {
  grantId: string;
  snapshotId: string;
  grantedTo: string;
  grantedBy: string;
  grantedAt: string;
  expiresAt: string;
  permissions: ('READ' | 'EXPORT' | 'ANALYZE' | 'COMPARE')[];
  conditions: string[];
}

export interface SnapshotComparisonRequest {
  baselineSnapshotId: string;
  targetSnapshotId: string;
  comparisonType: 'FULL' | 'NODES_ONLY' | 'RELATIONSHIPS_ONLY' | 'STATES_ONLY' | 'SUMMARY';
  filters?: SnapshotComparisonFilters;
}

export interface SnapshotComparisonFilters {
  nodeTypes?: string[];
  nodeIds?: string[];
  stateKeys?: string[];
  changedOnly: boolean;
}

export interface SnapshotComparisonResult {
  comparisonId: string;
  baselineSnapshotId: string;
  targetSnapshotId: string;
  comparisonType: string;
  startedAt: string;
  completedAt: string;
  summary: SnapshotComparisonSummary;
  nodeChanges: NodeChange[];
  relationshipChanges: RelationshipChange[];
  stateChanges: StateChange[];
  qualityComparison: QualityComparison;
}

export interface SnapshotComparisonSummary {
  totalNodesBaseline: number;
  totalNodesTarget: number;
  nodesAdded: number;
  nodesRemoved: number;
  nodesModified: number;
  totalRelationshipsBaseline: number;
  totalRelationshipsTarget: number;
  relationshipsAdded: number;
  relationshipsRemoved: number;
  relationshipsModified: number;
  totalStatesBaseline: number;
  totalStatesTarget: number;
  statesAdded: number;
  statesRemoved: number;
  statesModified: number;
  statesWithConflicts: number;
  qualityScoreDelta: number;
}

export type NodeChangeType =
  | 'ADDED'
  | 'REMOVED'
  | 'MODIFIED'
  | 'STATUS_CHANGED'
  | 'REPLACED'
  | 'MOVED';

export interface NodeChange {
  nodeId: string;
  changeType: NodeChangeType;
  baselineNode?: any;
  targetNode?: any;
  changedFields: string[];
  significance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export type RelationshipChangeType =
  | 'ADDED'
  | 'REMOVED'
  | 'MODIFIED'
  | 'SOURCE_CHANGED'
  | 'TARGET_CHANGED'
  | 'TYPE_CHANGED';

export interface RelationshipChange {
  relationshipId: string;
  changeType: RelationshipChangeType;
  baselineRelationship?: any;
  targetRelationship?: any;
  changedFields: string[];
  significance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export type StateChangeType =
  | 'VALUE_CHANGED'
  | 'QUALITY_CHANGED'
  | 'FRESHNESS_CHANGED'
  | 'CONFLICT_INTRODUCED'
  | 'CONFLICT_RESOLVED'
  | 'SOURCE_CHANGED';

export interface StateChange {
  stateId: string;
  nodeId: string;
  stateKey: string;
  changeType: StateChangeType;
  baselineValue?: any;
  targetValue?: any;
  baselineQuality?: string;
  targetQuality?: string;
  significance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface QualityComparison {
  baselineQualityScore: number;
  targetQualityScore: number;
  qualityDelta: number;
  freshnessDelta: number;
  completenessDelta: number;
  newConflicts: number;
  resolvedConflicts: number;
}

export interface SnapshotExportRequest {
  snapshotId: string;
  format: 'JSON' | 'COMPRESSED_JSON' | 'CSV' | 'PARQUET';
  includeMetadata: boolean;
  includeStates: boolean;
  includeRelationships: boolean;
  filters?: SnapshotScopeFilters;
  encryption?: {
    algorithm: 'AES-256-GCM';
    keyId: string;
  };
  requestedBy: string;
}

export interface SnapshotExportResult {
  exportId: string;
  snapshotId: string;
  format: string;
  downloadUrl: string;
  expiresAt: string;
  sizeBytes: number;
  checksum: string;
  checksumAlgorithm: string;
  createdAt: string;
}

export interface SnapshotRestoreRequest {
  snapshotId: string;
  targetProjectionVersion: number;
  restoreType: 'FULL_RESTORE' | 'SELECTIVE_NODES' | 'SELECTIVE_STATES' | 'RELATIONSHIPS_ONLY';
  filters?: SnapshotScopeFilters;
  dryRun: boolean;
  requestedBy: string;
  reason: string;
}

export interface SnapshotRestoreResult {
  restoreId: string;
  snapshotId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'COMPLETED_WITH_WARNINGS' | 'FAILED' | 'CANCELLED';
  totalItems: number;
  restoredItems: number;
  failedItems: number;
  skippedItems: number;
  warnings: SnapshotWarning[];
  dryRun: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface SnapshotRetentionJob {
  jobId: string;
  societyId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'COMPLETED_WITH_DELETIONS' | 'FAILED' | 'CANCELLED';
  startedAt: string;
  completedAt?: string;
  snapshotsEvaluated: number;
  snapshotsExpired: number;
  snapshotsDeleted: number;
  snapshotsArchived: number;
  snapshotsOnLegalHold: number;
  errors: string[];
  warnings: string[];
}

export interface SnapshotReconciliationRequest {
  snapshotId: string;
  reconciliationType: 'SOURCE_VERSIONS' | 'CHECKSUMS' | 'NODE_COUNTS' | 'STATE_COUNTS' | 'RELATIONSHIP_COUNTS' | 'FULL';
  requestedBy: string;
}

export interface SnapshotReconciliationResult {
  reconciliationId: string;
  snapshotId: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'COMPLETED_WITH_MISMATCHES' | 'FAILED';
  mismatches: SnapshotMismatch[];
  totalChecked: number;
  mismatched: number;
  completedAt: string;
}

export interface SnapshotMismatch {
  mismatchType: 'CHECKSUM' | 'VERSION' | 'NODE_COUNT' | 'RELATIONSHIP_COUNT' | 'STATE_COUNT' | 'SOURCE_VERSION' | 'CHECKSUM_ALGORITHM';
  expected: any;
  actual: any;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  entityId?: string;
}