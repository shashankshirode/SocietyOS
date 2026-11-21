import { createAuditEntry } from '../../../../core/audit/auditService';
import type { AuditActorType, AuditAction, AuditEntityType } from '../../../../core/audit/audit.types';
import type { JsonObject } from '../../../../core/api/api.types';
import type { Absent } from '../../../../shared/types/absence.types';
import type { DomainViolation, LifecycleActor } from '../domain/types/primitives';

const ACTOR_TYPE_BY_LIFECYCLE_ROLE: Readonly<Record<LifecycleActor['actorType'], AuditActorType>> = {
  RESIDENT: 'RESIDENT',
  OWNER: 'RESIDENT',
  TENANT: 'RESIDENT',
  FAMILY_MEMBER: 'RESIDENT',
  SOCIETY_ADMIN: 'ADMIN',
  SOCIETY_SECRETARY: 'STAFF',
  SOCIETY_CHAIRPERSON: 'STAFF',
  TREASURER: 'STAFF',
  FACILITY_MANAGER: 'STAFF',
  SECURITY: 'GUARD',
  SYSTEM: 'SYSTEM',
  AUDITOR: 'STAFF',
};

export function toAuditActorType(actor: LifecycleActor): AuditActorType {
  return ACTOR_TYPE_BY_LIFECYCLE_ROLE[actor.actorType];
}

export function auditActionFor(action: string): AuditAction {
  const known: readonly AuditAction[] = [
    'CREATE',
    'APPROVE',
    'REJECT',
    'VERIFY',
    'SIGN',
    'REVERSE',
    'OVERRIDE',
    'ARCHIVE',
    'SETTLE',
    'UPDATE',
  ];
  return known.find((candidate) => candidate === action) ?? 'UPDATE';
}

export type Phase8AuditIntent = {
  readonly eventType: string;
  readonly action: string;
  readonly entityType: AuditEntityType;
  readonly entityId: string;
  readonly actor: LifecycleActor;
  readonly societyId: string;
  readonly unitId: string | Absent;
  readonly idempotencyKey: string | Absent;
  readonly reason: string | Absent;
  readonly previousState: JsonObject | Absent;
  readonly newState: JsonObject | Absent;
  readonly outcome: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
  readonly error: { readonly code: string; readonly message: string } | Absent;
};

export function toAuditEntry(intent: Phase8AuditIntent) {
  const base = createAuditEntry({
    actorUserId: intent.actor.actorId,
    actorType: toAuditActorType(intent.actor),
    societyId: intent.societyId,
    unitId: intent.unitId,
    role: intent.actor.actorType,
    action: auditActionFor(intent.action),
    entityType: intent.entityType,
    entityId: intent.entityId,
    previousState: intent.previousState,
    newState: intent.newState,
    idempotencyKey: intent.idempotencyKey,
    source: intent.actor.actorType === 'SYSTEM' ? 'SYSTEM_JOB' : 'MOBILE',
    reason: intent.reason,
    outcome: intent.outcome,
    error: intent.error,
  });

  return {
    ...base,
    metadata: {
      ...base.metadata,
      eventType: intent.eventType,
    },
  };
}

export function violationsToAuditError(
  violations: readonly DomainViolation[],
): { readonly code: string; readonly message: string } | Absent {
  const blocking = violations.filter((violation) => violation.blocking);

  if (blocking.length === 0) {
    return undefined;
  }

  return {
    code: blocking[0]?.code ?? 'PRECONDITION_FAILED',
    message: blocking.map((violation) => violation.field).join(', '),
  };
}
