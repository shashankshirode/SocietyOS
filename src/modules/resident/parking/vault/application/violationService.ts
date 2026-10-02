import type {
  ParkingVaultErrorCode,
  ParkingVaultClock,
  VaultActor,
  ParkingVaultScope,
} from '../domain/types/primitives';
import { violation, denied, allowedWith } from '../domain/types/primitives';
import type {
  ParkingViolationRecord,
  ParkingViolationStatus,
  ParkingViolationType,
  ParkingVaultScope,
} from '../domain/types/parking';
import {
  canTransitionViolation,
  isViolationTerminal,
  canApplyPenalty,
  canOverturnViolation,
} from '../domain/stateMachines/violationStateMachine';
import { evaluateActionPermission } from '../domain/guards/authorizationGuard';

export interface ViolationService {
  recordViolation(
    actor: VaultActor,
    input: ViolationRecordRequest,
  ): Promise<{ ok: true; value: ParkingViolationRecord; warnings: readonly string[] } | { ok: false; code: ParkingVaultErrorCode; message: string }>;
  applyPenalty(
    actor: VaultActor,
    violationId: string,
    penaltyAmount: number,
    paymentObligationId: string,
  ): Promise<{ ok: true; value: ParkingViolationRecord; warnings: readonly string[] } | { ok: false; code: ParkingVaultErrorCode; message: string }>;
  overturnViolation(
    actor: VaultActor,
    violationId: string,
    reason: string,
    reversalObligationId: string | undefined,
  ): Promise<{ ok: true; value: ParkingViolationRecord; warnings: readonly string[] } | { ok: false; code: ParkingVaultErrorCode; message: string }>;
  updateViolationStatus(
    actor: VaultActor,
    violationId: string,
    status: ParkingViolationStatus,
    reason: string,
  ): Promise<{ ok: true; value: ParkingViolationRecord; warnings: readonly string[] } | { ok: false; code: ParkingVaultErrorCode; message: string }>;
  getViolation(violationId: string): ParkingViolationRecord | undefined;
  getViolationsByVehicle(societyId: string, vehicleNumber: string): readonly ParkingViolationRecord[];
  getViolationsBySociety(societyId: string): readonly ParkingViolationRecord[];
  getViolationsByStatus(societyId: string, status: string): readonly ParkingViolationRecord[];
  checkRepeatOffence(societyId: string, vehicleNumber: string, timeWindow: string): number;
}

export type ViolationRecordRequest = {
  readonly scope: ParkingVaultScope;
  readonly vehicleNumber: string;
  readonly violationType: ParkingViolationType;
  readonly dateTime: string;
  readonly location: string;
  readonly details: string;
  readonly incidentId: string | undefined;
  readonly idempotencyKey: string;
};

function fail(code: ParkingVaultErrorCode, message: string) {
  return { ok: false, code, message };
}

function advanceViolation(
  violation: ParkingViolationRecord,
  nextStatus: ParkingViolationStatus,
  patch: Partial<ParkingViolationRecord> = {},
): ParkingViolationRecord {
  return {
    ...violation,
    ...patch,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
    revision: { revision: violation.revision.revision + 1, revisionToken: `rev-${violation.id}-${violation.revision.revision + 1}` },
  };
}

function violationBelongsToActor(violation: ParkingViolationRecord, actor: VaultActor): boolean {
  return violation.scope.societyId === actor.societyId;
}

export function createViolationService(ports: {
  readonly clock: ParkingVaultClock;
  readonly violations: {
    readonly insert: (violation: any) => boolean;
    readonly update: (violation: any) => boolean;
    readonly read: (violationId: string) => any;
    readonly listByVehicle: (societyId: string, vehicleNumber: string) => readonly any[];
    readonly listBySociety: (societyId: string) => readonly any[];
    readonly listByStatus: (societyId: string, status: string) => readonly any[];
    readonly findRepeatOffences: (societyId: string, vehicleNumber: string, timeWindow: string) => number;
  };
  readonly audit: {
    readonly emit: (entry: any) => void;
  };
}): ViolationService {
  const now = (): string => ports.clock.now().toISOString();

  const persist = (violation: ParkingViolationRecord) =>
    ports.violations.update(violation)
      ? { ok: true as const, value: violation, warnings: [] as const }
      : { ok: false as const, code: 'CONCURRENT_WRITE' as const, message: `Violation was modified concurrently.` };

  const recordViolation = async (actor: VaultActor, input: ViolationRecordRequest) => {
    if (input.idempotencyKey.trim().length === 0) {
      return fail('IDEMPOTENCY_KEY_REQUIRED', 'An idempotency key is required to record a violation.');
    }
    if (input.scope.societyId !== actor.societyId) {
      return fail('CROSS_SOCIETY_BLOCKED', 'The violation scope does not match the authenticated society.');
    }

    const permission = evaluateActionPermission(actor, 'PARKING_VIOLATION_RECORD');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to record violations.');

    const boundary = evaluateTenantBoundary(actor, { societyId: input.scope.societyId } as any);
    if (!boundary.allowed) return fail('CROSS_SOCIETY_BLOCKED', 'Cross-society access blocked.');

    const violationId = `viol-${input.idempotencyKey}`;
    const replay = ports.violations.read(violationId);
    if (replay) return { ok: true, value: replay, warnings: ['IDEMPOTENT_REPLAY'] };

    const now = new Date().toISOString();
    const violation: ParkingViolationRecord = {
      id: violationId,
      scope: input.scope,
      violationNumber: `VIO-${input.idempotencyKey}`,
      vehicleNumber: input.vehicleNumber,
      violationType: input.violationType,
      dateTime: input.dateTime,
      location: input.location,
      status: 'RECORDED',
      penaltyAmount: undefined,
      isRepeatOffence: false,
      details: input.details,
      incidentId: input.incidentId,
      penaltyObligationId: undefined,
      overturnedAt: undefined,
      overturnedBy: undefined,
      overturnReason: undefined,
      createdAt: now(),
      updatedAt: now(),
      revision: { revision: 1, revisionToken: `rev-${violationId}-1` },
      trace: { correlationId: input.idempotencyKey, causationId: undefined },
    };

    const inserted = ports.violations.insert(violation);
    if (!inserted) return fail('CONCURRENT_WRITE', 'Violation already exists.');

    ports.audit.emit({
      id: `aud-${violationId}`,
      timestamp: now(),
      correlationId: violation.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'RECORD_VIOLATION',
      entityType: 'PARKING_VIOLATION',
      entityId: violationId,
      previousState: undefined,
      newState: { violationType: input.violationType, vehicleNumber: input.vehicleNumber },
      metadata: { idempotencyKey: input.idempotencyKey, source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: violation, warnings: [] };
  };

  const applyPenalty = async (actor: VaultActor, violationId: string, penaltyAmount: number, paymentObligationId: string) => {
    const violation = ports.violations.read(violationId);
    if (!violation) return fail('AGGREGATE_NOT_FOUND', `Violation ${violationId} not found.`);
    if (!violationBelongsToActor(violation, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Violation belongs to different society.');

    if (!canApplyPenalty(violation.status)) {
      return fail('ILLEGAL_TRANSITION', 'Penalty cannot be applied in current violation state.');
    }

    const updated = advanceViolation(violation, 'PENALTY_PENDING', {
      penaltyAmount,
      penaltyObligationId: paymentObligationId,
      updatedAt: new Date().toISOString(),
    });

    const saved = ports.violations.update(updated)
      ? { ok: true as const, value: updated, warnings: [] as const }
      : fail('CONCURRENT_WRITE', 'Violation was modified concurrently.');

    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${violationId}-penalty`,
      timestamp: new Date().toISOString(),
      correlationId: violation.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'APPLY_PENALTY',
      entityType: 'PARKING_VIOLATION',
      entityId: violationId,
      previousState: { status: violation.status },
      newState: { status: 'PENALTY_PENDING', penaltyAmount, paymentObligationId },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const overturnViolation = async (actor: VaultActor, violationId: string, reason: string, reversalObligationId: string | undefined) => {
    const violation = ports.violations.read(violationId);
    if (!violation) return fail('AGGREGATE_NOT_FOUND', `Violation ${violationId} not found.`);
    if (!violationBelongsToActor(violation, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Violation belongs to different society.');

    if (!canOverturnViolation(violation.status)) {
      return fail('ILLEGAL_TRANSITION', 'Violation cannot be overturned in its current state.');
    }

    if (!reason.trim()) return fail('VALIDATION_FAILED', 'Overturn reason is required.');

    const updated = advanceViolation(violation, 'OVERTURNED', {
      overturnedAt: new Date().toISOString(),
      overturnedBy: actor.userId,
      overturnReason: reason,
      penaltyObligationId: reversalObligationId,
      updatedAt: new Date().toISOString(),
    });

    const saved = ports.violations.update(updated)
      ? { ok: true as const, value: updated, warnings: [] as const }
      : fail('CONCURRENT_WRITE', 'Violation was modified concurrently.');

    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${violationId}-overturn`,
      timestamp: new Date().toISOString(),
      correlationId: violation.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'OVERTURN_VIOLATION',
      entityType: 'PARKING_VIOLATION',
      entityId: violationId,
      previousState: { status: violation.status, penaltyAmount: violation.penaltyAmount },
      newState: { status: 'OVERTURNED', reason, reversalObligationId },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const updateViolationStatus = async (actor: VaultActor, violationId: string, status: ParkingViolationStatus, reason: string) => {
    const violation = ports.violations.read(violationId);
    if (!violation) return fail('AGGREGATE_NOT_FOUND', `Violation ${violationId} not found.`);
    if (!violationBelongsToActor(violation, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Violation belongs to different society.');

    const transition = canTransitionViolation(violation.status, status);
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Invalid transition.');

    if (status === 'CLOSED' && !reason.trim()) return fail('VALIDATION_FAILED', 'Reason is required for closing violation.');

    const updated = advanceViolation(violation, status, { updatedAt: new Date().toISOString() });
    const saved = ports.violations.update(updated)
      ? { ok: true as const, value: updated, warnings: [] as const }
      : fail('CONCURRENT_WRITE', 'Violation was modified concurrently.');

    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${violationId}-status`,
      timestamp: new Date().toISOString(),
      correlationId: violation.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'UPDATE_STATUS',
      entityType: 'PARKING_VIOLATION',
      entityId: violationId,
      previousState: { status: violation.status },
      newState: { status, reason },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const getViolation = (violationId: string) => ports.violations.read(violationId);
  const getViolationsByVehicle = (societyId: string, vehicleNumber: string) => ports.violations.listByVehicle(societyId, vehicleNumber);
  const getViolationsBySociety = (societyId: string) => ports.violations.listBySociety(societyId);
  const getViolationsByStatus = (societyId: string, status: string) => ports.violations.listByStatus(societyId, status);
  const checkRepeatOffence = (societyId: string, vehicleNumber: string, timeWindow: string) => ports.violations.findRepeatOffences(societyId, vehicleNumber, timeWindow);

  function fail(code: ParkingVaultErrorCode, message: string) {
    return { ok: false, code, message };
  }

  return {
    recordViolation,
    applyPenalty,
    overturnViolation,
    updateViolationStatus,
    getViolation,
    getViolationsByVehicle,
    getViolationsBySociety,
    getViolationsByStatus,
    checkRepeatOffence,
  };
}