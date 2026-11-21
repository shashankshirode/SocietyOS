export type TwinNodeType =
  | 'SOCIETY'
  | 'PHASE'
  | 'TOWER'
  | 'WING'
  | 'FLOOR'
  | 'UNIT'
  | 'COMMON_AREA'
  | 'GATE'
  | 'PARKING_ZONE'
  | 'PARKING_SLOT'
  | 'FACILITY'
  | 'ASSET'
  | 'DEVICE'
  | 'METER'
  | 'WATER_SOURCE'
  | 'WATER_TANK'
  | 'SOLAR_SYSTEM'
  | 'EV_CHARGER'
  | 'VENDOR'
  | 'WORKFORCE_ZONE';

export type TwinNodeStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DEGRADED'
  | 'OFFLINE'
  | 'MAINTENANCE'
  | 'DECOMMISSIONED'
  | 'UNKNOWN';

export type TwinHealthQuality =
  | 'CONFIRMED'
  | 'ESTIMATED'
  | 'STALE'
  | 'PARTIAL'
  | 'UNKNOWN'
  | 'CONFLICTED';

export type TwinRelationshipType =
  | 'CONTAINS'
  | 'SERVES'
  | 'LOCATED_IN'
  | 'MONITORS'
  | 'MEASURES'
  | 'SUPPLIES'
  | 'DEPENDS_ON'
  | 'LOCATED_AT'
  | 'TARGETS'
  | 'CONNECTS_TO'
  | 'ADJACENT_TO';

export type TwinRelationshipDirection =
  | 'UNIDIRECTIONAL'
  | 'BIDIRECTIONAL';

export interface TwinNode {
  twinNodeId: string;
  societyId: string;
  nodeType: TwinNodeType;
  sourceEntityType: string;
  sourceEntityId: string;
  displayName: string;
  displayMetadata: Record<string, any>;
  topologyType: TwinNodeType;
  status: TwinNodeStatus;
  healthQuality: TwinHealthQuality;
  effectiveFrom: string;
  effectiveTo?: string;
  projectionVersion: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastProjectionAt: string;
  lastProjectionBy: string;
}

export interface TwinRelationship {
  relationshipId: string;
  societyId: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationshipType: TwinRelationshipType;
  direction: TwinRelationshipDirection;
  displayLabel?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  projectionVersion: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastValidatedAt: string;
  validationStatus: 'VALID' | 'STALE' | 'INVALID' | 'UNKNOWN';
}

export type TwinStateQuality =
  | 'CONFIRMED'
  | 'ESTIMATED'
  | 'STALE'
  | 'PARTIAL'
  | 'UNKNOWN'
  | 'CONFLICTED';

export type TwinFreshness =
  | 'REAL_TIME'
  | 'NEAR_REAL_TIME'
  | 'RECENT'
  | 'STALE'
  | 'STALE_KNOWN'
  | 'STALE_UNKNOWN'
  | 'HISTORICAL'
  | 'ARCHIVED';

export type TwinStateConflictReason =
  | 'SOURCE_CONFLICT'
  | 'SENSOR_DISAGREEMENT'
  | 'SOURCE_UNAVAILABLE'
  | 'TIMESTAMP_MISMATCH'
  | 'CONFLICTING_UPDATES';

export interface TwinState {
  stateId: string;
  twinNodeId: string;
  societyId: string;
  stateKey: string;
  stateValue: any;
  stateQuality: TwinStateQuality;
  freshness: TwinFreshness;
  observedAt: string;
  receivedAt: string;
  asOf: string;
  sourceEntityType: string;
  sourceEntityId: string;
  sourceEventId?: string;
  sourceEventSequence?: number;
  projectionVersion: number;
  conflictReason?: TwinStateConflictReason;
  conflictDetails?: Record<string, any>;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface TwinNodeWithState extends TwinNode {
  currentState: TwinState[];
}

export interface TwinNodeWithRelationships extends TwinNode {
  outgoingRelationships: TwinRelationship[];
  incomingRelationships: TwinRelationship[];
}

export interface TwinEntityTopology {
  nodes: TwinNode[];
  relationships: TwinRelationship[];
  projectionVersion: number;
  asOf: string;
  sourceCutoff: string;
}

export type TwinEntityTopologyDelta = {
  addedNodes: TwinNode[];
  removedNodes: TwinNode[];
  updatedNodes: TwinNode[];
  addedRelationships: TwinRelationship[];
  removedRelationships: TwinRelationship[];
  updatedRelationships: TwinRelationship[];
  projectionVersion: number;
  asOf: string;
};

export type TwinProjectionEvent = {
  eventId: string;
  societyId: string;
  eventType: 'NODE_CREATED' | 'NODE_UPDATED' | 'NODE_REMOVED' | 'RELATIONSHIP_CREATED' | 'RELATIONSHIP_UPDATED' | 'RELATIONSHIP_REMOVED' | 'STATE_UPDATED' | 'BATCH';
  entityType: 'NODE' | 'RELATIONSHIP' | 'STATE';
  entityId: string;
  previousVersion: number;
  newVersion: number;
  timestamp: string;
  correlationId?: string;
  causationId?: string;
  payload: Record<string, any>;
  sourceEntityType: string;
  sourceEntityId: string;
  correlationChain: string[];
  processedAt: string;
  processedBy: string;
  isIdempotent: boolean;
};