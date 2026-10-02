import type { Absent } from '../../../../../shared/types/absence.types';
import type { VaultClock, VaultActor, DocumentVaultErrorCode } from '../domain/types/primitives';
import { violation, denied, allowedWith } from '../domain/types/primitives';
import type { DocumentRecord } from '../domain/types/document.types';
import type { LegalHold, RetentionAssessment, RetentionBasis, DispositionOutcome, RetentionJobOutcome, TraceableRetentionRecord } from '../domain/types/retention.types';
import type { LegalHoldStore, AuditSink, ObjectStorePort, VaultPorts } from './application/ports';
import {
  canTransitionRetention,
  activeHolds,
  assessRetention,
  retentionGate,
  applyDisposition,
  isTerminalRetention,
} from '../domain/stateMachines/retentionStateMachine';
import { evaluateActionPermission, evaluateTenantBoundary } from '../domain/guards/authorizationGuard';

export interface RetentionService {
  placeLegalHold(
    actor: VaultActor,
    document: DocumentRecord,
    reason: string,
  ): { ok: true; value: LegalHold; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  releaseLegalHold(
    actor: VaultActor,
    holdId: string,
  ): { ok: true; value: LegalHold; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  assessRetention(
    actor: VaultActor,
    document: DocumentRecord,
    policyId: string,
    policyVersion: number,
    retainUntil: string | Absent,
    erasureRequest: { subjectUserId: string; requestedBy: string } | Absent,
  ): { ok: true; value: RetentionAssessment; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  applyDisposition(
    actor: VaultActor,
    document: DocumentRecord,
    assessment: RetentionAssessment,
    requestedDisposition: 'ARCHIVE' | 'ANONYMISE' | 'PURGE',
  ): { ok: true; value: DispositionOutcome; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  processRetentionJob(
    actor: VaultActor,
    document: DocumentRecord,
    policyId: string,
    policyVersion: number,
    retainUntil: string | Absent,
    erasureRequest: { subjectUserId: string; requestedBy: string } | Absent,
    idempotencyKey: string,
  ): { ok: true; value: RetentionJobOutcome; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  getLegalHolds(documentId: string): readonly LegalHold[];
  getRetentionHistory(documentId: string): readonly TraceableRetentionRecord[];
}

function fail(code: DocumentVaultErrorCode, message: string) {
  return { ok: false, code, message };
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const retentionRecords = new Map<string, TraceableRetentionRecord>();

export function createRetentionService(ports: Pick<VaultPorts, 'legalHolds' | 'objects' | 'audit' | 'clock'>): RetentionService {
  const now = (): string => ports.clock.now().toISOString();

  const placeLegalHold: RetentionService['placeLegalHold'] = (actor, document, reason) => {
    const permission = evaluateActionPermission(actor, 'PLACE_LEGAL_HOLD');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to place legal hold.');

    const boundary = evaluateTenantBoundary(actor, document);
    if (!boundary.allowed) return fail('CROSS_SOCIETY_BLOCKED', 'Cross-society access blocked.');

    const holdId = generateId('hold');
    const hold: LegalHold = {
      id: holdId,
      scope: document.scope,
      documentId: document.id,
      reason,
      placedBy: actor.userId,
      placedAt: now(),
      releasedAt: undefined,
      releasedBy: undefined,
      active: true,
    };

    if (!ports.legalHolds.insert(hold)) return fail('CONCURRENT_WRITE', 'Legal hold already exists.');

    ports.audit.emit({
      id: `aud-${holdId}`,
      timestamp: now(),
      correlationId: '',
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'PLACE_LEGAL_HOLD',
      entityType: 'LEGAL_HOLD',
      entityId: holdId,
      previousState: undefined,
      newState: { documentId: document.id, reason },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: hold, warnings: [] };
  };

  const releaseLegalHold: RetentionService['releaseLegalHold'] = (actor, holdId) => {
    const permission = evaluateActionPermission(actor, 'RELEASE_LEGAL_HOLD');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to release legal hold.');

    const holds = ports.legalHolds.listByDocument('');
    const hold = holds.find((h) => h.id === holdId);
    if (!hold) return fail('AGGREGATE_NOT_FOUND', `Legal hold ${holdId} not found.`);

    if (!hold.active) return { ok: true, value: hold, warnings: ['ALREADY_RELEASED'] };

    const updated: LegalHold = { ...hold, active: false, releasedAt: now(), releasedBy: actor.userId };
    if (!ports.legalHolds.update(updated)) return fail('CONCURRENT_WRITE', 'Legal hold was modified concurrently.');

    ports.audit.emit({
      id: `aud-${holdId}-release`,
      timestamp: now(),
      correlationId: '',
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'RELEASE_LEGAL_HOLD',
      entityType: 'LEGAL_HOLD',
      entityId: holdId,
      previousState: { active: true },
      newState: { active: false, releasedBy: actor.userId },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: updated, warnings: [] };
  };

  const assessRetention: RetentionService['assessRetention'] = (actor, document, policyId, policyVersion, retainUntil, erasureRequest) => {
    const permission = evaluateActionPermission(actor, 'APPLY_RETENTION');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to assess retention.');

    const boundary = evaluateTenantBoundary(actor, document);
    if (!boundary.allowed) return fail('CROSS_SOCIETY_BLOCKED', 'Cross-society access blocked.');

    const holds = activeHolds(
      Array.from((ports.legalHolds as any).listByDocument?.(document.id) ?? []),
      document.id,
    );

    const assessment = assessRetention({
      documentId: document.id,
      retainUntil,
      policyId,
      policyVersion,
      holds,
      erasureRequest: erasureRequest ? { ...erasureRequest, id: generateId('erasure'), requestedAt: now(), eligibleFields: [], state: 'RECEIVED', completedAt: undefined, deferralReason: undefined } : undefined,
      evaluatedAt: ports.clock.now(),
    });

    return { ok: true, value: assessment, warnings: [] };
  };

  const applyDisposition: RetentionService['applyDisposition'] = async (actor, document, assessment, requestedDisposition) => {
    const permission = evaluateActionPermission(actor, 'APPLY_RETENTION');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to apply disposition.');

    const boundary = evaluateTenantBoundary(actor, document);
    if (!boundary.allowed) return fail('CROSS_SOCIETY_BLOCKED', 'Cross-society access blocked.');

    const gate = retentionGate(assessment, requestedDisposition);
    if (gate) return fail(gate.code, gate.detail ?? 'Disposition blocked.');

    const nextState = applyDisposition(document.retentionLifecycle, assessment);

    let objectDeleted = false;
    if (requestedDisposition === 'PURGE' && document.currentVersionId) {
      const version = (ports as any).versions?.read?.(document.currentVersionId);
      if (version?.objectDigestRef) {
        const deleted = await ports.objects.delete(version.objectDigestRef);
        objectDeleted = deleted;
      }
    }

    const outcome: DispositionOutcome = {
      applied: true,
      nextState,
      objectDeleted,
      detail: `Disposition ${requestedDisposition} applied. Next retention state: ${nextState}.`,
    };

    const record: TraceableRetentionRecord = {
      id: generateId('ret'),
      scope: document.scope,
      documentId: document.id,
      state: nextState,
      assessment,
      revision: { revision: 1, revisionToken: `ret-${document.id}-${Date.now()}` },
      trace: { correlationId: '', causationId: undefined },
    };
    retentionRecords.set(record.id, record);

    ports.audit.emit({
      id: `aud-${record.id}`,
      timestamp: now(),
      correlationId: '',
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'APPLY_RETENTION',
      entityType: 'RETENTION',
      entityId: document.id,
      previousState: { state: document.retentionLifecycle },
      newState: { state: nextState, disposition: requestedDisposition, objectDeleted },
      metadata: { source: 'MOBILE', assessment },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: outcome, warnings: [] };
  };

  const processRetentionJob: RetentionService['processRetentionJob'] = async (actor, document, policyId, policyVersion, retainUntil, erasureRequest, idempotencyKey) => {
    const assessment = assessRetention({
      documentId: document.id,
      retainUntil,
      policyId,
      policyVersion,
      holds: activeHolds(
        Array.from((ports.legalHolds as any).listByDocument?.(document.id) ?? []),
        document.id,
      ),
      erasureRequest: erasureRequest ? { ...erasureRequest, id: generateId('erasure'), requestedAt: now(), eligibleFields: [], state: 'RECEIVED', completedAt: undefined, deferralReason: undefined } : undefined,
      evaluatedAt: ports.clock.now(),
    });

    let disposition: 'ARCHIVE' | 'ANONYMISE' | 'PURGE' = 'RETAIN' as any;
    if (assessment.disposition !== 'RETAIN') {
      disposition = assessment.disposition;
    }

    let outcome: DispositionOutcome;
    if (disposition !== 'RETAIN') {
      const gate = retentionGate(assessment, disposition);
      if (!gate) {
        const nextState = applyDisposition(document.retentionLifecycle, assessment);
        let objectDeleted = false;
        if (disposition === 'PURGE' && document.currentVersionId) {
          const version = (ports as any).versions?.read?.(document.currentVersionId);
          if (version?.objectDigestRef) {
            objectDeleted = await ports.objects.delete(version.objectDigestRef);
          }
        }
        outcome = {
          applied: true,
          nextState,
          objectDeleted,
          detail: `Disposition ${disposition} applied. Next retention state: ${nextState}.`,
        };
      } else {
        outcome = { applied: false, reason: gate.code, detail: gate.detail ?? 'Disposition blocked.' };
      }
    } else {
      outcome = { applied: false, reason: 'NOT_DUE', detail: 'Retention not due.' };
    }

    const jobOutcome: RetentionJobOutcome = {
      documentId: document.id,
      assessment,
      outcome,
      idempotencyKey,
      processedAt: now(),
    };

    const record: TraceableRetentionRecord = {
      id: generateId('ret-job'),
      scope: document.scope,
      documentId: document.id,
      state: outcome.applied ? outcome.nextState : document.retentionLifecycle,
      assessment,
      revision: { revision: 1, revisionToken: `ret-job-${document.id}-${Date.now()}` },
      trace: { correlationId: idempotencyKey, causationId: undefined },
    };
    retentionRecords.set(record.id, record);

    ports.audit.emit({
      id: `aud-${record.id}`,
      timestamp: now(),
      correlationId: idempotencyKey,
      actor: { userId: actor.userId, type: 'SYSTEM', role: actor.role, societyId: actor.societyId },
      action: 'RETENTION_JOB',
      entityType: 'RETENTION_JOB',
      entityId: document.id,
      previousState: { state: document.retentionLifecycle },
      newState: { outcome },
      metadata: { source: 'SYSTEM_JOB', idempotencyKey },
      outcome: outcome.applied ? 'SUCCESS' : 'BLOCKED',
    });

    return { ok: true, value: jobOutcome, warnings: [] };
  };

  const getLegalHolds = (documentId: string): readonly LegalHold[] => ports.legalHolds.listByDocument(documentId);

  const getRetentionHistory = (documentId: string): readonly TraceableRetentionRecord[] => {
    return Array.from(retentionRecords.values()).filter((r) => r.documentId === documentId);
  };

  return {
    placeLegalHold,
    releaseLegalHold,
    assessRetention,
    applyDisposition,
    processRetentionJob,
    getLegalHolds,
    getRetentionHistory,
  };
}