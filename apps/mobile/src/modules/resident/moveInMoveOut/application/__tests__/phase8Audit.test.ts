import { auditEventTypes } from '../../../../../core/audit/auditEvents';
import type { JsonObject } from '../../../../../core/api/api.types';
import type { AuditEventType } from '../../../../../core/audit/audit.types';
import { toAuditEntry, toAuditActorType, auditActionFor, type Phase8AuditIntent } from '../phase8Audit';
import type { LifecycleActor } from '../../domain/types/primitives';

const PHASE_8_EVENTS: readonly AuditEventType[] = [
  'MOVE_IN_REQUEST_CREATED',
  'MOVE_IN_VERIFICATION_EXCEPTION_RAISED',
  'MOVE_IN_VERIFICATION_EXCEPTION_APPROVED',
  'MOVE_IN_COMPLETED',
  'MOVE_OUT_REQUEST_CREATED',
  'MOVE_OUT_CLEARANCE_EVALUATED',
  'MOVE_OUT_CLEARANCE_OVERRIDDEN',
  'MOVE_OUT_ACCESS_REVOKED',
  'MOVE_OUT_OCCUPANCY_CLOSED',
  'MOVE_OUT_ARCHIVED',
  'FINAL_SETTLEMENT_CALCULATED',
  'FINAL_SETTLEMENT_FROZEN',
  'FINAL_SETTLEMENT_REVIEWED',
  'FINAL_SETTLEMENT_CLEARED',
  'FINAL_SETTLEMENT_EXCEPTION_RAISED',
  'FINAL_SETTLEMENT_REVERSED',
  'NOC_REQUEST_CREATED',
  'NOC_ISSUED',
  'NOC_VERIFIED',
  'ACCESS_ACTIVATED',
  'ACCESS_REVOCATION_FAILED',
  'SLOT_HELD',
  'SLOT_CONFIRMED',
  'SLOT_RELEASED',
];

const RESIDENT: LifecycleActor = {
  actorId: 'resident-1',
  actorType: 'RESIDENT',
  displayName: 'Asha Rao',
  societyId: 'soc-1',
  unitId: 'unit-1',
  onBehalfOfResidentId: undefined,
};

const SYSTEM: LifecycleActor = {
  actorId: 'system',
  actorType: 'SYSTEM',
  displayName: 'Society OS',
  societyId: 'soc-1',
  unitId: undefined,
  onBehalfOfResidentId: undefined,
};

const SECURITY: LifecycleActor = {
  actorId: 'guard-1',
  actorType: 'SECURITY',
  displayName: 'Gate Guard',
  societyId: 'soc-1',
  unitId: undefined,
  onBehalfOfResidentId: undefined,
};

function intentFor(eventType: AuditEventType): Phase8AuditIntent {
  return {
    eventType,
    action: 'UPDATE',
    entityType: 'MOVE_IN_OUT_REQUEST',
    entityId: 'mi-1',
    actor: RESIDENT,
    societyId: 'soc-1',
    unitId: 'unit-1',
    idempotencyKey: 'key-1',
    reason: undefined,
    previousState: undefined,
    newState: { status: 'VERIFIED' },
    outcome: 'SUCCESS',
    error: undefined,
  };
}

describe('phase 8 audit registration', () => {
  it.each(PHASE_8_EVENTS)('registers %s for runtime validation', (eventType) => {
    expect(auditEventTypes).toContain(eventType);
  });

  it('registers no duplicates', () => {
    expect(new Set(auditEventTypes).size).toBe(auditEventTypes.length);
  });

  it('preserves pre-existing core event types', () => {
    expect(auditEventTypes).toContain('DOCUMENT_VIEW_ATTEMPT');
    expect(auditEventTypes).toContain('PERMISSION_DENIED_VIEW');
  });

  it.each(PHASE_8_EVENTS)('maps %s into audit metadata', (eventType) => {
    const entry = toAuditEntry(intentFor(eventType));

    expect(entry.metadata?.eventType).toBe(eventType);
    expect(auditEventTypes).toContain(entry.metadata?.eventType);
  });

  it('keeps other metadata intact when adding the event type', () => {
    const entry = toAuditEntry(intentFor('MOVE_IN_VERIFICATION_EXCEPTION_RAISED'));
    const metadata: JsonObject = entry.metadata as JsonObject;

    expect(metadata.eventType).toBe('MOVE_IN_VERIFICATION_EXCEPTION_RAISED');
    expect(Object.keys(metadata).length).toBeGreaterThan(1);
  });

  it('records the failure outcome and error for a rejected transition', () => {
    const entry = toAuditEntry({
      ...intentFor('MOVE_IN_VERIFICATION_EXCEPTION_RAISED'),
      outcome: 'FAILURE',
      error: { code: 'PRECONDITION_FAILED', message: 'agreementReference' },
    });

    expect(entry.outcome).toBe('FAILURE');
    expect(entry.metadata?.eventType).toBe('MOVE_IN_VERIFICATION_EXCEPTION_RAISED');
  });

  it('maps lifecycle actor types onto audit actor types', () => {
    expect(toAuditActorType(RESIDENT)).toBe('RESIDENT');
    expect(toAuditActorType(SECURITY)).toBe('GUARD');
    expect(toAuditActorType(SYSTEM)).toBe('SYSTEM');
  });

  it('marks a system initiated action as a system job', () => {
    const entry = toAuditEntry({ ...intentFor('FINAL_SETTLEMENT_CLEARED'), actor: SYSTEM });
    expect((entry.metadata as JsonObject).source).toBe('SYSTEM_JOB');
  });

  it('marks a human initiated action as coming from mobile', () => {
    const entry = toAuditEntry(intentFor('FINAL_SETTLEMENT_CLEARED'));
    expect((entry.metadata as JsonObject).source).toBe('MOBILE');
  });

  it('falls back to UPDATE for an unmapped action instead of dropping the audit', () => {
    expect(auditActionFor('ARCHIVE')).toBe('ARCHIVE');
    expect(auditActionFor('SETTLE')).toBe('SETTLE');
    expect(auditActionFor('NOT_A_REAL_ACTION')).toBe('UPDATE');
  });
});
