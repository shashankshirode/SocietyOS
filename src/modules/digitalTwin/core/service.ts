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
import { TwinSnapshot, SnapshotCreationRequest, SnapshotCreationResult, SnapshotStatus, SnapshotType, SnapshotScope, SnapshotTrigger, SnapshotWarning } from '../snapshots/types';
import { TimelineEvent, TimelineQuery, TimelineResult, TimelineEventType, TimelineEventSource, TimelineEventSeverity } from '../timeline/types';
import { CapacitySnapshot, CapacityType, CapacityStatus, CapacityUnit } from '../capacity/types';
import { DigitalTwinRepository } from './repository.types';
import { ProjectionActorContext } from './repository.types';

export class DigitalTwinService {
  constructor(private repository: DigitalTwinRepository) {}

  async getNode(societyId: string, nodeId: string, actor: ProjectionActorContext): Promise<any | null> {
    return this.repository.getNode(societyId, nodeId);
  }

  async getNodes(societyId: string, filters: any, actor?: ProjectionActorContext): Promise<any[]> {
    return this.repository.getNodes(societyId, filters);
  }

  async getNodeWithState(societyId: string, nodeId: string, actor?: ProjectionActorContext): Promise<any | null> {
    return this.repository.getNodeWithState(societyId, nodeId);
  }

  async getNodeWithRelationships(societyId: string, nodeId: string, actor?: ProjectionActorContext): Promise<any | null> {
    return this.repository.getNodeWithRelationships(societyId, nodeId);
  }

  async createNode(societyId: string, node: any, actor: ProjectionActorContext): Promise<any> {
    return this.repository.createNode(societyId, node, actor);
  }

  async updateNode(societyId: string, nodeId: string, updates: any, actor: ProjectionActorContext): Promise<any> {
    return this.repository.updateNode(societyId, nodeId, updates, actor);
  }

  async deleteNode(societyId: string, nodeId: string, actor: ProjectionActorContext): Promise<void> {
    return this.repository.deleteNode(societyId, nodeId, actor);
  }

  async getRelationship(societyId: string, relationshipId: string, actor?: ProjectionActorContext): Promise<any | null> {
    return this.repository.getRelationship(societyId, relationshipId);
  }

  async getRelationships(societyId: string, filters: any, actor?: ProjectionActorContext): Promise<any[]> {
    return this.repository.getRelationships(societyId, filters);
  }

  async createRelationship(societyId: string, relationship: any, actor: ProjectionActorContext): Promise<any> {
    return this.repository.createRelationship(societyId, relationship, actor);
  }

  async updateRelationship(societyId: string, relationshipId: string, updates: any, actor: ProjectionActorContext): Promise<any> {
    return this.repository.updateRelationship(societyId, relationshipId, updates, actor);
  }

  async deleteRelationship(societyId: string, relationshipId: string, actor: ProjectionActorContext): Promise<void> {
    return this.repository.deleteRelationship(societyId, relationshipId, actor);
  }

  async getState(societyId: string, stateId: string, actor?: ProjectionActorContext): Promise<any | null> {
    return this.repository.getState(societyId, stateId);
  }

  async getStates(societyId: string, filters: any, actor?: ProjectionActorContext): Promise<any[]> {
    return this.repository.getStates(societyId, filters);
  }

  async upsertState(societyId: string, state: any, actor: ProjectionActorContext): Promise<any> {
    return this.repository.upsertState(societyId, state, actor);
  }

  async batchUpsertStates(societyId: string, states: any[], actor: ProjectionActorContext): Promise<any[]> {
    return this.repository.batchUpsertStates(societyId, states, actor);
  }

  async getTopology(societyId: string, projectionVersion?: number, actor?: ProjectionActorContext): Promise<any> {
    return this.repository.getTopology(societyId, projectionVersion);
  }

  async getTopologyDelta(societyId: string, fromVersion: number, toVersion: number, actor?: ProjectionActorContext): Promise<any> {
    return this.repository.getTopologyDelta(societyId, fromVersion, toVersion);
  }

  async getProjectionEvents(societyId: string, query: any, actor?: ProjectionActorContext): Promise<any> {
    return this.repository.getProjectionEvents(societyId, query);
  }

  async recordProjectionEvent(event: any): Promise<void> {
    return this.repository.recordProjectionEvent(event);
  }

  async getCheckpoint(societyId: string, handlerType: string, actor?: ProjectionActorContext): Promise<any> {
    return this.repository.getCheckpoint(societyId, handlerType);
  }

  async saveCheckpoint(checkpoint: any): Promise<void> {
    return this.repository.saveCheckpoint(checkpoint);
  }

  async getReconciliationResults(societyId: string, handlerType: string, query: any, actor?: ProjectionActorContext): Promise<any[]> {
    return this.repository.getReconciliationResults(societyId, handlerType, query);
  }

  async saveReconciliationResult(result: any): Promise<void> {
    return this.repository.saveReconciliationResult(result);
  }

  async getRepairActions(societyId: string, query: any, actor?: ProjectionActorContext): Promise<any[]> {
    return this.repository.getRepairActions(societyId, query);
  }

  async saveRepairAction(action: any): Promise<void> {
    return this.repository.saveRepairAction(action);
  }

  async executeRepairAction(actionId: string, actor: any): Promise<any> {
    return this.repository.executeRepairAction(actionId, actor);
  }

  async createSnapshot(societyId: string, request: any, actor: any): Promise<any> {
    return this.repository.createSnapshot(societyId, request, actor);
  }

  async getSnapshot(societyId: string, snapshotId: string, actor?: ProjectionActorContext): Promise<any | null> {
    return this.repository.getSnapshot(societyId, snapshotId);
  }

  async getSnapshots(societyId: string, query: any, actor?: ProjectionActorContext): Promise<any[]> {
    return this.repository.getSnapshots(societyId, query);
  }

  async deleteSnapshot(societyId: string, snapshotId: string, actor: any): Promise<void> {
    return this.repository.deleteSnapshot(societyId, snapshotId, actor);
  }

  async compareSnapshots(baselineSnapshotId: string, targetSnapshotId: string, comparisonType: string, filters: any): Promise<any> {
    return this.repository.compareSnapshots(baselineSnapshotId, targetSnapshotId, comparisonType, filters);
  }

  async getTimelineEvents(societyId: string, query: any, actor?: ProjectionActorContext): Promise<any> {
    return this.repository.getTimelineEvents(societyId, query);
  }

  async recordTimelineEvent(event: any): Promise<void> {
    return this.repository.recordTimelineEvent(event);
  }

  async getCapacity(societyId: string, capacityId: string, actor?: ProjectionActorContext): Promise<any | null> {
    return this.repository.getCapacity(societyId, capacityId);
  }

  async getCapacities(societyId: string, filters: any, actor?: ProjectionActorContext): Promise<any[]> {
    return this.repository.getCapacities(societyId, filters);
  }

  async getCapacitySnapshot(societyId: string, capacityId: string, actor?: ProjectionActorContext): Promise<any | null> {
    return this.repository.getCapacitySnapshot(societyId, capacityId);
  }

  async getCapacityHistory(societyId: string, capacityId: string, query: any, actor?: ProjectionActorContext): Promise<any> {
    return this.repository.getCapacityHistory(societyId, capacityId, query);
  }

  async getCapacityForecast(societyId: string, capacityId: string, query: any, actor?: ProjectionActorContext): Promise<any | null> {
    return this.repository.getCapacityForecast(societyId, capacityId, query);
  }

  
  async triggerReconciliation(societyId: string, handlerType: string, actor: any): Promise<any> {
    return this.repository.triggerReconciliation(societyId, handlerType, actor);
  }

  async replayProjection(societyId: string, request: any, actor: any): Promise<any> {
    return this.repository.replayProjection(societyId, request, actor);
  }

  async getTopologyWithStates(societyId: string, projectionVersion?: number): Promise<any> {
    const topology = await this.repository.getTopology(societyId, projectionVersion);
    const nodesWithState = await Promise.all(
      topology.nodes.map(async (node) => {
        const state = await this.getStates(societyId, { nodeIds: [node.twinNodeId] });
        return { ...node, currentState: state };
      })
    );
    return {
      ...topology,
      nodes: nodesWithState,
    };
  }

  async getNodeStateHistory(societyId: string, nodeId: string, stateKey: string, fromTimestamp: string, toTimestamp?: string): Promise<any[]> {
    const states = await this.getStates(societyId, { nodeIds: [nodeId], stateKeys: [stateKey] });
    return states
      .filter(s => s.asOf >= fromTimestamp && (!toTimestamp || s.asOf <= toTimestamp))
      .sort((a, b) => new Date(a.asOf).getTime() - new Date(b.asOf).getTime());
  }

  async getNodeCurrentState(societyId: string, nodeId: string): Promise<any[]> {
    return this.getStates(societyId, { nodeIds: [nodeId] });
  }

  async getRelationshipsForNode(societyId: string, nodeId: string): Promise<{ incoming: any[]; outgoing: any[] }> {
    const incoming = await this.getRelationships(societyId, { targetNodeId: nodeId });
    const outgoing = await this.getRelationships(societyId, { sourceNodeId: nodeId });
    return { incoming, outgoing };
  }

  async getDownstreamNodes(societyId: string, nodeId: string, maxDepth: number = 5, actor: any = { actorId: 'system', actorName: 'System', actorRole: 'SYSTEM', societyId, capabilities: [], isSystem: true }): Promise<any[]> {
    const visited = new Set<string>();
    const result: any[] = [];
    const self = this;

    async function traverse(currentNodeId: string, depth: number): Promise<void> {
      if (depth > maxDepth || visited.has(currentNodeId)) return;
      visited.add(currentNodeId);

      const relationships = await self.getRelationships(societyId, { sourceNodeId: currentNodeId });
      for (const rel of relationships) {
        const targetNode = await self.getNode(societyId, rel.targetNodeId, actor);
        if (targetNode) {
          result.push({ ...targetNode, relationship: rel, depth });
          await traverse(rel.targetNodeId, depth + 1);
        }
      }
    }

    await traverse(nodeId, 0);
    return result;
  }

  async getUpstreamNodes(societyId: string, nodeId: string, maxDepth: number = 5, actor: any = { actorId: 'system', actorName: 'System', actorRole: 'SYSTEM', societyId, capabilities: [], isSystem: true }): Promise<any[]> {
    const visited = new Set<string>();
    const result: any[] = [];
    const self = this;

    async function traverse(currentNodeId: string, depth: number): Promise<void> {
      if (depth > maxDepth || visited.has(currentNodeId)) return;
      visited.add(currentNodeId);

      const relationships = await self.getRelationships(societyId, { targetNodeId: currentNodeId });
      for (const rel of relationships) {
        const sourceNode = await self.getNode(societyId, rel.sourceNodeId, actor);
        if (sourceNode) {
          result.push({ ...sourceNode, relationship: rel, depth });
          await traverse(rel.sourceNodeId, depth + 1);
        }
      }
    }

    await traverse(nodeId, 0);
    return result;
  }

  async getNodesByType(societyId: string, nodeType: string, filters: any = {}): Promise<any[]> {
    return this.getNodes(societyId, { nodeTypes: [nodeType], ...filters });
  }

  async getNodesByArea(societyId: string, areaId: string): Promise<any[]> {
    return this.getNodes(societyId, { areaIds: [areaId] });
  }

  async getNodesByTower(societyId: string, towerId: string): Promise<any[]> {
    return this.getNodes(societyId, { towerIds: [towerId] });
  }

  async getActiveStatesForNode(societyId: string, nodeId: string): Promise<any[]> {
    return this.getStates(societyId, { nodeIds: [nodeId], quality: ['CONFIRMED', 'ESTIMATED'] });
  }

  async getConflictedStates(societyId: string): Promise<any[]> {
    return this.getStates(societyId, { quality: ['CONFLICTED'] });
  }

  async getStaleStates(societyId: string, thresholdMinutes: number = 60): Promise<any[]> {
    const states = await this.getStates(societyId, {});
    const cutoff = new Date(Date.now() - thresholdMinutes * 60000).toISOString();
    return states.filter(s => s.freshness === 'STALE' || s.freshness === 'STALE_KNOWN' || s.freshness === 'STALE_UNKNOWN' || s.asOf < cutoff);
  }

  async getProjectionHealth(societyId: string): Promise<any> {
    const topology = await this.getTopology(societyId);
    const states = await this.getStates(societyId, {});

    const totalNodes = topology.nodes.length;
    const activeNodes = (topology.nodes as any[]).filter((n: any) => n.status === 'ACTIVE').length;
    const totalStates = states.length;
    const confirmedStates = states.filter(s => s.stateQuality === 'CONFIRMED').length;
    const staleStates = states.filter(s => s.freshness === 'STALE' || s.freshness === 'STALE_KNOWN' || s.freshness === 'STALE_UNKNOWN').length;
    const conflictedStates = states.filter(s => s.stateQuality === 'CONFLICTED').length;

    const lastProjectionEvent = await this.getProjectionEvents(societyId, { limit: 1 });
    const lastProjectionAt = lastProjectionEvent.events[0]?.timestamp || new Date().toISOString();

    return {
      societyId,
      totalNodes,
      activeNodes,
      inactiveNodes: totalNodes - activeNodes,
      totalStates,
      confirmedStates,
      staleStates,
      conflictedStates,
      healthScore: totalNodes > 0 ? Math.round(((confirmedStates / totalStates) * 100)) : 0,
      lastProjectionAt,
      projectionVersion: topology.projectionVersion,
      sourceCoverage: this.calculateSourceCoverage(topology.nodes),
    };
  }

  private calculateSourceCoverage(nodes: any[]): Record<string, number> {
    const coverage: Record<string, number> = {};
    for (const node of nodes) {
      const sourceType = node.sourceEntityType;
      coverage[sourceType] = (coverage[sourceType] || 0) + 1;
    }
    return coverage;
  }

  async getOrphanNodes(societyId: string): Promise<any[]> {
    const topology = await this.getTopology(societyId);
    const states = await this.getStates(societyId, {});
    const stateNodeIds = new Set(states.map(s => s.twinNodeId));
    return (topology.nodes as any[]).filter((n: any) => !stateNodeIds.has(n.twinNodeId));
  }

  async detectDrift(societyId: string): Promise<any[]> {
    // This would compare current projection against source domains
    // Implementation would require access to source domains
    return [];
  }

  async repairDrift(societyId: string, driftDetails: any[], actor: any): Promise<any> {
    // Apply repair actions based on drift details
    return { repaired: 0, failed: 0, actions: [] };
  }

  async getProjectionLag(societyId: string): Promise<number> {
    const events = await this.getProjectionEvents(societyId, { limit: 1 });
    if (events.events.length === 0) return 0;
    const lastEvent = events.events[0];
    const lastProcessed = new Date(lastEvent.timestamp).getTime();
    return Date.now() - lastProcessed;
  }
}

export const digitalTwinService = new DigitalTwinService(null as any);