import type { Absent } from '../../../shared/types/absence.types';
import type { AuditActorType } from '../../../core/audit/audit.types';
import type {
  CommunicationActor,
  DeniedDecision,
  DeniedTransition,
  CommunicationErrorCode,
  CommunicationOutcome,
  CommunicationScope,
  DepartmentCode,
  NoticeAcknowledgement,
  NoticeAcknowledgementReport,
  NoticeAudienceSnapshot,
  NoticeAudienceSnapshotEntry,
  NoticeAudienceType,
  NoticePriority,
  NoticeRecipientRecord,
  NoticeRecord,
  NoticeRevisionRecord,
  ResidentOccupancyRole,
  TraceContext,
} from '../domain/types';
import { deniedOutcome, deniedOutcomeFromViolation, nextRevision } from '../domain/types';
import {
  canTransitionNotice,
  canTransitionNoticeRecipient,
  isNoticeExpired,
  isNoticePublishable,
  isQuietHoursOverridePermitted,
} from '../domain/stateMachines/noticeStateMachine';
import {
  evaluateActionPermission,
  evaluateEmergencyOverride,
  evaluateSessionFreshness,
  evaluateTenantBoundary,
} from '../domain/guards/authorizationGuard';

import type { CommunicationPorts } from './ports';

const MAXIMUM_SESSION_AGE_MS = 60 * 60 * 1000;
const MINIMUM_TITLE_LENGTH = 4;
const MINIMUM_BODY_REFERENCE_LENGTH = 4;
const DEFAULT_NOTICE_RETENTION_DAYS = 90;
const MAXIMUM_DELIVERY_ATTEMPTS = 4;
const SCHEDULE_TOLERANCE_MS = 24 * 60 * 60 * 1000;

export type CreateNoticeCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly title: string;
  readonly subjectCiphertextRef: string;
  readonly bodyCiphertextRef: string;
  readonly localizedBodyRefs: Readonly<Record<string, string>>;
  readonly attachmentReferences: readonly string[];
  readonly priority: NoticePriority;
  readonly audienceType: NoticeAudienceType;
  readonly audienceValue: string | Absent;
  readonly effectiveFromIso: string;
  readonly effectiveUntilIso: string | Absent;
  readonly requiresAcknowledgement: boolean;
  readonly acknowledgementDueAtIso: string | Absent;
  readonly retentionDays: number;
  readonly emergencyOverride: boolean;
  readonly emergencyOverrideReason: string | Absent;
  readonly quietHoursOverride: boolean;
  readonly allowedDepartments: readonly DepartmentCode[];
  readonly idempotencyKey: string;
  readonly trace: TraceContext;
};

export type PublishNoticeCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly noticeId: string;
  readonly scheduledPublishAtIso: string | Absent;
  readonly idempotencyKey: string;
  readonly trace: TraceContext;
};

export type WithdrawNoticeCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly noticeId: string;
  readonly reason: string;
  readonly idempotencyKey: string;
  readonly trace: TraceContext;
};

export type AcknowledgeNoticeCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly noticeId: string;
  readonly expectedRevision: number;
  readonly trace: TraceContext;
};

export type MarkNoticeDeliveredCommand = CommunicationScope & {
  readonly recipientId: string;
  readonly channel: NoticeDeliveryChannel;
  readonly outcome: 'DELIVERED' | 'FAILED' | 'THROTTLED';
  readonly providerReference: string | Absent;
  readonly failureReason: string | Absent;
};

export type NoticeDeliveryChannel = 'PUSH' | 'SMS' | 'EMAIL' | 'WHATSAPP_LIKE';

export type GetAcknowledgementReportCommand = {
  readonly societyId: string;
  readonly actor: CommunicationActor;
  readonly noticeId: string;
};

export type NoticeService = {
  readonly create: (command: CreateNoticeCommand) => Promise<CommunicationOutcome<NoticeRecord>>;
  readonly publish: (command: PublishNoticeCommand) => Promise<CommunicationOutcome<NoticeRecord>>;
  readonly withdraw: (command: WithdrawNoticeCommand) => Promise<CommunicationOutcome<NoticeRecord>>;
  readonly acknowledge: (
    command: AcknowledgeNoticeCommand,
  ) => Promise<CommunicationOutcome<NoticeAcknowledgement>>;
  readonly markRecipientDelivered: (
    command: MarkNoticeDeliveredCommand,
  ) => Promise<CommunicationOutcome<NoticeRecipientRecord>>;
  readonly publishDueScheduled: (nowMs: number) => readonly NoticeRecord[];
  readonly expireDue: (nowMs: number) => readonly NoticeRecord[];
  readonly getNotice: (noticeId: string) => NoticeRecord | Absent;
  readonly listRecipients: (noticeId: string) => readonly NoticeRecipientRecord[];
  readonly getAcknowledgementReport: (
    command: GetAcknowledgementReportCommand,
  ) => Promise<CommunicationOutcome<NoticeAcknowledgementReport>>;
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

export function createNoticeService(ports: CommunicationPorts): NoticeService {
  const {
    clock,
    notices,
    noticeRevisions,
    noticeAudiences,
    noticeRecipients,
    noticeAcknowledgements,
    noticeDeliveryAttempts,
    directoryEntries,
    audit,
    idempotency,
  } = ports;

  function auditActorType(actor: CommunicationActor): AuditActorType {
    if (actor.actorType === 'SYSTEM') {
      return 'SYSTEM';
    }
    if (actor.actorType.startsWith('RESIDENT')) {
      return 'RESIDENT';
    }
    return 'ADMIN';
  }

  function emitAudit(
    actor: CommunicationActor,
    action: 'CREATE' | 'APPROVE' | 'REJECT' | 'UPDATE' | 'ACKNOWLEDGE',
    entityId: string,
    correlationId: string,
  ): void {
    audit.emit({
      id: `audit-notice-${entityId}-${action}-${correlationId}`,
      timestamp: clock.now().toISOString(),
      correlationId,
      actor: {
        userId: actor.userId,
        type: auditActorType(actor),
        role: actor.role,
        societyId: actor.societyId,
      },
      action,
      entityType: 'NOTICE',
      entityId,
      metadata: { source: 'MOBILE', correlationId },
      outcome: 'SUCCESS',
    });
  }

  function resolveAudience(
    societyId: string,
    audienceType: NoticeAudienceType,
    audienceValue: string | Absent,
    nowIso: string,
  ): readonly NoticeAudienceSnapshotEntry[] {
    const active = directoryEntries
      .listBySociety(societyId)
      .filter((entry) => entry.occupancyStatus === 'ACTIVE' && !entry.isFormerResident);
    return active
      .filter((entry) => matchesAudience(entry, audienceType, audienceValue))
      .map((entry) => ({
        residentProfileId: entry.residentProfileId,
        userId: entry.userId,
        unitId: entry.unitId,
        flatNumber: entry.flatNumber,
        towerOrWing: entry.towerOrWing,
        occupancyRole: entry.occupancyRole,
        resolvedAtIso: nowIso,
      }));
  }

  function matchesAudience(
    entry: {
      readonly towerOrWing: string;
      readonly floorLabel: string;
      readonly unitId: string;
      readonly occupancyRole: ResidentOccupancyRole;
    },
    audienceType: NoticeAudienceType,
    audienceValue: string | Absent,
  ): boolean {
    if (audienceType === 'ALL_RESIDENTS') {
      return true;
    }
    if (audienceValue === undefined) {
      return false;
    }
    if (audienceType === 'TOWER') {
      return entry.towerOrWing === audienceValue;
    }
    if (audienceType === 'FLOOR') {
      return `${entry.towerOrWing} ${entry.floorLabel}` === audienceValue;
    }
    if (audienceType === 'UNITS') {
      return audienceValue
        .split(',')
        .map((unitId: string) => unitId.trim())
        .includes(entry.unitId);
    }
    if (audienceType === 'OWNERS') {
      return entry.occupancyRole === 'OWNER';
    }
    if (audienceType === 'TENANTS') {
      return entry.occupancyRole === 'TENANT';
    }
    return false;
  }

  async function create(
    command: CreateNoticeCommand,
  ): Promise<CommunicationOutcome<NoticeRecord>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const permission = evaluateActionPermission(command.actor.role, 'CREATE_NOTICE');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    if (command.idempotencyKey.trim().length === 0) {
      return deny('IDEMPOTENCY_KEY_REQUIRED', 'idempotencyKey');
    }
    if (command.title.trim().length < MINIMUM_TITLE_LENGTH) {
      return deny('VALIDATION_FAILED', 'title');
    }
    if (command.bodyCiphertextRef.trim().length < MINIMUM_BODY_REFERENCE_LENGTH) {
      return deny('VALIDATION_FAILED', 'bodyCiphertextRef');
    }
    const effectiveFromMs = Date.parse(command.effectiveFromIso);
    if (Number.isNaN(effectiveFromMs)) {
      return deny('VALIDATION_FAILED', 'effectiveFromIso');
    }
    if (command.effectiveUntilIso !== undefined) {
      const untilMs = Date.parse(command.effectiveUntilIso);
      if (Number.isNaN(untilMs) || untilMs <= effectiveFromMs) {
        return deny('NOTICE_SCHEDULE_INVALID', 'effectiveUntilIso');
      }
    }
    if (!isQuietHoursOverridePermitted(command.priority, command.quietHoursOverride)) {
      return deny('NOTICE_QUIET_HOURS_OVERRIDE_INVALID', 'quietHoursOverride');
    }
    if (command.emergencyOverride) {
      if (
        command.emergencyOverrideReason === undefined ||
        command.emergencyOverrideReason.trim().length === 0
      ) {
        return deny('NOTICE_EMERGENCY_REASON_REQUIRED', 'emergencyOverrideReason');
      }
    }

    const existing = notices.findByIdempotencyKey(
      command.societyId,
      command.idempotencyKey,
    );
    if (existing !== undefined) {
      return { ok: true, value: existing, warnings: ['REPLAYED_NOTICE'] };
    }
    const fingerprint = `${command.actor.userId}:${command.audienceType}:${command.title}`;
    if (!idempotency.claim(command.societyId, command.idempotencyKey, fingerprint)) {
      return deny('IDEMPOTENCY_KEY_CONFLICT', 'idempotencyKey');
    }

    const nowIso = clock.now().toISOString();
    const entries = resolveAudience(
      command.societyId,
      command.audienceType,
      command.audienceValue,
      nowIso,
    );
    if (entries.length === 0) {
      return deny('NOTICE_AUDIENCE_EMPTY', 'audienceType');
    }

    const snapshotId = `notice-audience-${command.idempotencyKey}`;
    const snapshot: NoticeAudienceSnapshot = {
      id: snapshotId,
      societyId: command.societyId,
      noticeId: `notice-${command.idempotencyKey}`,
      audienceType: command.audienceType,
      audienceValue: command.audienceValue,
      entries,
      frozenAtIso: nowIso,
      frozenByUserId: command.actor.userId,
      totalRecipients: entries.length,
    };
    if (!noticeAudiences.insert(snapshot)) {
      return deny('NOTICE_AUDIENCE_FROZEN', 'audienceSnapshot');
    }

    const notice: NoticeRecord = {
      id: snapshot.noticeId,
      scope: {
        societyId: command.societyId,
        owningEntityType: 'NOTICE',
        owningEntityId: `notice-${command.idempotencyKey}`,
      },
      societyId: command.societyId,
      title: command.title.trim(),
      subjectCiphertextRef: command.subjectCiphertextRef,
      bodyCiphertextRef: command.bodyCiphertextRef,
      localizedBodyRefs: command.localizedBodyRefs,
      attachmentReferences: command.attachmentReferences,
      priority: command.priority,
      status: 'DRAFT',
      audienceSnapshotId: snapshotId,
      currentRevision: 1,
      effectiveFromIso: command.effectiveFromIso,
      effectiveUntilIso: command.effectiveUntilIso,
      scheduledPublishAtIso: undefined,
      publishedAtIso: undefined,
      deliveredAtIso: undefined,
      expiredAtIso: undefined,
      withdrawnAtIso: undefined,
      withdrawalReason: undefined,
      emergencyOverride: command.emergencyOverride,
      emergencyOverrideReason: command.emergencyOverrideReason,
      emergencyOverrideApprovedByUserId: command.emergencyOverride ? command.actor.userId : undefined,
      quietHoursOverride: command.quietHoursOverride,
      allowedDepartments: command.allowedDepartments,
      requiresAcknowledgement: command.requiresAcknowledgement,
      acknowledgementDueAtIso: command.acknowledgementDueAtIso,
      retentionDays:
        command.retentionDays > 0 ? command.retentionDays : DEFAULT_NOTICE_RETENTION_DAYS,
      createdByUserId: command.actor.userId,
      createdAtIso: nowIso,
      revision: { revision: 1, revisionToken: 'rev-1' },
    };
    if (!notices.insert(notice)) {
      idempotency.release(command.societyId, command.idempotencyKey);
      return deny('CONCURRENT_WRITE', 'notice');
    }
    idempotency.bindAggregate(command.societyId, command.idempotencyKey, notice.id);

    const revisionRecord: NoticeRevisionRecord = {
      id: `notice-revision-${notice.id}-1`,
      societyId: notice.societyId,
      noticeId: notice.id,
      revision: 1,
      bodyCiphertextRef: notice.bodyCiphertextRef,
      subjectCiphertextRef: notice.subjectCiphertextRef,
      localizedBodyRefs: notice.localizedBodyRefs,
      attachmentReferences: notice.attachmentReferences,
      changedByUserId: command.actor.userId,
      changeReason: 'INITIAL_DRAFT',
      createdAtIso: nowIso,
    };
    noticeRevisions.insert(revisionRecord);

    for (const entry of entries) {
      const recipient: NoticeRecipientRecord = {
        id: `notice-recipient-${notice.id}-${entry.residentProfileId}`,
        societyId: notice.societyId,
        noticeId: notice.id,
        revision: 1,
        residentProfileId: entry.residentProfileId,
        userId: entry.userId,
        unitId: entry.unitId,
        state: 'PENDING',
        deliveryAttempts: 0,
        lastAttemptAtIso: undefined,
        deliveredAtIso: undefined,
        readAtIso: undefined,
        acknowledgedAtIso: undefined,
        acknowledgedRevision: undefined,
        failureReason: undefined,
        suppressedReason: undefined,
      };
      noticeRecipients.insert(recipient);
    }

    emitAudit(command.actor, 'CREATE', notice.id, command.trace.correlationId);
    return { ok: true, value: notice, warnings: [] };
  }

  async function publish(
    command: PublishNoticeCommand,
  ): Promise<CommunicationOutcome<NoticeRecord>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const permission = evaluateActionPermission(command.actor.role, 'PUBLISH_NOTICE');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const notice = notices.read(command.noticeId);
    if (notice === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'notice');
    }
    if (notice.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'notice.societyId');
    }
    const override = evaluateEmergencyOverride(
      notice,
      notice.emergencyOverrideReason,
      notice.emergencyOverrideApprovedByUserId,
    );
    if (!override.allowed) {
      return denyDecision(override);
    }
    const snapshotId = notice.audienceSnapshotId;
    const snapshot =
      snapshotId === undefined ? undefined : noticeAudiences.read(snapshotId);
    if (snapshot === undefined) {
      return deny('NOTICE_AUDIENCE_FROZEN', 'audienceSnapshot');
    }
    if (!isNoticePublishable(notice.status, snapshot.totalRecipients, true)) {
      return deny('PRECONDITION_FAILED', 'notice.status');
    }
    const transition = canTransitionNotice(
      notice.status,
      command.scheduledPublishAtIso === undefined ? 'PUBLISHED' : 'SCHEDULED',
    );
    if (!transition.allowed) {
      return denyTransition(transition);
    }
    if (command.scheduledPublishAtIso !== undefined) {
      const scheduleMs = Date.parse(command.scheduledPublishAtIso);
      if (Number.isNaN(scheduleMs)) {
        return deny('NOTICE_SCHEDULE_INVALID', 'scheduledPublishAtIso');
      }
      if (Math.abs(scheduleMs - clock.now().getTime()) > SCHEDULE_TOLERANCE_MS) {
        return deny('NOTICE_SCHEDULE_INVALID', 'scheduledPublishAtIso');
      }
    }
    const nowIso = clock.now().toISOString();
    const updated: NoticeRecord = {
      ...notice,
      status: command.scheduledPublishAtIso === undefined ? 'PUBLISHED' : 'SCHEDULED',
      scheduledPublishAtIso: command.scheduledPublishAtIso,
      publishedAtIso: command.scheduledPublishAtIso === undefined ? nowIso : undefined,
      revision: nextRevision(notice.revision),
    };
    if (!notices.update(updated, notice.revision.revision)) {
      return deny('CONCURRENT_WRITE', 'notice');
    }
    if (updated.status === 'PUBLISHED') {
      enqueueRecipients(updated);
    }
    emitAudit(command.actor, 'APPROVE', notice.id, command.trace.correlationId);
    return { ok: true, value: updated, warnings: [] };
  }

  function enqueueRecipients(notice: NoticeRecord): void {
    for (const recipient of noticeRecipients.listByNotice(notice.id)) {
      if (recipient.state !== 'PENDING') {
        continue;
      }
      const transition = canTransitionNoticeRecipient(recipient.state, 'QUEUED');
      if (!transition.allowed) {
        continue;
      }
      noticeRecipients.update(
        { ...recipient, state: 'QUEUED', revision: recipient.revision + 1 },
        recipient.revision,
      );
    }
  }

  async function withdraw(
    command: WithdrawNoticeCommand,
  ): Promise<CommunicationOutcome<NoticeRecord>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const permission = evaluateActionPermission(command.actor.role, 'WITHDRAW_NOTICE');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    if (command.reason.trim().length === 0) {
      return deny('VALIDATION_FAILED', 'reason');
    }
    const notice = notices.read(command.noticeId);
    if (notice === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'notice');
    }
    if (notice.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'notice.societyId');
    }
    const transition = canTransitionNotice(notice.status, 'WITHDRAWN');
    if (!transition.allowed) {
      return denyTransition(transition);
    }
    const updated: NoticeRecord = {
      ...notice,
      status: 'WITHDRAWN',
      withdrawnAtIso: clock.now().toISOString(),
      withdrawalReason: command.reason.trim(),
      revision: nextRevision(notice.revision),
    };
    if (!notices.update(updated, notice.revision.revision)) {
      return deny('CONCURRENT_WRITE', 'notice');
    }
    emitAudit(command.actor, 'UPDATE', notice.id, command.trace.correlationId);
    return { ok: true, value: updated, warnings: [] };
  }

  async function acknowledge(
    command: AcknowledgeNoticeCommand,
  ): Promise<CommunicationOutcome<NoticeAcknowledgement>> {
    const session = evaluateSessionFreshness(
      command.actor.authenticatedAt,
      clock,
      MAXIMUM_SESSION_AGE_MS,
    );
    if (!session.allowed) {
      return denyDecision(session);
    }
    const permission = evaluateActionPermission(command.actor.role, 'ACKNOWLEDGE_NOTICE');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const notice = notices.read(command.noticeId);
    if (notice === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'notice');
    }
    if (notice.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'notice.societyId');
    }
    if (notice.status !== 'PUBLISHED' && notice.status !== 'DELIVERING' && notice.status !== 'DELIVERED' && notice.status !== 'PARTIALLY_DELIVERED') {
      return deny('NOTICE_NOT_PUBLISHED', 'notice.status');
    }
    if (command.expectedRevision !== notice.currentRevision) {
      return deny('NOTICE_REVISION_MISMATCH', 'expectedRevision');
    }
    const recipient = noticeRecipients
      .listByNotice(notice.id)
      .find((entry) => entry.userId === command.actor.userId);
    if (recipient === undefined) {
      return deny('IDOR_BLOCKED', 'noticeRecipient');
    }
    if (recipient.acknowledgedAtIso !== undefined) {
      return deny('TERMINAL_STATE', 'noticeRecipient.acknowledgedAtIso');
    }
    const transition = canTransitionNoticeRecipient(recipient.state, 'ACKNOWLEDGED');
    if (!transition.allowed) {
      return denyTransition(transition);
    }
    const nowIso = clock.now().toISOString();
    const updated: NoticeRecipientRecord = {
      ...recipient,
      state: 'ACKNOWLEDGED',
      acknowledgedAtIso: nowIso,
      acknowledgedRevision: notice.currentRevision,
      revision: recipient.revision + 1,
    };
    if (!noticeRecipients.update(updated, recipient.revision)) {
      return deny('CONCURRENT_WRITE', 'noticeRecipient');
    }
    const acknowledgement: NoticeAcknowledgement = {
      id: `notice-ack-${notice.id}-${recipient.residentProfileId}-${notice.currentRevision}`,
      societyId: notice.societyId,
      noticeId: notice.id,
      revision: notice.currentRevision,
      residentProfileId: recipient.residentProfileId,
      userId: recipient.userId,
      acknowledgedAtIso: nowIso,
      deliveryStateAtAcknowledgement: recipient.state,
    };
    noticeAcknowledgements.insert(acknowledgement);
    emitAudit(command.actor, 'ACKNOWLEDGE', notice.id, command.trace.correlationId);
    return { ok: true, value: acknowledgement, warnings: [] };
  }

  async function markRecipientDelivered(
    command: MarkNoticeDeliveredCommand,
  ): Promise<CommunicationOutcome<NoticeRecipientRecord>> {
    const recipient = noticeRecipients.read(command.recipientId);
    if (recipient === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'noticeRecipient');
    }
    if (recipient.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'noticeRecipient.societyId');
    }
    if (recipient.deliveryAttempts >= MAXIMUM_DELIVERY_ATTEMPTS) {
      return deny('DELIVERY_ATTEMPT_EXHAUSTED', 'noticeRecipient.deliveryAttempts');
    }
    let current = recipient;
    if (current.state === 'FAILED') {
      const requeued: NoticeRecipientRecord = {
        ...current,
        state: 'QUEUED',
        revision: current.revision + 1,
      };
      if (!noticeRecipients.update(requeued, current.revision)) {
        return deny('CONCURRENT_WRITE', 'noticeRecipient');
      }
      current = requeued;
    }
    const nextState = command.outcome === 'DELIVERED' ? 'DELIVERED' : 'FAILED';
    const transition = canTransitionNoticeRecipient(current.state, nextState);
    if (!transition.allowed) {
      return denyTransition(transition);
    }
    const nowIso = clock.now().toISOString();
    const attempts = current.deliveryAttempts + 1;
    noticeDeliveryAttempts.insert({
      id: `notice-attempt-${current.id}-${attempts}`,
      societyId: current.societyId,
      noticeId: current.noticeId,
      recipientId: current.id,
      channel: command.channel,
      attemptNumber: attempts,
      outcome: command.outcome,
      providerReference: command.providerReference,
      attemptedAtIso: nowIso,
      failureReason: command.failureReason,
    });
    const updated: NoticeRecipientRecord = {
      ...current,
      state: nextState,
      deliveryAttempts: attempts,
      lastAttemptAtIso: nowIso,
      deliveredAtIso: command.outcome === 'DELIVERED' ? nowIso : undefined,
      failureReason:
        command.outcome === 'DELIVERED'
          ? undefined
          : command.failureReason ?? 'DELIVERY_FAILED',
      revision: current.revision + 1,
    };
    if (!noticeRecipients.update(updated, current.revision)) {
      return deny('CONCURRENT_WRITE', 'noticeRecipient');
    }
    return { ok: true, value: updated, warnings: [] };
  }

  function publishDueScheduled(nowMs: number): readonly NoticeRecord[] {
    const due = notices.listScheduledDue(new Date(nowMs).toISOString());
    const published: NoticeRecord[] = [];
    for (const notice of due) {
      const transition = canTransitionNotice(notice.status, 'PUBLISHED');
      if (!transition.allowed) {
        continue;
      }
      const updated: NoticeRecord = {
        ...notice,
        status: 'PUBLISHED',
        publishedAtIso: new Date(nowMs).toISOString(),
        revision: nextRevision(notice.revision),
      };
      if (notices.update(updated, notice.revision.revision)) {
        enqueueRecipients(updated);
        published.push(updated);
      }
    }
    return published;
  }

  function expireDue(nowMs: number): readonly NoticeRecord[] {
    const candidates = notices.listExpiringBefore(new Date(nowMs).toISOString());
    const expired: NoticeRecord[] = [];
    for (const notice of candidates) {
      if (!isNoticeExpired(notice.status, notice.effectiveUntilIso, nowMs)) {
        continue;
      }
      const transition = canTransitionNotice(notice.status, 'EXPIRED');
      if (!transition.allowed) {
        continue;
      }
      const updated: NoticeRecord = {
        ...notice,
        status: 'EXPIRED',
        expiredAtIso: new Date(nowMs).toISOString(),
        revision: nextRevision(notice.revision),
      };
      if (notices.update(updated, notice.revision.revision)) {
        expired.push(updated);
      }
    }
    return expired;
  }

  async function getAcknowledgementReport(
    command: GetAcknowledgementReportCommand,
  ): Promise<CommunicationOutcome<NoticeAcknowledgementReport>> {
    const societyId = command.societyId;
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const permission = evaluateActionPermission(command.actor.role, 'VIEW_NOTICE_DELIVERY_REPORT');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const notice = notices.read(command.noticeId);
    if (notice === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'notice');
    }
    if (notice.societyId !== societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'notice.societyId');
    }
    const recipients = noticeRecipients.listByNotice(command.noticeId);
    const report: NoticeAcknowledgementReport = {
      societyId,
      noticeId: command.noticeId,
      revision: notice.currentRevision,
      totalAudience: recipients.length,
      delivered: recipients.filter((entry) => entry.state === 'DELIVERED' || entry.state === 'READ' || entry.state === 'ACKNOWLEDGED').length,
      read: recipients.filter((entry) => entry.state === 'READ' || entry.state === 'ACKNOWLEDGED').length,
      acknowledged: recipients.filter((entry) => entry.state === 'ACKNOWLEDGED').length,
      pending: recipients.filter((entry) => entry.state === 'PENDING' || entry.state === 'QUEUED').length,
      failed: recipients.filter((entry) => entry.state === 'FAILED').length,
      generatedAtIso: clock.now().toISOString(),
    };
    return { ok: true, value: report, warnings: [] };
  }

  return {
    create,
    publish,
    withdraw,
    acknowledge,
    markRecipientDelivered,
    publishDueScheduled,
    expireDue,
    getNotice: notices.read,
    listRecipients: noticeRecipients.listByNotice,
    getAcknowledgementReport,
  };
}
