import type { Absent } from '../../../../../shared/types/absence.types';
import type { VaultClock, VaultActor, DocumentVaultErrorCode } from '../domain/types/primitives';
import { violation, denied, allowedWith } from '../domain/types/primitives';
import type { DocumentRecord, DocumentVersionRecord } from '../domain/types/document.types';
import type { AccessLogEntry, AccessOutcome, RetrievalTicket, AccessGrant, AccessRequest, DocumentAction } from '../domain/types/access.types';
import type { AccessLogSink, RetrievalTicketStore, AuditSink, VaultPorts, DocumentPolicySet } from './ports';
import { evaluateAccess, evaluateTtl, assertTicketUsable, isAccessRequestOpen, outcomeForDecision } from '../domain/guards/authorizationGuard';

export interface AccessService {
  requestAccess(
    actor: VaultActor,
    document: DocumentRecord,
    version: DocumentVersionRecord,
    action: DocumentAction,
    reason: string | Absent,
    policy: DocumentPolicySet,
  ): { ok: true; value: AccessRequest; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  decideAccessRequest(
    actor: VaultActor,
    requestId: string,
    approved: boolean,
    decisionReason: string,
    expiresAt: string | Absent,
    policy: DocumentPolicySet,
  ): { ok: true; value: AccessRequest; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  issueRetrievalTicket(
    actor: VaultActor,
    document: DocumentRecord,
    version: DocumentVersionRecord,
    action: DocumentAction,
    ttlSeconds: number,
    policy: DocumentPolicySet,
    traceContext: { correlationId: string; causationId?: string },
  ): { ok: true; value: RetrievalTicket; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  consumeRetrievalTicket(
    actor: VaultActor,
    ticketId: string,
    action: DocumentAction,
  ): { ok: true; value: RetrievalTicket; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  revokeRetrievalTicket(
    actor: VaultActor,
    ticketId: string,
  ): { ok: true; value: RetrievalTicket; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  grantAccess(
    actor: VaultActor,
    document: DocumentRecord,
    granteeUserId: string,
    granteeRole: string,
    actions: readonly DocumentAction[],
    expiresAt: string | Absent,
    reason: string,
  ): { ok: true; value: AccessGrant; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  revokeAccessGrant(
    actor: VaultActor,
    grantId: string,
  ): { ok: true; value: AccessGrant; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  logAccess(
    actor: VaultActor,
    document: DocumentRecord,
    versionId: string | Absent,
    action: DocumentAction,
    outcome: AccessOutcome,
    reasonCode: string,
    correlationId: string,
    sessionId: string,
    deviceClass: string,
    redactedActor: boolean,
  ): { ok: true; value: AccessLogEntry; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };

  getAccessLogs(documentId: string): readonly AccessLogEntry[];
  getRetrievalTicket(ticketId: string): RetrievalTicket | Absent;
  getActiveAccessRequests(documentId: string): readonly AccessRequest[];
  getAccessGrants(documentId: string): readonly AccessGrant[];
}

function fail(code: DocumentVaultErrorCode, message: string) {
  return { ok: false, code, message };
}

const accessRequests = new Map<string, AccessRequest>();
const accessGrants = new Map<string, AccessGrant>();

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function createAccessService(ports: Pick<VaultPorts, 'accessLog' | 'retrievalTickets' | 'audit' | 'clock'>): AccessService {
  const now = (): string => ports.clock.now().toISOString();

  const requestAccess: AccessService['requestAccess'] = (actor, document, version, action, reason, policy) => {
    const evaluation = evaluateAccess({
      actor,
      document,
      action,
      policy,
      clock: ports.clock,
      activeUnitId: undefined,
      isFormerOccupant: false,
      reason,
      now: ports.clock.now(),
    });

    if (!evaluation.decision.allowed) {
      return fail(evaluation.decision.violations[0]?.code ?? 'ACTOR_NOT_AUTHORIZED', evaluation.evaluation.reason);
    }

    const requestId = generateId('req');
    const request: AccessRequest = {
      id: requestId,
      scope: document.scope,
      documentId: document.id,
      versionId: version.id,
      requestedBy: actor.userId,
      requestedAt: now(),
      action,
      reason,
      outcome: 'DENIED',
      decisionReason: 'PENDING_APPROVAL',
      decidedAt: now(),
      decidedBy: actor.userId,
      state: 'PENDING',
      expiresAt: undefined,
      revision: { revision: 1, revisionToken: `rev-${requestId}-1` },
      trace: { correlationId: '', causationId: undefined },
    };

    accessRequests.set(requestId, request);

    ports.audit.emit({
      id: `aud-${requestId}`,
      timestamp: now(),
      correlationId: '',
      actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
      action: 'CREATE',
      entityType: 'DOCUMENT_ACCESS_REQUEST',
      entityId: requestId,
      previousState: undefined,
      newState: { action, reason },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: request, warnings: [] as const };
  };

  const decideAccessRequest: AccessService['decideAccessRequest'] = (actor, requestId, approved, decisionReason, expiresAt, policy) => {
    const request = accessRequests.get(requestId);
    if (!request) return fail('AGGREGATE_NOT_FOUND', `Access request ${requestId} not found.`);

    if (!isAccessRequestOpen(request)) return fail('ILLEGAL_TRANSITION', 'Request is not in PENDING state.');

    const updated: AccessRequest = {
      ...request,
      outcome: approved ? 'GRANTED' : 'DENIED',
      decisionReason,
      decidedAt: now(),
      decidedBy: actor.userId,
      state: approved ? 'APPROVED' : 'DENIED',
      expiresAt,
      revision: { revision: request.revision.revision + 1, revisionToken: `rev-${requestId}-${request.revision.revision + 1}` },
    };

    accessRequests.set(requestId, updated);

    ports.audit.emit({
      id: `aud-${requestId}-decide`,
      timestamp: now(),
      correlationId: '',
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'UPDATE',
      entityType: 'DOCUMENT_ACCESS_REQUEST',
      entityId: requestId,
      previousState: { state: request.state },
      newState: { state: updated.state, reason: decisionReason },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: updated, warnings: [] as const };
  };

  const issueRetrievalTicket: AccessService['issueRetrievalTicket'] = (actor, document, version, action, ttlSeconds, policy, traceContext) => {
    const evaluation = evaluateAccess({
      actor,
      document,
      action,
      policy,
      clock: ports.clock,
      activeUnitId: undefined,
      isFormerOccupant: false,
      reason: undefined,
      now: ports.clock.now(),
    });

    if (!evaluation.decision.allowed) {
      return fail(evaluation.decision.violations[0]?.code ?? 'ACTOR_NOT_AUTHORIZED', evaluation.evaluation.reason);
    }

    const ttlCheck = evaluateTtl(ttlSeconds, evaluation.evaluation, policy);
    if (!ttlCheck.allowed) {
      return fail(ttlCheck.violations[0]?.code ?? 'RETRIEVAL_TTL_TOO_LONG', ttlCheck.violations[0]?.detail ?? 'Invalid TTL.');
    }

    const ticketId = generateId('ticket');
    const issuedAt = now();
    const expiresAt = new Date(ports.clock.now().getTime() + ttlSeconds * 1000).toISOString();

    const ticket: RetrievalTicket = {
      id: ticketId,
      scope: document.scope,
      documentId: document.id,
      versionId: version.id,
      issuedToUserId: actor.userId,
      grantedAction: action,
      issuedAt,
      expiresAt,
      singleUse: true,
      consumedAt: undefined,
      revokedAt: undefined,
      streamHandle: `stream-${ticketId}`,
      trace: traceContext,
    };

    if (!ports.retrievalTickets.insert(ticket)) return fail('CONCURRENT_WRITE', 'Ticket already exists.');

    ports.audit.emit({
      id: `aud-${ticketId}`,
      timestamp: now(),
      correlationId: traceContext.correlationId,
      actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
      action: 'CREATE',
      entityType: 'DOCUMENT_RETRIEVAL_TICKET',
      entityId: ticketId,
      previousState: undefined,
      newState: { documentId: document.id, versionId: version.id, action, ttlSeconds },
      metadata: { idempotencyKey: traceContext.correlationId, source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: ticket, warnings: evaluation.decision.warnings };
  };

  const consumeRetrievalTicket: AccessService['consumeRetrievalTicket'] = (actor, ticketId, action) => {
    const ticket = ports.retrievalTickets.read(ticketId);
    if (!ticket) return fail('AGGREGATE_NOT_FOUND', `Retrieval ticket ${ticketId} not found.`);

    const ticketCheck = assertTicketUsable(ticket, actor, action, ports.clock);
    if (!ticketCheck.allowed) {
      return fail(ticketCheck.violations[0]?.code ?? 'RETRIEVAL_TICKET_EXPIRED', ticketCheck.violations[0]?.detail ?? 'Ticket not usable.');
    }

    const updated: RetrievalTicket = {
      ...ticket,
      consumedAt: now(),
    };

    if (!ports.retrievalTickets.update(updated)) return fail('CONCURRENT_WRITE', 'Ticket was modified concurrently.');

    ports.audit.emit({
      id: `aud-${ticketId}-consume`,
      timestamp: now(),
      correlationId: ticket.trace.correlationId,
      actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
      action: 'UPDATE',
      entityType: 'DOCUMENT_RETRIEVAL_TICKET',
      entityId: ticketId,
      previousState: { consumedAt: ticket.consumedAt },
      newState: { consumedAt: now() },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: updated, warnings: [] as const };
  };

  const revokeRetrievalTicket: AccessService['revokeRetrievalTicket'] = (actor, ticketId) => {
    const ticket = ports.retrievalTickets.read(ticketId);
    if (!ticket) return fail('AGGREGATE_NOT_FOUND', `Retrieval ticket ${ticketId} not found.`);

    if (ticket.revokedAt) return { ok: true, value: ticket, warnings: ['ALREADY_REVOKED'] };

    const updated: RetrievalTicket = {
      ...ticket,
      revokedAt: now(),
    };

    if (!ports.retrievalTickets.update(updated)) return fail('CONCURRENT_WRITE', 'Ticket was modified concurrently.');

    ports.audit.emit({
      id: `aud-${ticketId}-revoke`,
      timestamp: now(),
      correlationId: ticket.trace.correlationId,
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'UPDATE',
      entityType: 'DOCUMENT_RETRIEVAL_TICKET',
      entityId: ticketId,
      previousState: { revokedAt: ticket.revokedAt },
      newState: { revokedAt: now() },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: updated, warnings: [] as const };
  };

  const grantAccess: AccessService['grantAccess'] = (actor, document, granteeUserId, granteeRole, actions, expiresAt, reason) => {
    const grantId = generateId('grant');
    const grant: AccessGrant = {
      id: grantId,
      scope: document.scope,
      documentId: document.id,
      granteeUserId,
      granteeRole,
      actions,
      grantedBy: actor.userId,
      grantedAt: now(),
      expiresAt,
      revokedAt: undefined,
      reason,
    };

    accessGrants.set(grantId, grant);

    ports.audit.emit({
      id: `aud-${grantId}`,
      timestamp: now(),
      correlationId: '',
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'CREATE',
      entityType: 'DOCUMENT_ACCESS_GRANT',
      entityId: grantId,
      previousState: undefined,
      newState: { granteeUserId, actions: [...actions], expiresAt },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: grant, warnings: [] };
  };

  const revokeAccessGrant: AccessService['revokeAccessGrant'] = (actor, grantId) => {
    const grant = accessGrants.get(grantId);
    if (!grant) return fail('AGGREGATE_NOT_FOUND', `Access grant ${grantId} not found.`);

    if (grant.revokedAt) return { ok: true, value: grant, warnings: ['ALREADY_REVOKED'] };

    const updated: AccessGrant = { ...grant, revokedAt: now() };
    accessGrants.set(grantId, updated);

    ports.audit.emit({
      id: `aud-${grantId}-revoke`,
      timestamp: now(),
      correlationId: '',
      actor: { userId: actor.userId, type: 'ADMIN', role: actor.role, societyId: actor.societyId },
      action: 'UPDATE',
      entityType: 'DOCUMENT_ACCESS_GRANT',
      entityId: grantId,
      previousState: { revokedAt: grant.revokedAt },
      newState: { revokedAt: now() },
      metadata: { source: 'MOBILE' },
      outcome: 'SUCCESS',
    });

    return { ok: true, value: updated, warnings: [] as const };
  };

  const logAccess: AccessService['logAccess'] = (actor, document, versionId, action, outcome, reasonCode, correlationId, sessionId, deviceClass, redactedActor) => {
    const entry: AccessLogEntry = {
      id: generateId('dal'),
      societyId: actor.societyId,
      documentId: document.id,
      versionId,
      actorUserId: actor.userId,
      actorRole: actor.role,
      action,
      outcome,
      occurredAt: now(),
      reasonCode,
      correlationId,
      sessionId,
      deviceClass,
      redactedActor,
    };

    ports.accessLog.append(entry);

    ports.audit.emit({
      id: `aud-${entry.id}`,
      timestamp: now(),
      correlationId,
      actor: { userId: actor.userId, type: 'RESIDENT', role: actor.role, societyId: actor.societyId },
      action: 'CREATE',
      entityType: 'DOCUMENT',
      entityId: document.id,
      previousState: undefined,
      newState: { action, outcome, versionId },
      metadata: { sessionId, deviceClass },
      outcome: outcome === 'GRANTED' ? 'SUCCESS' : 'FAILURE',
    });

    return { ok: true, value: entry, warnings: [] };
  };

  const getAccessLogs = (documentId: string): readonly AccessLogEntry[] => ports.accessLog.listByDocument(documentId);

  const getRetrievalTicket = (ticketId: string): RetrievalTicket | Absent => ports.retrievalTickets.read(ticketId);

  const getActiveAccessRequests = (documentId: string): readonly AccessRequest[] => {
    return Array.from(accessRequests.values())
      .filter((r) => r.documentId === documentId && isAccessRequestOpen(r));
  };

  const getAccessGrants = (documentId: string): readonly AccessGrant[] => {
    return Array.from(accessGrants.values())
      .filter((g) => g.documentId === documentId && !g.revokedAt);
  };

  return {
    requestAccess,
    decideAccessRequest,
    issueRetrievalTicket,
    consumeRetrievalTicket,
    revokeRetrievalTicket,
    grantAccess,
    revokeAccessGrant,
    logAccess,
    getAccessLogs,
    getRetrievalTicket,
    getActiveAccessRequests,
    getAccessGrants,
  };
}