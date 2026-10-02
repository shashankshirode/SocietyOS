import type { Absent } from '../../../shared/types/absence.types';
import type { AuditActorType } from '../../../core/audit/audit.types';
import type {
  CommunicationActor,
  DeniedDecision,
  DeniedTransition,
  CommunicationErrorCode,
  CommunicationOutcome,
  CommunicationScope,
  MessageRecord,
  ModerationAccessGrant,
  ModerationActionType,
  ModerationAuditEntry,
  ModerationCase,
  ModerationEvidence,
  ReportCategory,
  TraceContext,
} from '../domain/types';
import { deniedOutcome, deniedOutcomeFromViolation, nextRevision } from '../domain/types';
import {
  canTransitionModeration,
  requiresActionReason,
} from '../domain/stateMachines/moderationStateMachine';
import {
  evaluateActionPermission,
  evaluateModerationAccess,
  evaluateModerationTarget,
  evaluateSessionFreshness,
  evaluateTenantBoundary,
  isModeratorRole,
} from '../domain/guards/authorizationGuard';

import type { CommunicationPorts } from './ports';

const MAXIMUM_SESSION_AGE_MS = 60 * 60 * 1000;
const MODERATION_GRANT_TTL_MS = 4 * 60 * 60 * 1000;
const DEFAULT_MODERATION_RETENTION_DAYS = 365;
const MINIMUM_REPORTER_STATEMENT_LENGTH = 10;

export type ReportContentCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly targetType: ModerationCase['targetType'];
  readonly targetId: string;
  readonly channelId: string | Absent;
  readonly messageId: string | Absent;
  readonly category: ReportCategory;
  readonly description: string;
  readonly idempotencyKey: string;
  readonly trace: TraceContext;
};

export type GrantModerationAccessCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly caseId: string;
  readonly moderatorUserId: string;
  readonly purpose: string;
  readonly ttlMs: number;
  readonly trace: TraceContext;
};

export type ViewReportedMessageCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly caseId: string;
  readonly messageId: string;
  readonly purpose: string;
  readonly trace: TraceContext;
};

export type ApplyModerationActionCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly caseId: string;
  readonly action: ModerationActionType;
  readonly reason: string | Absent;
  readonly purpose: string;
  readonly idempotencyKey: string;
  readonly trace: TraceContext;
};

export type StartModerationReviewCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly caseId: string;
  readonly purpose: string;
  readonly idempotencyKey: string;
  readonly trace: TraceContext;
};

export type ModerationService = {
  readonly report: (command: ReportContentCommand) => Promise<CommunicationOutcome<ModerationCase>>;
  readonly grantAccess: (
    command: GrantModerationAccessCommand,
  ) => Promise<CommunicationOutcome<ModerationAccessGrant>>;
  readonly viewReportedMessage: (
    command: ViewReportedMessageCommand,
  ) => Promise<CommunicationOutcome<MessageRecord>>;
  readonly startReview: (
    command: StartModerationReviewCommand,
  ) => Promise<CommunicationOutcome<ModerationCase>>;
  readonly applyAction: (
    command: ApplyModerationActionCommand,
  ) => Promise<CommunicationOutcome<ModerationCase>>;
  readonly listCases: (societyId: string) => readonly ModerationCase[];
  readonly listAudit: (caseId: string) => readonly ModerationAuditEntry[];
};

function deny(code: CommunicationErrorCode, message: string): CommunicationOutcome<never> {
  return { ok: false, code, message };
}

function denyDecision(decision: DeniedDecision): CommunicationOutcome<never> {
  return deniedOutcome(decision);
}

function denyTransition(transition: DeniedTransition): CommunicationOutcome<never> {
  return deniedOutcomeFromViolation(transition.violation);
}

export function createModerationService(ports: CommunicationPorts): ModerationService {
  const {
    clock,
    moderationCases,
    moderationEvidence,
    moderationAccessGrants,
    moderationAudit,
    messages,
    channels,
    channelMemberships,
    audit,
    idempotency,
  } = ports;

  function auditActorType(actor: CommunicationActor): AuditActorType {
    if (actor.actorType.startsWith('RESIDENT')) {
      return 'RESIDENT';
    }
    if (actor.actorType === 'SYSTEM') {
      return 'SYSTEM';
    }
    return 'ADMIN';
  }

  function recordModerationAccess(
    moderationCase: ModerationCase,
    actor: CommunicationActor,
    purpose: string,
    correlationId: string,
  ): void {
    moderationAudit.append({
      id: `moderation-audit-${moderationCase.id}-${correlationId}`,
      societyId: moderationCase.societyId,
      caseId: moderationCase.id,
      actorUserId: actor.userId,
      actorRole: actor.role,
      purpose,
      correlationId,
      occurredAtIso: clock.now().toISOString(),
      metadata: {
        targetId: moderationCase.targetId,
        category: moderationCase.category,
        status: moderationCase.status,
      },
    });
  }

  function emitAudit(
    actor: CommunicationActor,
    action: 'CREATE' | 'ESCALATE' | 'READ' | 'OVERRIDE' | 'UPDATE',
    entityId: string,
    correlationId: string,
  ): void {
    audit.emit({
      id: `audit-moderation-${entityId}-${action}-${correlationId}`,
      timestamp: clock.now().toISOString(),
      correlationId,
      actor: {
        userId: actor.userId,
        type: auditActorType(actor),
        role: actor.role,
        societyId: actor.societyId,
      },
      action,
      entityType: 'CHAT_REPORT',
      entityId,
      metadata: { source: 'MOBILE', correlationId },
      outcome: 'SUCCESS',
    });
  }

  async function report(
    command: ReportContentCommand,
  ): Promise<CommunicationOutcome<ModerationCase>> {
    if (command.actor.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'scope.societyId');
    }
    const permission = evaluateActionPermission(command.actor.role, 'REPORT_CONTENT');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    if (command.description.trim().length < MINIMUM_REPORTER_STATEMENT_LENGTH) {
      return deny('VALIDATION_FAILED', 'description');
    }
    if (command.idempotencyKey.trim().length === 0) {
      return deny('IDEMPOTENCY_KEY_REQUIRED', 'idempotencyKey');
    }
    const existing = moderationCases.findByIdempotencyKey(
      command.societyId,
      command.idempotencyKey,
    );
    if (existing !== undefined) {
      if (existing.reportedByUserId !== command.actor.userId) {
        return deny('IDEMPOTENCY_KEY_CONFLICT', 'idempotencyKey');
      }
      return { ok: true, value: existing, warnings: ['REPLAYED_REPORT'] };
    }
    const fingerprint = `${command.actor.userId}:${command.targetId}:${command.category}`;
    if (!idempotency.claim(command.societyId, command.idempotencyKey, fingerprint)) {
      return deny('IDEMPOTENCY_KEY_CONFLICT', 'idempotencyKey');
    }

    const nowIso = clock.now().toISOString();
    const evidenceId = `evidence-${command.idempotencyKey}`;
    const moderationCase: ModerationCase = {
      id: `moderation-case-${command.idempotencyKey}`,
      scope: {
        societyId: command.societyId,
        owningEntityType: 'MODERATION_CASE',
        owningEntityId: command.targetId,
      },
      societyId: command.societyId,
      targetType: command.targetType,
      targetId: command.targetId,
      channelId: command.channelId,
      category: command.category,
      status: 'SUBMITTED',
      description: command.description.trim(),
      reportedByUserId: command.actor.userId,
      reportedAtIso: nowIso,
      assignedModeratorUserId: undefined,
      actionTaken: 'NONE',
      actionReason: undefined,
      actionTakenByUserId: undefined,
      actionTakenAtIso: undefined,
      escalatedAtIso: undefined,
      evidenceIds: [evidenceId],
      retentionDays: DEFAULT_MODERATION_RETENTION_DAYS,
      revision: { revision: 1, revisionToken: 'rev-1' },
    };
    if (!moderationCases.insert(moderationCase)) {
      idempotency.release(command.societyId, command.idempotencyKey);
      return deny('CONCURRENT_WRITE', 'moderationCase');
    }
    idempotency.bindAggregate(command.societyId, command.idempotencyKey, moderationCase.id);
    const evidence: ModerationEvidence = {
      evidenceId,
      caseId: moderationCase.id,
      targetType: command.targetType,
      targetId: command.targetId,
      reportedByUserId: command.actor.userId,
      reportedAtIso: nowIso,
      channelId: command.channelId,
      messageId: command.messageId,
      reporterStatement: command.description.trim(),
      evidenceConsentGranted: false,
      capturedAtIso: nowIso,
    };
    moderationEvidence.insert(evidence);
    emitAudit(command.actor, 'CREATE', moderationCase.id, command.trace.correlationId);
    return { ok: true, value: moderationCase, warnings: [] };
  }

  async function grantAccess(
    command: GrantModerationAccessCommand,
  ): Promise<CommunicationOutcome<ModerationAccessGrant>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    if (!isModeratorRole(command.actor.role)) {
      return deny('MODERATION_SCOPE_BLOCKED', 'actor.role');
    }
    if (command.purpose.trim().length === 0) {
      return deny('MODERATION_SCOPE_BLOCKED', 'purpose');
    }
    const moderationCase = moderationCases.read(command.caseId);
    if (moderationCase === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'moderationCase');
    }
    if (moderationCase.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'moderationCase.societyId');
    }
    const ttl = Math.min(command.ttlMs, MODERATION_GRANT_TTL_MS);
    const grant: ModerationAccessGrant = {
      id: `grant-${command.caseId}-${command.moderatorUserId}`,
      societyId: command.societyId,
      moderatorUserId: command.moderatorUserId,
      caseId: command.caseId,
      purpose: command.purpose.trim(),
      grantedByUserId: command.actor.userId,
      grantedAtIso: clock.now().toISOString(),
      expiresAtIso: new Date(clock.now().getTime() + ttl).toISOString(),
      revokedAtIso: undefined,
    };
    if (!moderationAccessGrants.insert(grant)) {
      return deny('MODERATION_SCOPE_BLOCKED', 'moderationAccessGrant');
    }
    emitAudit(command.actor, 'OVERRIDE', command.caseId, command.trace.correlationId);
    return { ok: true, value: grant, warnings: [] };
  }

  function loadGrant(
    moderationCase: ModerationCase,
    actorUserId: string,
  ): ModerationAccessGrant | Absent {
    return moderationAccessGrants.findActiveForCase(moderationCase.id, actorUserId);
  }

  async function viewReportedMessage(
    command: ViewReportedMessageCommand,
  ): Promise<CommunicationOutcome<MessageRecord>> {
    if (command.actor.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'scope.societyId');
    }
    const session = evaluateSessionFreshness(
      command.actor.authenticatedAt,
      clock,
      MAXIMUM_SESSION_AGE_MS,
    );
    if (!session.allowed) {
      return denyDecision(session);
    }
    const permission = evaluateActionPermission(
      command.actor.role,
      'VIEW_REPORTED_MESSAGE',
    );
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const moderationCase = moderationCases.read(command.caseId);
    if (moderationCase === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'moderationCase');
    }
    if (moderationCase.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'moderationCase.societyId');
    }
    const grant = loadGrant(moderationCase, command.actor.userId);
    const access = evaluateModerationAccess(
      command.actor.userId,
      command.actor.role,
      moderationCase,
      grant,
      clock.now().getTime(),
      command.purpose,
    );
    if (!access.allowed) {
      return denyDecision(access);
    }
    const reported = messages.read(command.messageId);
    const target = evaluateModerationTarget(
      moderationCase,
      moderationCase.channelId,
      reported,
    );
    if (!target.allowed) {
      return denyDecision(target);
    }
    if (reported === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'message');
    }
    if (reported.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'message.societyId');
    }
    if (reported.channelId !== moderationCase.channelId) {
      return deny('IDOR_BLOCKED', 'message.channelId');
    }
    recordModerationAccess(
      moderationCase,
      command.actor,
      command.purpose,
      command.trace.correlationId,
    );
    emitAudit(command.actor, 'READ', moderationCase.id, command.trace.correlationId);
    return { ok: true, value: reported, warnings: [] };
  }

  async function startReview(
    command: StartModerationReviewCommand,
  ): Promise<CommunicationOutcome<ModerationCase>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const permission = evaluateActionPermission(command.actor.role, 'MODERATE_REPORT');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const moderationCase = moderationCases.read(command.caseId);
    if (moderationCase === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'moderationCase');
    }
    if (moderationCase.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'moderationCase.societyId');
    }
    const grant = loadGrant(moderationCase, command.actor.userId);
    const access = evaluateModerationAccess(
      command.actor.userId,
      command.actor.role,
      moderationCase,
      grant,
      clock.now().getTime(),
      command.purpose,
    );
    if (!access.allowed) {
      return denyDecision(access);
    }
    const transition = canTransitionModeration(moderationCase.status, 'UNDER_REVIEW');
    if (!transition.allowed) {
      return denyTransition(transition);
    }
    const updated: ModerationCase = {
      ...moderationCase,
      status: 'UNDER_REVIEW',
      assignedModeratorUserId: command.actor.userId,
      revision: nextRevision(moderationCase.revision),
    };
    if (!moderationCases.update(updated, moderationCase.revision.revision)) {
      return deny('CONCURRENT_WRITE', 'moderationCase');
    }
    recordModerationAccess(
      updated,
      command.actor,
      command.purpose,
      command.trace.correlationId,
    );
    emitAudit(command.actor, 'UPDATE', moderationCase.id, command.trace.correlationId);
    return { ok: true, value: updated, warnings: [] };
  }

  async function applyAction(
    command: ApplyModerationActionCommand,
  ): Promise<CommunicationOutcome<ModerationCase>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const permission = evaluateActionPermission(command.actor.role, 'MODERATE_REPORT');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const moderationCase = moderationCases.read(command.caseId);
    if (moderationCase === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'moderationCase');
    }
    if (moderationCase.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'moderationCase.societyId');
    }
    const grant = loadGrant(moderationCase, command.actor.userId);
    const access = evaluateModerationAccess(
      command.actor.userId,
      command.actor.role,
      moderationCase,
      grant,
      clock.now().getTime(),
      command.purpose,
    );
    if (!access.allowed) {
      return denyDecision(access);
    }
    if (requiresActionReason(command.action) && (command.reason === undefined || command.reason.trim().length === 0)) {
      return deny('MODERATION_ACTION_NOT_ALLOWED', 'reason');
    }

    const nextStatus = resolveNextStatus(moderationCase.status, command.action);
    const transition = canTransitionModeration(moderationCase.status, nextStatus);
    if (!transition.allowed) {
      return denyTransition(transition);
    }

    const nowIso = clock.now().toISOString();
    const updated: ModerationCase = {
      ...moderationCase,
      status: nextStatus,
      assignedModeratorUserId: command.actor.userId,
      actionTaken: command.action,
      actionReason: command.reason,
      actionTakenByUserId: command.actor.userId,
      actionTakenAtIso: nowIso,
      escalatedAtIso:
        command.action === 'ESCALATE_TO_COMMITTEE' ? nowIso : moderationCase.escalatedAtIso,
      revision: nextRevision(moderationCase.revision),
    };
    if (!moderationCases.update(updated, moderationCase.revision.revision)) {
      return deny('CONCURRENT_WRITE', 'moderationCase');
    }
    applyEnforcement(command, moderationCase, nowIso);
    recordModerationAccess(
      updated,
      command.actor,
      command.purpose,
      command.trace.correlationId,
    );
    emitAudit(
      command.actor,
      command.action === 'ESCALATE_TO_COMMITTEE' ? 'ESCALATE' : 'UPDATE',
      moderationCase.id,
      command.trace.correlationId,
    );
    return { ok: true, value: updated, warnings: [] };
  }

  function resolveNextStatus(
    current: ModerationCase['status'],
    action: ModerationActionType,
  ): ModerationCase['status'] {
    if (action === 'ESCALATE_TO_COMMITTEE') {
      return 'ESCALATED';
    }
    if (action === 'NONE') {
      return current === 'SUBMITTED' ? 'DISMISSED' : 'DISMISSED';
    }
    return 'ACTION_TAKEN';
  }

  function applyEnforcement(
    command: ApplyModerationActionCommand,
    moderationCase: ModerationCase,
    nowIso: string,
  ): void {
    if (moderationCase.channelId === undefined) {
      return;
    }
    if (command.action === 'CLOSE_CHANNEL') {
      const channel = channels.read(moderationCase.channelId);
      if (channel !== undefined && channel.status !== 'CLOSED') {
        channels.update(
          {
            ...channel,
            status: 'CLOSED',
            closedAtIso: nowIso,
            revision: nextRevision(channel.revision),
          },
          channel.revision.revision,
        );
      }
      return;
    }
    if (command.action === 'MUTE_RESIDENT' || command.action === 'REMOVE_RESIDENT_ACCESS') {
      for (const membership of channelMemberships.listByChannel(moderationCase.channelId)) {
        if (membership.status === 'ACTIVE') {
          channelMemberships.update(
            {
              ...membership,
              status: 'SUSPENDED',
              removedAtIso: nowIso,
              removedByUserId: command.actor.userId,
              revision: nextRevision(membership.revision),
            },
            membership.revision.revision,
          );
        }
      }
    }
  }

  return {
    report,
    startReview,
    grantAccess,
    viewReportedMessage,
    applyAction,
    listCases: moderationCases.listBySociety,
    listAudit: moderationAudit.listByCase,
  };
}
