import {
  TwinNode,
  TwinNodeType,
  TwinNodeStatus,
  TwinHealthQuality,
  TwinRelationship,
  TwinRelationshipType,
  TwinRelationshipDirection,
  TwinState,
  TwinStateQuality,
  TwinFreshness,
  TwinStateConflictReason,
  TwinEntityTopology,
  TwinEntityTopologyDelta,
  TwinProjectionEvent,
  TwinNodeWithState,
  TwinNodeWithRelationships,
} from '../model/types';
import {
  ProjectionHandlerConfig,
  ProjectionHandlerResult,
  ProjectionError,
  ProjectionStatus,
  ProjectionCheckpoint,
  ProjectionReconciliationResult,
  DriftDetail,
  RepairAction,
  RepairActionType,
  ProjectionReplayRequest,
  ProjectionReplayResult,
} from '../projections/types';
import { TwinSnapshot, SnapshotCreationRequest, SnapshotCreationResult, SnapshotStatus, SnapshotType, SnapshotScope, SnapshotTrigger, SnapshotWarning, SnapshotAccessRequest, SnapshotAccessGrant } from '../snapshots/types';
import { TimelineEvent, TimelineQuery, TimelineResult, TimelineEventType, TimelineEventSource, TimelineEventSeverity } from '../timeline/types';
import { CapacitySnapshot, CapacityType, CapacityStatus, CapacityUnit } from '../capacity/types';

export interface DigitalTwinRepository {
  // Node operations
  getNode(societyId: string, nodeId: string): Promise<TwinNode | null>;
  getNodes(societyId: string, filters?: NodeFilters): Promise<TwinNode[]>;
  getNodeWithState(societyId: string, nodeId: string): Promise<TwinNodeWithState | null>;
  getNodeWithRelationships(societyId: string, nodeId: string): Promise<TwinNodeWithRelationships | null>;
  createNode(societyId: string, node: Omit<TwinNode, 'twinNodeId' | 'projectionVersion' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastProjectionAt' | 'lastProjectionBy'>, actor: ProjectionActorContext): Promise<TwinNode>;
  updateNode(societyId: string, nodeId: string, updates: Partial<TwinNode>, actor: ProjectionActorContext): Promise<TwinNode>;
  deleteNode(societyId: string, nodeId: string, actor: ProjectionActorContext): Promise<void>;

  // Relationship operations
  getRelationship(societyId: string, relationshipId: string): Promise<TwinRelationship | null>;
  getRelationships(societyId: string, filters?: RelationshipFilters): Promise<TwinRelationship[]>;
  createRelationship(societyId: string, relationship: Omit<TwinRelationship, 'relationshipId' | 'projectionVersion' | 'createdAt' | 'updatedAt' | 'createdBy' | 'lastValidatedAt'>, actor: ProjectionActorContext): Promise<TwinRelationship>;
  updateRelationship(societyId: string, relationshipId: string, updates: Partial<TwinRelationship>, actor: ProjectionActorContext): Promise<TwinRelationship>;
  deleteRelationship(societyId: string, relationshipId: string, actor: ProjectionActorContext): Promise<void>;

  // State operations
  getState(societyId: string, stateId: string): Promise<TwinState | null>;
  getStates(societyId: string, filters?: StateFilters): Promise<TwinState[]>;
  upsertState(societyId: string, state: Omit<TwinState, 'stateId' | 'projectionVersion' | 'createdAt' | 'updatedAt'>, actor: ProjectionActorContext): Promise<TwinState>;
  batchUpsertStates(societyId: string, states: Omit<TwinState, 'stateId' | 'projectionVersion' | 'createdAt' | 'updatedAt'>[], actor: ProjectionActorContext): Promise<TwinState[]>;

  // Topology operations
  getTopology(societyId: string, projectionVersion?: number): Promise<TwinEntityTopology>;
  getTopologyDelta(societyId: string, fromVersion: number, toVersion: number): Promise<TwinEntityTopologyDelta>;

  // Projection events
  getProjectionEvents(societyId: string, query: ProjectionEventQuery): Promise<ProjectionEventResult>;
  recordProjectionEvent(event: TwinProjectionEvent): Promise<void>;

  // Projection checkpoints
  getCheckpoint(societyId: string, handlerType: string): Promise<ProjectionCheckpoint | null>;
  saveCheckpoint(checkpoint: ProjectionCheckpoint): Promise<void>;

  // Reconciliation
  getReconciliationResults(societyId: string, handlerType: string, query: ReconciliationQuery): Promise<ProjectionReconciliationResult[]>;
  saveReconciliationResult(result: ProjectionReconciliationResult): Promise<void>;
  getRepairActions(societyId: string, query: RepairActionQuery): Promise<RepairAction[]>;
  saveRepairAction(action: RepairAction): Promise<void>;
  executeRepairAction(actionId: string, actor: ProjectionActorContext): Promise<RepairAction>;

  // Snapshots
  createSnapshot(societyId: string, request: SnapshotCreationRequest, actor: ProjectionActorContext): Promise<SnapshotCreationResult>;
  getSnapshot(societyId: string, snapshotId: string): Promise<TwinSnapshot | null>;
  getSnapshots(societyId: string, query: SnapshotQuery): Promise<TwinSnapshot[]>;
  deleteSnapshot(societyId: string, snapshotId: string, actor: ProjectionActorContext): Promise<void>;
  compareSnapshots(baselineSnapshotId: string, targetSnapshotId: string, comparisonType: string, filters?: any): Promise<any>;

  // Timeline
  getTimelineEvents(societyId: string, query: TimelineQuery): Promise<TimelineResult>;
  recordTimelineEvent(event: TimelineEvent): Promise<void>;

  // Capacity
  getCapacity(societyId: string, capacityId: string): Promise<any | null>;
  getCapacities(societyId: string, filters?: CapacityFilters): Promise<any[]>;
  getCapacitySnapshot(societyId: string, capacityId: string): Promise<any | null>;
  getCapacityHistory(societyId: string, capacityId: string, query: CapacityHistoryQuery): Promise<any>;
  getCapacityForecast(societyId: string, capacityId: string, query: CapacityForecastQuery): Promise<any | null>;

  // Timeline events
  recordTimelineEvent(event: TimelineEvent): Promise<void>;

  // Reconciliation
  triggerReconciliation(societyId: string, handlerType: string, actor: ProjectionActorContext): Promise<ProjectionReconciliationResult>;
  replayProjection(societyId: string, request: ProjectionReplayRequest, actor: ProjectionActorContext): Promise<ProjectionReplayResult>;
}

export interface NodeFilters {
  nodeTypes?: TwinNodeType[];
  statuses?: TwinNodeStatus[];
  areaIds?: string[];
  towerIds?: string[];
  effectiveFrom?: string;
  effectiveTo?: string;
  limit?: number;
  offset?: number;
}

export interface RelationshipFilters {
  relationshipTypes?: TwinRelationshipType[];
  sourceNodeId?: string;
  targetNodeId?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  limit?: number;
  offset?: number;
}

export interface StateFilters {
  stateKeys?: string[];
  quality?: TwinStateQuality[];
  freshness?: TwinFreshness[];
  nodeIds?: string[];
  limit?: number;
  offset?: number;
}

export interface ProjectionEventQuery {
  fromTimestamp?: string;
  toTimestamp?: string;
  eventTypes?: string[];
  entityTypes?: string[];
  entityIds?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'timestamp' | 'eventType' | 'entityType';
  sortOrder?: 'ASC' | 'DESC';
}

export interface ProjectionEventResult {
  events: any[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface ReconciliationQuery {
  fromTimestamp?: string;
  toTimestamp?: string;
  handlerTypes?: string[];
  statuses?: string[];
  limit?: number;
  offset?: number;
}

export interface RepairActionQuery {
  actionTypes?: string[];
  statuses?: string[];
  entityTypes?: string[];
  entityIds?: string[];
  limit?: number;
  offset?: number;
}

export interface SnapshotQuery {
  snapshotTypes?: string[];
  statuses?: string[];
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
}

export interface CapacityFilters {
  capacityTypes?: string[];
  statuses?: string[];
  areaIds?: string[];
  limit?: number;
  offset?: number;
}

export interface CapacityHistoryQuery {
  fromTimestamp: string;
  toTimestamp: string;
  granularity?: 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  limit?: number;
}

export interface CapacityForecastQuery {
  horizon: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
  granularity?: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  modelId?: string;
}

export interface ProjectionActorContext {
  actorId: string;
  actorName: string;
  actorRole: string;
  societyId: string;
  capabilities: string[];
  isSystem: boolean;
}

export interface ProjectionHandler {
  handlerType: string;
  supportedEventTypes: string[];
  processEvent(event: any, actor: ProjectionActorContext): Promise<ProjectionHandlerResult>;
  validateEvent(event: any): Promise<{ valid: boolean; errors: string[] }>;
  getConfig(): any;
  getCheckpoint(societyId: string): Promise<any>;
  saveCheckpoint(checkpoint: any): Promise<void>;
}

export interface ProjectionReconciliationEngine {
  reconcile(societyId: string, handlerType: string, actor: any): Promise<any>;
  scheduleReconciliation(societyId: string, handlerType: string, schedule: string): Promise<void>;
  triggerManualReconciliation(societyId: string, handlerType: string, actor: any): Promise<any>;
}

export interface SnapshotEngine {
  createSnapshot(request: any, actor: any): Promise<any>;
  getSnapshot(snapshotId: string): Promise<any>;
  getSnapshots(query: any): Promise<any[]>;
  compareSnapshots(baselineId: string, targetId: string, options: any): Promise<any>;
  restoreSnapshot(snapshotId: string, options: any, actor: any): Promise<any>;
  exportSnapshot(snapshotId: string, options: any): Promise<any>;
}

export interface TimelineEngine {
  recordEvent(event: any): Promise<void>;
  queryEvents(query: any): Promise<any>;
  reconstructTimeline(request: any): Promise<any>;
  subscribe(subscription: any): Promise<void>;
  unsubscribe(subscriptionId: string): Promise<void>;
}

export interface CapacityEngine {
  getCapacity(capacityId: string): Promise<any>;
  getCapacities(filters: any): Promise<any[]>;
  getSnapshot(capacityId: string): Promise<any>;
  getHistory(capacityId: string, query: any): Promise<any>;
  getForecast(capacityId: string, query: any): Promise<any>;
  registerCapacity(definition: any): Promise<any>;
  updateCapacity(capacityId: string, updates: any): Promise<any>;
  addThreshold(threshold: any): Promise<void>;
  checkThresholds(societyId: string): Promise<any[]>;
}

export interface ProjectionEngine {
  initialize(societyId: string): Promise<void>;
  processEvent(event: any): Promise<ProjectionHandlerResult>;
  processBatch(events: any[]): Promise<ProjectionHandlerResult>;
  getProjectionVersion(societyId: string): Promise<number>;
  forceReconciliation(handlerType: string): Promise<any>;
}