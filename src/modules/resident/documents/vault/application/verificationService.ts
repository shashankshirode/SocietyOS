import type { Absent } from '../../../../../shared/types/absence.types';
import type { VaultClock, VaultActor, DocumentVaultErrorCode } from '../domain/types/primitives';
import { violation, denied, allowedWith } from '../domain/types/primitives';
import type { DocumentRecord } from '../domain/types/document.types';
import type { VerificationCase, VerificationCaseState, VerificationDecision, VerificationChecklist } from '../domain/types/verification.types';
import type { SignatureEnvelope, SignatureEnvelopeState, SignatureMethod, SignatureSigner } from '../domain/types/verification.types';
import type { VerificationCaseStore, SignatureEnvelopeStore, AuditSink, NotificationPort, VaultPorts } from './application/ports';
import {
  canTransitionVerification,
  canTransitionSignature,
  isReviewable,
  missingRequiredItems,
  isChecklistComplete,
  hasFailedRequiredItem,
  decisionTargetState,
  requiresReason,
  approvalBlocked,
  appendDecision,
  applyChecklistCompletion,
  applyChecklistFailure,
  isResubmissionExpired,
  isResubmissionExhausted,
  isCaseClosed,
  isSignatureProviderBlocking,
  isSignatureSatisfied,
  canSealSignature,
  hasSigner,
  nextSignatureState,
  buildSigner,
} from '../domain/stateMachines/verificationStateMachine';
import { evaluateActionPermission, evaluateTenantBoundary } from '../domain/guards/authorizationGuard';

export interface VerificationService {
  createCase(
    actor: VaultActor,
    document: DocumentRecord,
    versionId: string,
    checklist: VerificationChecklist,
    traceContext: { correlationId: string; causationId?: string },
  ): { ok: true; value: VerificationCase; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  submitChecklist(
    actor: VaultActor,
    caseId: string,
    completedItemIds: readonly string[],
  ): { ok: true; value: VerificationCase; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  failChecklistItem(
    actor: VaultActor,
    caseId: string,
    itemId: string,
    note: string,
  ): { ok: true; value: VerificationCase; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  decide(
    actor: VaultActor,
    caseId: string,
    decision: VerificationDecision,
    reason: string | Absent,
  ): { ok: true; value: VerificationCase; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  requestResubmission(
    actor: VaultActor,
    caseId: string,
    deadline: string,
  ): { ok: true; value: VerificationCase; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  expireResubmission(
    actor: VaultActor,
    caseId: string,
  ): { ok: true; value: VerificationCase; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  closeCase(
    actor: VaultActor,
    caseId: string,
  ): { ok: true; value: VerificationCase; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  revokeCase(
    actor: VaultActor,
    caseId: string,
    reason: string,
  ): { ok: true; value: VerificationCase; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  requestSignature(
    actor: VaultActor,
    caseId: string,
    method: SignatureMethod,
    expectedSigners: readonly { signerId: string; signerRole: string }[],
  ): { ok: true; value: SignatureEnvelope; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  addSignature(
    actor: VaultActor,
    envelopeId: string,
    signerId: string,
    signerRole: string,
    providerReference: string | Absent,
    certificateThumbprint: string | Absent,
  ): { ok: true; value: SignatureEnvelope; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  sealSignature(
    actor: VaultActor,
    envelopeId: string,
    expectedSigners: number,
  ): { ok: true; value: SignatureEnvelope; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  failSignature(
    actor: VaultActor,
    envelopeId: string,
    detail: string,
  ): { ok: true; value: SignatureEnvelope; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  revokeSignature(
    actor: VaultActor,
    envelopeId: string,
    reason: string,
  ): { ok: true; value: SignatureEnvelope; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  getCase(caseId: string): VerificationCase | Absent;
  getCasesByDocument(documentId: string): readonly VerificationCase[];
  getCasesBySociety(societyId: string): readonly VerificationCase[];
  getEnvelope(envelopeId: string): SignatureEnvelope | Absent;
  getEnvelopeByDocument(documentId: string): SignatureEnvelope | Absent;
}

function fail(code: DocumentVaultErrorCode, message: string) {
  return { ok: false, code, message };
}

function advanceCase(
  vcase: VerificationCase,
  nextState: VerificationCaseState,
  patch: Partial<VerificationCase> = {},
): VerificationCase {
  return {
    ...vcase,
    ...patch,
    state: nextState,
    revision: { revision: vcase.revision.revision + 1, revisionToken: `rev-${vcase.id}-${vcase.revision.revision + 1}` },
  };
}

function advanceEnvelope(
  envelope: SignatureEnvelope,
  nextState: SignatureEnvelopeState,
  patch: Partial<SignatureEnvelope> = {},
): SignatureEnvelope {
  return {
    ...envelope,
    ...patch,
    state: nextState,
    revision: { revision: envelope.revision.revision + 1, revisionToken: `rev-${envelope.id}-${envelope.revision.revision + 1}` },
  };
}

function caseBelongsToActor(vcase: VerificationCase, actor: VaultActor): boolean {
  return vcase.scope.societyId === actor.societyId;
}

function envelopeBelongsToActor(envelope: SignatureEnvelope, actor: VaultActor): boolean {
  return envelope.scope.societyId === actor.societyId;
}

export function createVerificationService(ports: Pick<VaultPorts, 'verificationCases' | 'signatureEnvelopes' | 'audit' | 'notifications' | 'clock'>): VerificationService {
  const now = (): string => ports.clock.now().toISOString();

  const persistCase = (vcase: VerificationCase) =>
    ports.verificationCases.update(vcase)
      ? { ok: true as const, value: vcase, warnings: [] as const }
      : fail('CONCURRENT_WRITE', `Verification case ${vcase.id} was modified concurrently.`);

  const persistEnvelope = (envelope: SignatureEnvelope) =>
    ports.signatureEnvelopes.update(envelope)
      ? { ok: true as const, value: envelope, warnings: [] as const }
      : fail('CONCURRENT_WRITE', `Signature envelope ${envelope.id} was modified concurrently.`);

  const createCase: VerificationService['createCase'] = (actor, document, versionId, checklist, traceContext) => {
    const permission = evaluateActionPermission(actor, 'REVIEW_VERIFICATION');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to create verification case.');

    const boundary = evaluateTenantBoundary(actor, document);
    if (!boundary.allowed) return fail('CROSS_SOCIETY_BLOCKED', 'Cross-society access blocked.');

    if (!isReviewable('OPEN')) return fail('ILLEGAL_TRANSITION', 'Cannot create case in current state.');

    const caseId = `vc-${document.id}-${Date.now()}`;
    const vcase: VerificationCase = {
      id: caseId,
      scope: document.scope,
      documentId: document.id,
      versionId,
      versionNumber: document.currentVersionNumber,
      state: 'OPEN',
      checklist,
      submittedBy: actor.userId,
      submittedAt: now(),
      assignedReviewerId: undefined,
      decisions: [],
      resubmission: undefined,
      closesAt: undefined,
      revision: { revision: 1, revisionToken: `rev-${caseId}-1` },
      trace: traceContext,
    };

    if (!ports.verificationCases.insert(vcase)) return fail('CONCURRENT_WRITE', 'Case already exists.');

    ports.audit.emit({
      id: `aud-${caseId}`,
      timestamp: now(),
      correlationId: traceContext.correlationId,
      actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
      action: 'CREATE',
      entityType: 'VERIFICATION_CASE',
      entityId: caseId,
      previousState: undefined,
      newState: { state: 'OPEN', documentId: document.id, versionId },
      metadata: { idempotencyKey: traceContext.correlationId, source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: vcase, warnings: [] };
  };

  const submitChecklist: VerificationService['submitChecklist'] = (actor, caseId, completedItemIds) => {
    const vcase = ports.verificationCases.read(caseId);
    if (!vcase) return fail('AGGREGATE_NOT_FOUND', `Verification case ${caseId} not found.`);
    if (!caseBelongsToActor(vcase, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Case belongs to different society.');

    const transition = canTransitionVerification(vcase.state, 'IN_REVIEW');
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Illegal transition.');

    const updatedChecklist = applyChecklistCompletion(vcase.checklist, completedItemIds, actor.userId, now());
    const updated = advanceCase(vcase, 'IN_REVIEW', { checklist: updatedChecklist, assignedReviewerId: actor.userId });

    const saved = persistCase(updated);
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${caseId}-checklist`,
      timestamp: now(),
      correlationId: vcase.trace.correlationId,
      actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
      action: 'UPDATE',
      entityType: 'VERIFICATION_CASE',
      entityId: caseId,
      previousState: { state: vcase.state, completedItems: vcase.checklist.items.filter((i) => i.state === 'COMPLETED').map((i) => i.id) },
      newState: { state: 'IN_REVIEW', completedItems: completedItemIds },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const failChecklistItem: VerificationService['failChecklistItem'] = (actor, caseId, itemId, note) => {
    const vcase = ports.verificationCases.read(caseId);
    if (!vcase) return fail('AGGREGATE_NOT_FOUND', `Verification case ${caseId} not found.`);
    if (!caseBelongsToActor(vcase, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Case belongs to different society.');

    if (!isReviewable(vcase.state)) return fail('ILLEGAL_TRANSITION', 'Case is not in a reviewable state.');

    const updatedChecklist = applyChecklistFailure(vcase.checklist, itemId, actor.userId, now(), note);
    const updated = advanceCase(vcase, vcase.state, { checklist: updatedChecklist });

    const saved = persistCase(updated);
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${caseId}-fail-${itemId}`,
      timestamp: now(),
      correlationId: vcase.trace.correlationId,
      actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
      action: 'UPDATE',
      entityType: 'VERIFICATION_CASE',
      entityId: caseId,
      previousState: { itemId, state: 'PENDING' },
      newState: { itemId, state: 'FAILED', note },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const decide: VerificationService['decide'] = (actor, caseId, decision, reason) => {
    const vcase = ports.verificationCases.read(caseId);
    if (!vcase) return fail('AGGREGATE_NOT_FOUND', `Verification case ${caseId} not found.`);
    if (!caseBelongsToActor(vcase, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Case belongs to different society.');

    if (!isReviewable(vcase.state)) return fail('ILLEGAL_TRANSITION', 'Case is not in a reviewable state.');

    const permission = evaluateActionPermission(actor, 'REVIEW_VERIFICATION');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to decide verification case.');

    if (requiresReason(decision) && (!reason || reason.trim().length === 0)) {
      return fail('VERIFICATION_REASON_REQUIRED', 'A reason is required for this decision.');
    }

    const block = approvalBlocked(vcase.checklist, decision);
    if (block) return fail(block.code, block.detail ?? 'Approval blocked.');

    const targetState = decisionTargetState(decision);
    const transition = canTransitionVerification(vcase.state, targetState);
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Illegal transition.');

    const updatedChecklist = vcase.checklist;
    const decisions = appendDecision(vcase, decision, actor.userId, now(), reason, updatedChecklist);
    const resubmission = decision === 'REQUEST_RESUBMISSION'
      ? { requestedAt: now(), deadline, attempt: (vcase.resubmission?.attempt ?? 0) + 1, exhausted: false }
      : vcase.resubmission;

    const updated = advanceCase(vcase, targetState, {
      checklist: updatedChecklist,
      decisions,
      resubmission,
      decidedBy: actor.userId,
      decidedAt: now(),
      decision,
      decisionReason: reason,
    });

    const saved = persistCase(updated);
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${caseId}-decision`,
      timestamp: now(),
      correlationId: vcase.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: decision === 'APPROVE' ? 'APPROVE' : decision === 'REJECT' ? 'REJECT' : 'REQUEST_RESUBMISSION',
      entityType: 'VERIFICATION_CASE',
      entityId: caseId,
      previousState: { state: vcase.state },
      newState: { state: targetState, decision, reason },
      metadata: { source: 'MOBILE', checklistSnapshot: updatedChecklist },
      outcome: 'SUCCESS',
    });

    ports.notifications.notifyVerificationDecided({
      documentId: vcase.documentId,
      societyId: actor.societyId,
      decidedBy: actor.userId,
      decision: targetState,
    });

    return saved;
  };

  const requestResubmission: VerificationService['requestResubmission'] = (actor, caseId, deadline) => {
    const vcase = ports.verificationCases.read(caseId);
    if (!vcase) return fail('AGGREGATE_NOT_FOUND', `Verification case ${caseId} not found.`);
    if (!caseBelongsToActor(vcase, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Case belongs to different society.');

    if (vcase.state !== 'REJECTED' && vcase.state !== 'RESUBMISSION_REQUIRED') {
      return fail('ILLEGAL_TRANSITION', 'Case must be in REJECTED or RESUBMISSION_REQUIRED state for resubmission.');
    }

    const transition = canTransitionVerification(vcase.state, 'OPEN');
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Illegal transition.');

    const resubmission = {
      requestedAt: now(),
      deadline,
      attempt: (vcase.resubmission?.attempt ?? 0) + 1,
      exhausted: false,
    };

    const updated = advanceCase(vcase, 'OPEN', { resubmission, assignedReviewerId: undefined, decisions: [...vcase.decisions] });

    const saved = persistCase(updated);
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${caseId}-resubmit`,
      timestamp: now(),
      correlationId: vcase.trace.correlationId,
      actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
      action: 'RESUBMIT',
      entityType: 'VERIFICATION_CASE',
      entityId: caseId,
      previousState: { state: vcase.state },
      newState: { state: 'OPEN', resubmission },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const expireResubmission: VerificationService['expireResubmission'] = (actor, caseId) => {
    const vcase = ports.verificationCases.read(caseId);
    if (!vcase) return fail('AGGREGATE_NOT_FOUND', `Verification case ${caseId} not found.`);
    if (!caseBelongsToActor(vcase, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Case belongs to different society.');

    if (vcase.state !== 'RESUBMISSION_REQUIRED' || !vcase.resubmission) {
      return fail('ILLEGAL_TRANSITION', 'No active resubmission to expire.');
    }

    if (!isResubmissionExpired(vcase, ports.clock)) {
      return fail('PRECONDITION_FAILED', 'Resubmission window has not expired yet.');
    }

    const transition = canTransitionVerification(vcase.state, 'EXPIRED');
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Illegal transition.');

    const updated = advanceCase(vcase, 'EXPIRED', { resubmission: { ...vcase.resubmission, exhausted: true } });

    const saved = persistCase(updated);
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${caseId}-expire`,
      timestamp: now(),
      correlationId: vcase.trace.correlationId,
      actor: { userId: actor.userId, type: 'SYSTEM', role: actor.role, societyId: actor.societyId },
      action: 'EXPIRE',
      entityType: 'VERIFICATION_CASE',
      entityId: caseId,
      previousState: { state: vcase.state },
      newState: { state: 'EXPIRED' },
      metadata: { source: 'SYSTEM_JOB' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const closeCase: VerificationService['closeCase'] = (actor, caseId) => {
    const vcase = ports.verificationCases.read(caseId);
    if (!vcase) return fail('AGGREGATE_NOT_FOUND', `Verification case ${caseId} not found.`);
    if (!caseBelongsToActor(vcase, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Case belongs to different society.');

    if (!isCaseClosed(vcase.state)) {
      const transition = canTransitionVerification(vcase.state, 'CLOSED');
      if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Illegal transition.');

      const updated = advanceCase(vcase, 'CLOSED');

      const saved = persistCase(updated);
      if (!saved.ok) return saved;

      ports.audit.emit({
        id: `aud-${caseId}-close`,
        timestamp: now(),
        correlationId: vcase.trace.correlationId,
        actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
        action: 'CLOSE',
        entityType: 'VERIFICATION_CASE',
        entityId: caseId,
        previousState: { state: vcase.state },
        newState: { state: 'CLOSED' },
        metadata: { source: 'MOBILE' },
        outcome: 'SUCCESS',
      });

      return saved;
    }

    return { ok: true, value: vcase, warnings: ['ALREADY_CLOSED'] };
  };

  const revokeCase: VerificationService['revokeCase'] = (actor, caseId, reason) => {
    const vcase = ports.verificationCases.read(caseId);
    if (!vcase) return fail('AGGREGATE_NOT_FOUND', `Verification case ${caseId} not found.`);
    if (!caseBelongsToActor(vcase, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Case belongs to different society.');

    if (vcase.state === 'CLOSED' || vcase.state === 'REVOKED') {
      return fail('TERMINAL_STATE', 'Case is already in a terminal state.');
    }

    const transition = canTransitionVerification(vcase.state, 'REVOKED');
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Illegal transition.');

    const updated = advanceCase(vcase, 'REVOKED', { decisionReason: reason, decidedBy: actor.userId, decidedAt: now() });

    const saved = persistCase(updated);
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${caseId}-revoke`,
      timestamp: now(),
      correlationId: vcase.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'REVOKE',
      entityType: 'VERIFICATION_CASE',
      entityId: caseId,
      previousState: { state: vcase.state },
      newState: { state: 'REVOKED', reason },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const requestSignature: VerificationService['requestSignature'] = (actor, caseId, method, expectedSigners) => {
    const vcase = ports.verificationCases.read(caseId);
    if (!vcase) return fail('AGGREGATE_NOT_FOUND', `Verification case ${caseId} not found.`);
    if (!caseBelongsToActor(vcase, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Case belongs to different society.');

    if (vcase.state !== 'APPROVED') return fail('ILLEGAL_TRANSITION', 'Case must be APPROVED before signature.');

    const permission = evaluateActionPermission(actor, 'SIGN');
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'Not authorized to request signature.');

    const envelopeId = `sig-${caseId}-${Date.now()}`;
    const envelope: SignatureEnvelope = {
      id: envelopeId,
      scope: vcase.scope,
      documentId: vcase.documentId,
      versionId: vcase.versionId,
      verificationCaseId: caseId,
      method,
      state: 'PENDING',
      provider: 'READY',
      payloadDigest: vcase.checklist.items.map((i) => i.id).join('|'),
      digestAlgorithm: 'SHA-256',
      signers: [],
      failureDetail: undefined,
      createdAt: now(),
      sealedAt: undefined,
      revision: { revision: 1, revisionToken: `rev-${envelopeId}-1` },
      trace: vcase.trace,
    };

    if (!ports.signatureEnvelopes.insert(envelope)) return fail('CONCURRENT_WRITE', 'Envelope already exists.');

    const updatedCase = advanceCase(vcase, vcase.state, { signatureEnvelopeId: envelopeId });
    if (!ports.verificationCases.update(updatedCase)) return fail('CONCURRENT_WRITE', 'Failed to link envelope to case.');

    ports.audit.emit({
      id: `aud-${envelopeId}-request`,
      timestamp: now(),
      correlationId: vcase.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'SIGN',
      entityType: 'SIGNATURE_ENVELOPE',
      entityId: envelopeId,
      previousState: undefined,
      newState: { state: 'PENDING', method, expectedSigners: expectedSigners.length },
      metadata: { source: 'MOBILE', verificationCaseId: caseId },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: envelope, warnings: [] };
  };

  const addSignature: VerificationService['addSignature'] = (actor, envelopeId, signerId, signerRole, providerReference, certificateThumbprint) => {
    const envelope = ports.signatureEnvelopes.read(envelopeId);
    if (!envelope) return fail('AGGREGATE_NOT_FOUND', `Signature envelope ${envelopeId} not found.`);
    if (!envelopeBelongsToActor(envelope, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Envelope belongs to different society.');

    if (envelope.state === 'SIGNED' || envelope.state === 'REVOKED') {
      return fail('TERMINAL_STATE', 'Envelope is in a terminal state.');
    }

    if (hasSigner(envelope, signerId)) {
      return fail('SIGNATURE_ALREADY_EXISTS', 'Signer has already signed this envelope.');
    }

    const nextState = nextSignatureState(envelope.state, envelope.signers.length + 1, expectedSigners.length);
    const transition = canTransitionSignature(envelope.state, nextState);
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Illegal transition.');

    const signer = buildSigner(signerId, signerRole, envelope.method, envelope.payloadDigest, envelope.digestAlgorithm, now(), providerReference, certificateThumbprint);
    const updated = advanceEnvelope(envelope, nextState, { signers: [...envelope.signers, signer] });

    const saved = persistEnvelope(updated);
    if (!saved.ok) return saved;

    ports.audit.emit({
      id: `aud-${envelopeId}-sign-${signerId}`,
      timestamp: now(),
      correlationId: envelope.trace.correlationId,
      actor: { userId: signerId, type: 'ADMIN', role: signerRole, societyId: actor.societyId },
      action: 'SIGN',
      entityType: 'SIGNATURE_ENVELOPE',
      entityId: envelopeId,
      previousState: { state: envelope.state, signers: envelope.signers.length },
      newState: { state: nextState, signers: updated.signers.length },
      metadata: { source: 'MOBILE', providerReference, certificateThumbprint },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const sealSignature: VerificationService['sealSignature'] = (actor, envelopeId, expectedSigners) => {
    const envelope = ports.signatureEnvelopes.read(envelopeId);
    if (!envelope) return fail('AGGREGATE_NOT_FOUND', `Signature envelope ${envelopeId} not found.`);
    if (!envelopeBelongsToActor(envelope, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Envelope belongs to different society.');

    if (envelope.state === 'SIGNED' || envelope.state === 'REVOKED') {
      return fail('TERMINAL_STATE', 'Envelope is in a terminal state.');
    }

    const gate = canSealSignature(envelope, expectedSigners);
    if (gate) return fail(gate.code, gate.detail ?? 'Cannot seal signature.');

    const transition = canTransitionSignature(envelope.state, 'SIGNED');
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Illegal transition.');

    const updated = advanceEnvelope(envelope, 'SIGNED', { sealedAt: now() });

    const saved = persistEnvelope(updated);
    if (!saved.ok) return saved;

    const vcase = ports.verificationCases.read(envelope.verificationCaseId);
    if (vcase) {
      const updatedCase = advanceCase(vcase, 'SIGNED', { signatureEnvelopeId: envelopeId });
      ports.verificationCases.update(updatedCase);
    }

    ports.audit.emit({
      id: `aud-${envelopeId}-seal`,
      timestamp: now(),
      correlationId: envelope.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'SEAL_SIGNATURE',
      entityType: 'SIGNATURE_ENVELOPE',
      entityId: envelopeId,
      previousState: { state: envelope.state },
      newState: { state: 'SIGNED', signers: envelope.signers.length },
      metadata: { source: 'MOBILE', verificationCaseId: envelope.verificationCaseId },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const failSignature: VerificationService['failSignature'] = (actor, envelopeId, detail) => {
    const envelope = ports.signatureEnvelopes.read(envelopeId);
    if (!envelope) return fail('AGGREGATE_NOT_FOUND', `Signature envelope ${envelopeId} not found.`);
    if (!envelopeBelongsToActor(envelope, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Envelope belongs to different society.');

    if (envelope.state === 'SIGNED' || envelope.state === 'REVOKED') {
      return fail('TERMINAL_STATE', 'Envelope is in a terminal state.');
    }

    const transition = canTransitionSignature(envelope.state, 'FAILED');
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Illegal transition.');

    const updated = advanceEnvelope(envelope, 'FAILED', { failureDetail: detail });

    const saved = persistEnvelope(updated);
    if (!saved.ok) return saved;

    const vcase = ports.verificationCases.read(envelope.verificationCaseId);
    if (vcase) {
      const updatedCase = advanceCase(vcase, vcase.state, { signatureEnvelopeId: envelopeId });
      ports.verificationCases.update(updatedCase);
    }

    ports.audit.emit({
      id: `aud-${envelopeId}-fail`,
      timestamp: now(),
      correlationId: envelope.trace.correlationId,
      actor: { userId: actor.userId, type: 'SYSTEM', role: actor.role, societyId: actor.societyId },
      action: 'FAIL_SIGNATURE',
      entityType: 'SIGNATURE_ENVELOPE',
      entityId: envelopeId,
      previousState: { state: envelope.state },
      newState: { state: 'FAILED', detail },
      metadata: { source: 'SYSTEM_JOB' },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const revokeSignature: VerificationService['revokeSignature'] = (actor, envelopeId, reason) => {
    const envelope = ports.signatureEnvelopes.read(envelopeId);
    if (!envelope) return fail('AGGREGATE_NOT_FOUND', `Signature envelope ${envelopeId} not found.`);
    if (!envelopeBelongsToActor(envelope, actor)) return fail('ACTOR_NOT_AUTHORIZED', 'Envelope belongs to different society.');

    if (envelope.state === 'REVOKED') {
      return fail('TERMINAL_STATE', 'Envelope is already revoked.');
    }

    const transition = canTransitionSignature(envelope.state, 'REVOKED');
    if (!transition.allowed) return fail('ILLEGAL_TRANSITION', transition.violation?.detail ?? 'Illegal transition.');

    const updated = advanceEnvelope(envelope, 'REVOKED', { failureDetail: reason });

    const saved = persistEnvelope(updated);
    if (!saved.ok) return saved;

    const vcase = ports.verificationCases.read(envelope.verificationCaseId);
    if (vcase && vcase.state === 'SIGNED') {
      const updatedCase = advanceCase(vcase, 'REVOKED', { decisionReason: reason, decidedBy: actor.userId, decidedAt: now() });
      ports.verificationCases.update(updatedCase);
    }

    ports.audit.emit({
      id: `aud-${envelopeId}-revoke`,
      timestamp: now(),
      correlationId: envelope.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'REVOKE_SIGNATURE',
      entityType: 'SIGNATURE_ENVELOPE',
      entityId: envelopeId,
      previousState: { state: envelope.state },
      newState: { state: 'REVOKED', reason },
      metadata: { source: 'MOBILE', verificationCaseId: envelope.verificationCaseId },
      outcome: 'SUCCESS',
    });

    return saved;
  };

  const getCase = (caseId: string): VerificationCase | Absent => ports.verificationCases.read(caseId);

  const getCasesByDocument = (documentId: string): readonly VerificationCase[] => ports.verificationCases.listByDocument(documentId);

  const getCasesBySociety = (societyId: string): readonly VerificationCase[] => ports.verificationCases.listBySociety(societyId);

  const getEnvelope = (envelopeId: string): SignatureEnvelope | Absent => ports.signatureEnvelopes.read(envelopeId);

  const getEnvelopeByDocument = (documentId: string): SignatureEnvelope | Absent => ports.signatureEnvelopes.readByDocument(documentId);

  return {
    createCase,
    submitChecklist,
    failChecklistItem,
    decide,
    requestResubmission,
    expireResubmission,
    closeCase,
    revokeCase,
    requestSignature,
    addSignature,
    sealSignature,
    failSignature,
    revokeSignature,
    getCase,
    getCasesByDocument,
    getCasesBySociety,
    getEnvelope,
    getEnvelopeByDocument,
  };
}