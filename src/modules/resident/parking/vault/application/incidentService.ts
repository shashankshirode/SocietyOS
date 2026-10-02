import type {
  ParkingVaultErrorCode,
  ParkingVaultClock,
  VaultActor,
  ParkingVaultScope,
  TraceContext,
} from '../domain/types/primitives';
import { violation, denied, allowedWith } from '../domain/types/primitives';
import type {
  ParkingIncidentRecord,
  ParkingIncidentType,
  ParkingIncidentStatus,
  ParkingIncidentPriority,
  ParkingVaultScope,
} from '../domain/types/parking';
import { canTransitionIncident, isIncidentTerminal } from '../domain/stateMachines/violationStateMachine';
import { evaluateActionPermission, evaluateTenantBoundary } from '../domain/guards/authorizationGuard';

export interface IncidentService {
  reportIncident(
    actor: VaultActor,
    input: IncidentReportRequest,
  ): Promise<{ ok: true; value: ParkingIncidentRecord; warnings: readonly string[] } | { ok: false; code: ParkingVaultErrorCode; message: string }>;
  reviewIncident(
    actor: VaultActor,
    input: ReviewRequest,
  ): Promise<{ ok: true; value: ParkingIncidentRecord; warnings: readonly string[] } | { ok: false; code: ParkingVaultErrorCode; message: string }>;
  dismissIncident(
    actor: VaultActor,
    incidentId: string,
    reason: string,
  ): Promise<{ ok: true; value: ParkingIncidentRecord; warnings: readonly string[] } | { ok: false; code: ParkingVaultErrorCode; message: string }>;
  escalateIncident(
    actor: VaultActor,
    incidentId: string,
  ): Promise<{ ok: true; value: ParkingIncidentRecord; warnings: readonly string[] } | { ok: false; code: ParkingVaultErrorCode; message: string }>;
  resolveIncident(
    actor: VaultActor,
    incidentId: string,
    resolutionNotes: string,
  ): Promise<{ ok: true; value: ParkingIncidentRecord; warnings: readonly string[] } | { ok: false; code: ParkingVaultErrorCode; message: string }>;
  reportFalseResolution(
    actor: VaultActor,
    incidentId: string,
  ): Promise<{ ok: true; value: ParkingIncidentRecord; warnings: readonly string[] } | { ok: false; code: ParkingVaultErrorCode; message: string }>;
  getIncident(incidentId: string): ParkingIncidentRecord | undefined;
  getIncidentsByUnit(unitId: string): readonly ParkingIncidentRecord[];
  getIncidentsBySociety(societyId: string): readonly ParkingIncidentRecord[];
  getIncidentsByStatus(societyId: string, status: string): readonly ParkingIncidentRecord[];
}

export type IncidentReportRequest = {
  readonly scope: ParkingVaultScope;
  readonly issueType: ParkingIncidentType;
  readonly reportedFlat: string;
  readonly vehicleNumber: string | undefined;
  readonly location: string;
  readonly description: string;
  readonly priority: ParkingIncidentPriority;
  readonly immediateSecurityHelp: boolean;
  readonly isVehicleBlocked: boolean;
  readonly evidenceLabel: string | undefined;
  readonly idempotencyKey: string;
};

export type ReviewRequest = {
  readonly incidentId: string;
  readonly decision: 'CONFIRM' | 'DISMISS';
  readonly reason: string;
  readonly evidenceLabel: string | undefined;
};

function fail(code: ParkingVaultErrorCode, message: string) {
  return { ok: false, code, message };
}

function firstViolation(violations: readonly any[]): any {
  return violations[0] ?? { code: 'VALIDATION_FAILED', field: 'request', detail: 'Request rejected.' };
}

function advanceIncident(
  incident: ParkingIncidentRecord,
  nextStatus: string,
  patch: Partial<ParkingIncidentRecord> = {},
): ParkingIncidentRecord {
  return {
    ...incident,
    ...patch,
    status: nextStatus as any,
    updatedAt: new Date().toISOString(),
    revision: { revision: incident.revision.revision + 1, revisionToken: `rev-${incident.id}-${incident.revision.revision + 1}` },
  };
}

function incidentBelongsToActor(incident: ParkingIncidentRecord, actor: VaultActor): boolean {
  return incident.scope.societyId === actor.societyId;
}

export function createIncidentService(ports: {
  readonly clock: ParkingVaultClock;
  readonly incidents: {
    readonly insert: (incident: any) => boolean;
    readonly update: (incident: any) => boolean;
    readonly read: (incidentId: string) => any;
    readonly listByUnit: (societyId: string, unitId: string) => readonly any[];
    readonly listBySociety: (societyId: string) => readonly any[];
    readonly listByStatus: (societyId: string, status: string) => readonly any[];
  };
  readonly audit: {
    readonly emit: (entry: any) => void;
  };
}): IncidentService {
  const now = (): string => ports.clock.now().toISOString();

  const persist = (incident: ParkingIncidentRecord) =>
    ports.incidents.update(incident)
      ? { ok: true as const, value: incident, warnings: [] as const }
      : { ok: false as const, code: 'CONCURRENT_WRITE' as const, message: `Incident was modified concurrently.` };

  const reportIncident = async (actor: VaultActor, input: IncidentReportRequest) => {
    if (input.idempotencyKey.trim().length === 0) {
      return fail('IDEMPOTENCY_KEY_REQUIRED', 'An idempotency key is required to report an incident.');
    }
    if (input.scope.societyId !== actor.societyId) {
      return fail('CROSS_SOCIETY_BLOCKED', 'The incident scope does not match the authenticated society.');
    }

    const permission = evaluateActionPermission(actor, 'PARKING_INCIDENT_CREATE');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to report incidents.');

    const boundary = evaluateTenantBoundary(actor, { societyId: input.scope.societyId } as any);
    if (!boundary.allowed) return fail('CROSS_SOCIETY_BLOCKED', 'Cross-society access blocked.');

    const incidentId = `incident-${input.idempotencyKey}`;
    const replay = ports.incidents.read(incidentId);
    if (replay) return { ok: true, value: replay, warnings: ['IDEMPOTENT_REPLAY'] };

    const now = ports.clock.now().toISOString();
    const initialStatus = input.immediateSecurityHelp || input.isVehicleBlocked ? 'SECURITY_NOTIFIED' : 'REPORTED';

    const incident: ParkingIncidentRecord = {
      id: incidentId,
      scope: input.scope,
      incidentNumber: `INC-${input.idempotencyKey}`,
      issueType: input.issueType,
      reportedBy: actor.userId,
      reportedFlat: input.reportedFlat,
      vehicleNumber: input.vehicleNumber,
      location: input.location,
      description: input.description,
      priority: input.priority,
      status: initialStatus,
      assignedTeam: 'Main Gate Security',
      assignedTo: undefined,
      evidenceLabel: input.evidenceLabel,
      resolutionNotes: undefined,
      createdAt: ports.clock.now().toISOString(),
      updatedAt: now(),
      resolvedAt: undefined,
      resolvedBy: undefined,
      resolutionNotes: undefined,
      revision: { revision: 1, revisionToken: `rev-${incidentId}-1` },
      trace: { correlationId: input.idempotencyKey, causationId: undefined },
    };

    if (!ports.incidents.insert(incident)) return fail('CONCURRENT_WRITE', 'Incident already exists.');

    ports.audit.emit({
      id: `aud-${incidentId}`,
      timestamp: now(),
      correlationId: incident.trace.correlationId,
      actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
      action: 'CREATE',
      entityType: 'PARKING_INCIDENT',
      entityId: incidentId,
      previousState: undefined,
      newState: { issueType: input.issueType, priority: input.priority },
      metadata: { idempotencyKey: input.idempotencyKey, source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: incident, warnings: [] };
  };

  const reviewIncident = async (actor: VaultActor, input: ReviewRequest) => {
    const incident = ports.incidents.read(input.incidentId);
    if (!incident) return fail('AGGREGATE_NOT_FOUND', `Incident ${input.incidentId} not found.`);
    if (!incidentBelongsToActor(incident, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Incident belongs to different society.');

    const permission = evaluateActionPermission(actor, 'PARKING_INCIDENT_RESOLVE');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to review incident.');

    if (isIncidentTerminal(incident.status)) {
      return fail('TERMINAL_STATE', 'Incident is in a terminal state and cannot be reviewed.');
    }

    const targetStatus = input.decision === 'CONFIRM' ? 'IN_PROGRESS' : 'REJECTED';
    const transition = canTransitionIncident(incident.status, targetStatus);
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');

    if (!input.reason.trim()) return fail('VALIDATION_FAILED', 'Reason is required for review decision.');

    const updated = advanceIncident(incident, targetStatus, {
      updatedAt: ports.clock.now().toISOString(),
      resolutionNotes: input.reason,
      assignedTo: actor.userId,
    });

    const saved = ports.incidents.update(updated) ? { ok: true as const, value: updated, warnings: [] as const } : fail('CONCURRENT_WRITE', 'Incident was modified concurrently.');
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${input.incidentId}-${input.decision.toLowerCase()}`,
      timestamp: ports.clock.now().toISOString(),
      correlationId: incident.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: input.decision === 'CONFIRM' ? 'CONFIRM' : 'DISMISS',
      entityType: 'PARKING_INCIDENT',
      entityId: input.incidentId,
      previousState: { status: incident.status },
      newState: { status: targetStatus, reason: input.reason },
      metadata: { source: 'MOBILE', evidenceLabel: input.evidenceLabel },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const dismissIncident = async (actor: VaultActor, incidentId: string, reason: string) => {
    const incident = ports.incidents.read(incidentId);
    if (!incident) return fail('AGGREGATE_NOT_FOUND', `Incident ${incidentId} not found.`);
    if (!incidentBelongsToActor(incident, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Incident belongs to different society.');

    const permission = evaluateActionPermission(actor, 'PARKING_INCIDENT_RESOLVE');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to dismiss incident.');

    if (!isIncidentTerminal(incident.status)) {
      return fail('ILLEGAL_TRANSITION', 'Incident is not in a terminal state and cannot be dismissed directly.');
    }

    if (!reason.trim()) return fail('VALIDATION_FAILED', 'Dismissal reason is required.');

    const updated = advanceIncident(incident, 'REJECTED', {
      updatedAt: ports.clock.now().toISOString(),
      resolutionNotes: reason,
      resolvedBy: actor.userId,
      resolvedAt: ports.clock.now().toISOString(),
    });

    const saved = ports.incidents.update(updated) ? { ok: true as const, value: updated, warnings: [] as const } : fail('CONCURRENT_WRITE', 'Incident was modified concurrently.');
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${incidentId}-dismiss`,
      timestamp: ports.clock.now().toISOString(),
      correlationId: incident.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'DISMISS',
      entityType: 'PARKING_INCIDENT',
      entityId: incidentId,
      previousState: { status: incident.status },
      newState: { status: 'REJECTED', reason },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const escalateIncident = async (actor: VaultActor, incidentId: string) => {
    const incident = ports.incidents.read(incidentId);
    if (!incident) return fail('AGGREGATE_NOT_FOUND', `Incident ${incidentId} not found.`);
    if (!incidentBelongsToActor(incident, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Incident belongs to different society.');

    const permission = evaluateActionPermission(actor, 'PARKING_INCIDENT_ESCALATE');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to escalate incident.');

    if (isIncidentTerminal(incident.status)) {
      return fail('TERMINAL_STATE', 'Incident is in a terminal state and cannot be escalated.');
    }

    const transition = canTransitionIncident(incident.status, 'ESCALATED');
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');

    const updated = advanceIncident(incident, 'ESCALATED', {
      updatedAt: ports.clock.now().toISOString(),
      priority: 'URGENT',
      assignedTo: actor.userId,
    });

    const saved = ports.incidents.update(updated) ? { ok: true as const, value: updated, warnings: [] as const } : fail('CONCURRENT_WRITE', 'Incident was modified concurrently.');
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${incidentId}-escalate`,
      timestamp: ports.clock.now().toISOString(),
      correlationId: incident.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'ESCALATE',
      entityType: 'PARKING_INCIDENT',
      entityId: incidentId,
      previousState: { status: incident.status },
      newState: { status: 'ESCALATED' },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const resolveIncident = async (actor: VaultActor, incidentId: string, resolutionNotes: string) => {
    const incident = ports.incidents.read(incidentId);
    if (!incident) return fail('AGGREGATE_NOT_FOUND', `Incident ${incidentId} not found.`);
    if (!incidentBelongsToActor(incident, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Incident belongs to different society.');

    const permission = evaluateActionPermission(actor, 'PARKING_INCIDENT_RESOLVE');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to resolve incident.');

    if (isIncidentTerminal(incident.status)) {
      return fail('TERMINAL_STATE', 'Incident is in a terminal state and cannot be resolved.');
    }

    const transition = canTransitionIncident(incident.status, 'RESOLVED');
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');

    if (!resolutionNotes.trim()) return fail('VALIDATION_FAILED', 'Resolution notes are required.');

    const updated = advanceIncident(incident, 'RESOLVED', {
      updatedAt: ports.clock.now().toISOString(),
      resolvedAt: ports.clock.now().toISOString(),
      resolvedBy: actor.userId,
      resolutionNotes,
    });

    const saved = ports.incidents.update(updated) ? { ok: true as const, value: updated, warnings: [] as const } : fail('CONCURRENT_WRITE', 'Incident was modified concurrently.');
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${incidentId}-resolve`,
      timestamp: ports.clock.now().toISOString(),
      correlationId: incident.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'RESOLVE',
      entityType: 'PARKING_INCIDENT',
      entityId: incidentId,
      previousState: { status: incident.status },
      newState: { status: 'RESOLVED', resolutionNotes },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const reportFalseResolution = async (actor: VaultActor, incidentId: string) => {
    const incident = ports.incidents.read(incidentId);
    if (!incident) return fail('AGGREGATE_NOT_FOUND', `Incident ${incidentId} not found.`);
    if (!incidentBelongsToActor(incident, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Incident belongs to different society.');

    if (incident.status !== 'RESOLVED' && incident.status !== 'CLOSED') {
      return fail('ILLEGAL_TRANSITION', 'Only resolved or closed incidents can have false resolution reported.');
    }

    const updated = advanceIncident(incident, 'ESCALATED', {
      updatedAt: ports.clock.now().toISOString(),
      priority: 'URGENT',
      resolutionNotes: undefined,
    });

    const saved = ports.incidents.update(updated) ? { ok: true as const, value: updated, warnings: [] as const } : fail('CONCURRENT_WRITE', 'Incident was modified concurrently.');
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${incidentId}-false-resolution`,
      timestamp: ports.clock.now().toISOString(),
      correlationId: incident.trace.correlationId,
      actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
      action: 'REPORT_FALSE_RESOLUTION',
      entityType: 'PARKING_INCIDENT',
      entityId: incidentId,
      previousState: { status: incident.status },
      newState: { status: 'ESCALATED' },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  function fail(code: ParkingVaultErrorCode, message: string) {
    return { ok: false, code, message };
  }

  const getIncident = (incidentId: string) => ports.incidents.read(incidentId);
  const getIncidentsByUnit = (unitId: string) => ports.incidents.listByUnit('society-001', unitId);
  const getIncidentsBySociety = (societyId: string) => ports.incidents.listBySociety(societyId);
  const getIncidentsByStatus = (societyId: string, status: string) => ports.incidents.listByStatus(societyId, status);

  return {
    reportIncident,
    reviewIncident,
    dismissIncident,
    escalateIncident,
    resolveIncident,
    reportFalseResolution,
    getIncident,
    getIncidentsByUnit,
    getIncidentsBySociety,
    getIncidentsByStatus,
  };
}