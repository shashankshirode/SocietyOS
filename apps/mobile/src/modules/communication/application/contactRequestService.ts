import type { Absent } from '../../../shared/types/absence.types';
import type { AuditActorType } from '../../../core/audit/audit.types';
import type {
  ChannelMembershipRecord,
  ChannelRecord,
  CommunicationActor,
  DeniedDecision,
  DeniedTransition,
  CommunicationErrorCode,
  CommunicationOutcome,
  CommunicationScope,
  ContactRequestRecord,
  ContactRequestTopic,
  ResidentPrivacySettings,
  ResidentBlock,
  TraceContext,
} from '../domain/types';
import { deniedOutcome, deniedOutcomeFromViolation, nextRevision } from '../domain/types';
import {
  canTransitionContactRequest,
  contactRequestExpiryViolations,
  isContactRequestExpired,
  isContactRequestOpen,
} from '../domain/stateMachines/contactRequestStateMachine';
import {
  evaluateActionPermission,
  evaluateBlockDirection,
  evaluateContactPermission,
  evaluateSessionFreshness,
  evaluateTenantBoundary,
  isContactRequestOwner,
  isContactRequestRespondent,
} from '../domain/guards/authorizationGuard';

import type { CommunicationPorts } from './ports';

const MAXIMUM_SESSION_AGE_MS = 60 * 60 * 1000;
const MINIMUM_SUBJECT_LENGTH = 4;
const MAXIMUM_SUBJECT_LENGTH = 120;
const MINIMUM_MESSAGE_LENGTH = 10;
const MAXIMUM_MESSAGE_LENGTH = 1000;
const CONTACT_REQUEST_TTL_DAYS = 7;
const DIRECT_CHANNEL_RETENTION_DAYS = 365;

const RESIDENT_ACTOR_TYPES: readonly CommunicationActor['actorType'][] = [
  'RESIDENT_OWNER',
  'RESIDENT_TENANT',
  'RESIDENT_FAMILY',
];

export type CreateContactRequestCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly requesterResidentProfileId: string;
  readonly recipientResidentProfileId: string;
  readonly subject: string;
  readonly introductoryMessage: string;
  readonly topic: ContactRequestTopic;
  readonly idempotencyKey: string;
  readonly trace: TraceContext;
};

export type RespondToContactRequestCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly requestId: string;
  readonly decision: 'ACCEPT' | 'REJECT' | 'CANCEL';
  readonly reason: string | Absent;
  readonly idempotencyKey: string;
  readonly trace: TraceContext;
};

export type BlockResidentCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly blockedResidentProfileId: string;
  readonly reason: string | Absent;
  readonly idempotencyKey: string;
  readonly trace: TraceContext;
};

export type AcceptContactRequestResult = {
  readonly request: ContactRequestRecord;
  readonly channel: ChannelRecord;
  readonly memberships: readonly ChannelMembershipRecord[];
  readonly channelCreated: boolean;
};

export type ContactRequestService = {
  readonly create: (
    command: CreateContactRequestCommand,
  ) => Promise<CommunicationOutcome<ContactRequestRecord>>;
  readonly accept: (
    command: RespondToContactRequestCommand,
  ) => Promise<CommunicationOutcome<AcceptContactRequestResult>>;
  readonly reject: (
    command: RespondToContactRequestCommand,
  ) => Promise<CommunicationOutcome<ContactRequestRecord>>;
  readonly cancel: (
    command: RespondToContactRequestCommand,
  ) => Promise<CommunicationOutcome<ContactRequestRecord>>;
  readonly blockResident: (
    command: BlockResidentCommand,
  ) => Promise<CommunicationOutcome<ResidentBlock>>;
  readonly expireStale: (societyId: string, nowMs: number) => readonly ContactRequestRecord[];
  readonly listIncoming: (
    societyId: string,
    recipientUserId: string,
  ) => readonly ContactRequestRecord[];
  readonly listOutgoing: (
    societyId: string,
    requesterUserId: string,
  ) => readonly ContactRequestRecord[];
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

export function createContactRequestService(
  ports: CommunicationPorts,
): ContactRequestService {
  const {
    clock,
    contactRequests,
    contactAcceptance,
    directoryEntries,
    privacySettings,
    blocks,
    channels,
    channelMemberships,
    audit,
    idempotency,
  } = ports;

  function privacyFor(societyId: string, residentProfileId: string): ResidentPrivacySettings {
    const existing = privacySettings.read(societyId, residentProfileId);
    if (existing !== undefined) {
      return existing;
    }
    return {
      residentProfileId,
      societyId,
      allowDirectoryListing: false,
      showFlatNumber: false,
      showDisplayName: false,
      allowFirstContact: false,
      allowGroupInvite: false,
      allowCommitteeContact: true,
      sameTowerOnly: false,
      allowModerationEvidenceSharing: false,
      updatedAtIso: clock.now().toISOString(),
      revision: { revision: 0, revisionToken: 'initial' },
    };
  }

  function blockBetweenProfiles(
    societyId: string,
    residentProfileIdA: string,
    residentProfileIdB: string,
  ): ResidentBlock | Absent {
    return blocks.findPair(societyId, residentProfileIdA, residentProfileIdB);
  }

  function auditActorType(actor: CommunicationActor): AuditActorType {
    if (RESIDENT_ACTOR_TYPES.includes(actor.actorType)) {
      return 'RESIDENT';
    }
    if (actor.actorType === 'SECURITY_GUARD' || actor.actorType === 'SECURITY_SUPERVISOR') {
      return 'GUARD';
    }
    if (actor.actorType === 'SYSTEM') {
      return 'SYSTEM';
    }
    return 'ADMIN';
  }

  function emitAudit(
    actor: CommunicationActor,
    action: 'CREATE' | 'APPROVE' | 'REJECT' | 'UPDATE' | 'ESCALATE',
    entityId: string,
    correlationId: string,
    outcome: 'SUCCESS' | 'FAILURE',
  ): void {
    audit.emit({
      id: `audit-${entityId}-${action}-${correlationId}`,
      timestamp: clock.now().toISOString(),
      correlationId,
      actor: {
        userId: actor.userId,
        type: auditActorType(actor),
        role: actor.role,
        societyId: actor.societyId,
      },
      action,
      entityType: 'RESIDENT',
      entityId,
      metadata: { source: 'MOBILE', correlationId },
      outcome,
    });
  }

  function pairOf(
    societyId: string,
    profileIdA: string,
    profileIdB: string,
  ): {
    readonly societyId: string;
    readonly residentProfileIdA: string;
    readonly residentProfileIdB: string;
  } {
    const first = profileIdA < profileIdB ? profileIdA : profileIdB;
    const second = profileIdA < profileIdB ? profileIdB : profileIdA;
    return {
      societyId,
      residentProfileIdA: first,
      residentProfileIdB: second,
    };
  }

  async function create(
    command: CreateContactRequestCommand,
  ): Promise<CommunicationOutcome<ContactRequestRecord>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
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
      'SEND_CONTACT_REQUEST',
    );
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    if (command.idempotencyKey.trim().length === 0) {
      return deny('IDEMPOTENCY_KEY_REQUIRED', 'idempotencyKey');
    }
    const subject = command.subject.trim();
    const message = command.introductoryMessage.trim();
    if (subject.length < MINIMUM_SUBJECT_LENGTH || subject.length > MAXIMUM_SUBJECT_LENGTH) {
      return deny('VALIDATION_FAILED', 'subject');
    }
    if (
      message.length < MINIMUM_MESSAGE_LENGTH ||
      message.length > MAXIMUM_MESSAGE_LENGTH
    ) {
      return deny('VALIDATION_FAILED', 'introductoryMessage');
    }

    const requester = directoryEntries.readByResidentProfileId(
      command.societyId,
      command.requesterResidentProfileId,
    );
    if (requester === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'requesterResidentProfileId');
    }
    if (requester.userId !== command.actor.userId) {
      return deny('IDOR_BLOCKED', 'requesterResidentProfileId');
    }

    const recipient = directoryEntries.readByResidentProfileId(
      command.societyId,
      command.recipientResidentProfileId,
    );
    if (recipient === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'recipientResidentProfileId');
    }
    if (recipient.occupancyStatus !== 'ACTIVE') {
      return deny('INACTIVE_RESIDENT_BLOCKED', 'recipientResidentProfileId');
    }
    if (recipient.isFormerResident) {
      return deny('HISTORICAL_PRIVACY_BLOCKED', 'recipientResidentProfileId');
    }

    const block = blockBetweenProfiles(
      command.societyId,
      requester.residentProfileId,
      recipient.residentProfileId,
    );
    if (block !== undefined) {
      const decision = evaluateBlockDirection(
        block,
        command.actor.userId,
        recipient.userId,
      );
      if (!decision.allowed) {
        return denyDecision(decision);
      }
    }

    const recipientPrivacy = privacyFor(
      command.societyId,
      recipient.residentProfileId,
    );
    const contactPermission = evaluateContactPermission(
      command.actor.userId,
      { ...recipient, isBlocked: block !== undefined },
      recipientPrivacy,
    );
    if (!contactPermission.allowed) {
      return denyDecision(contactPermission);
    }

    const fingerprint = `${command.requesterResidentProfileId}:${command.recipientResidentProfileId}:${subject}`;
    const existingByKey = contactRequests.findByIdempotencyKey(
      command.societyId,
      command.idempotencyKey,
    );
    if (existingByKey !== undefined) {
      if (
        existingByKey.requesterResidentProfileId !==
          command.requesterResidentProfileId ||
        existingByKey.recipientResidentProfileId !==
          command.recipientResidentProfileId
      ) {
        return deny('IDEMPOTENCY_KEY_CONFLICT', 'idempotencyKey');
      }
      return { ok: true, value: existingByKey, warnings: ['REPLAYED_IDEMPOTENT_REQUEST'] };
    }

    const pair = pairOf(
      command.societyId,
      requester.residentProfileId,
      recipient.residentProfileId,
    );
    const openRequest = contactRequests
      .listByPair(pair)
      .find(
        (candidate) =>
          isContactRequestOpen(candidate.status) &&
          !isContactRequestExpired(
            candidate.status,
            candidate.expiresAtIso,
            clock.now().getTime(),
          ),
      );
    if (openRequest !== undefined) {
      return deny('DUPLICATE_CONTACT_PAIR', 'recipientResidentProfileId');
    }

    if (!idempotency.claim(command.societyId, command.idempotencyKey, fingerprint)) {
      return deny('IDEMPOTENCY_KEY_REPLAY', 'idempotencyKey');
    }

    const nowIso = clock.now().toISOString();
    const expiresAtMs =
      clock.now().getTime() + CONTACT_REQUEST_TTL_DAYS * 24 * 60 * 60 * 1000;
    const request: ContactRequestRecord = {
      id: `contact-request-${command.idempotencyKey}`,
      scope: {
        societyId: command.societyId,
        owningEntityType: 'CONTACT_REQUEST',
        owningEntityId: `contact-request-${command.idempotencyKey}`,
      },
      societyId: command.societyId,
      requesterUserId: requester.userId,
      requesterResidentProfileId: requester.residentProfileId,
      requesterUnitId: requester.unitId,
      recipientUserId: recipient.userId,
      recipientResidentProfileId: recipient.residentProfileId,
      recipientUnitId: recipient.unitId,
      subject,
      introductoryMessage: message,
      topic: command.topic,
      status: 'PENDING_CONSENT',
      channelId: undefined,
      createdAtIso: nowIso,
      expiresAtIso: new Date(expiresAtMs).toISOString(),
      respondedAtIso: undefined,
      responseReason: undefined,
      closedAtIso: undefined,
      reportedAtIso: undefined,
      revision: { revision: 1, revisionToken: 'rev-1' },
    };

    if (!contactRequests.insert(request)) {
      idempotency.release(command.societyId, command.idempotencyKey);
      return deny('CONCURRENT_WRITE', 'contactRequest');
    }
    idempotency.bindAggregate(command.societyId, command.idempotencyKey, request.id);

    emitAudit(
      command.actor,
      'CREATE',
      request.id,
      command.trace.correlationId,
      'SUCCESS',
    );

    return { ok: true, value: request, warnings: [] };
  }

  function ensureRespondent(
    request: ContactRequestRecord,
    actorUserId: string,
  ): CommunicationOutcome<true> {
    if (!isContactRequestRespondent(request, actorUserId)) {
      return deny('IDOR_BLOCKED', 'contactRequest.recipientUserId');
    }
    return { ok: true, value: true, warnings: [] };
  }

  function ensureTransition(
    request: ContactRequestRecord,
    next: ContactRequestRecord['status'],
  ): CommunicationOutcome<true> {
    const transition = canTransitionContactRequest(request.status, next);
    if (!transition.allowed) {
      return denyTransition(transition);
    }
    return { ok: true, value: true, warnings: [] };
  }

  function ensureNotExpired(request: ContactRequestRecord): CommunicationOutcome<true> {
    const violations = contactRequestExpiryViolations(
      request.status,
      request.expiresAtIso,
      clock.now().getTime(),
    );
    if (violations.length > 0) {
      return deny('PRECONDITION_FAILED', 'contactRequest.expiresAtIso');
    }
    return { ok: true, value: true, warnings: [] };
  }

  function resolvePairChannel(
    request: ContactRequestRecord,
  ): ChannelRecord | Absent {
    const byRequest = channels.findByContactRequest(request.id);
    if (byRequest !== undefined) {
      return byRequest;
    }
    return channels.findDirectByPair(
      request.societyId,
      request.requesterResidentProfileId,
      request.recipientResidentProfileId,
    );
  }

  function buildDirectChannel(
    request: ContactRequestRecord,
  ): ChannelRecord {
    return {
      id: `channel-direct-${request.id}`,
      scope: request.scope,
      societyId: request.societyId,
      kind: 'PRIVATE_DIRECT',
      displayName: request.subject,
      description: undefined,
      status: 'ACTIVE',
      groupScopeType: undefined,
      groupScopeValue: undefined,
      departmentCode: undefined,
      contactRequestId: request.id,
      createdByUserId: request.recipientUserId,
      createdAtIso: clock.now().toISOString(),
      closedAtIso: undefined,
      retentionDays: DIRECT_CHANNEL_RETENTION_DAYS,
      revision: { revision: 1, revisionToken: 'rev-1' },
    };
  }

  function buildMembership(
    request: ContactRequestRecord,
    channel: ChannelRecord,
    userId: string,
    residentProfileId: string,
    unitId: string,
  ): ChannelMembershipRecord {
    return {
      id: `membership-${channel.id}-${userId}`,
      scope: channel.scope,
      societyId: channel.societyId,
      channelId: channel.id,
      userId,
      residentProfileId,
      unitId,
      memberRole: 'MEMBER',
      status: 'ACTIVE',
      joinedAtIso: clock.now().toISOString(),
      removedAtIso: undefined,
      removedByUserId: undefined,
      revision: { revision: 1, revisionToken: 'rev-1' },
    };
  }

  function desiredMemberships(
    request: ContactRequestRecord,
    channel: ChannelRecord,
  ): readonly ChannelMembershipRecord[] {
    return [
      buildMembership(
        request,
        channel,
        request.requesterUserId,
        request.requesterResidentProfileId,
        request.requesterUnitId,
      ),
      buildMembership(
        request,
        channel,
        request.recipientUserId,
        request.recipientResidentProfileId,
        request.recipientUnitId,
      ),
    ];
  }

  async function accept(
    command: RespondToContactRequestCommand,
  ): Promise<CommunicationOutcome<AcceptContactRequestResult>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const permission = evaluateActionPermission(
      command.actor.role,
      'RESPOND_CONTACT_REQUEST',
    );
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const request = contactRequests.read(command.requestId);
    if (request === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'contactRequest');
    }
    if (request.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'contactRequest.societyId');
    }
    const respondent = ensureRespondent(request, command.actor.userId);
    if (!respondent.ok) {
      return respondent;
    }
    const transition = ensureTransition(request, 'ACCEPTED');
    if (!transition.ok) {
      return transition;
    }
    const notExpired = ensureNotExpired(request);
    if (!notExpired.ok) {
      return notExpired;
    }

    const existingChannel = resolvePairChannel(request);
    if (
      existingChannel !== undefined &&
      existingChannel.status === 'CLOSED' &&
      request.channelId !== undefined
    ) {
      return deny('CHANNEL_NOT_ACTIVE', 'channel.status');
    }
    const channel = existingChannel ?? buildDirectChannel(request);
    const accepted: ContactRequestRecord = {
      ...request,
      status: 'ACCEPTED',
      channelId: channel.id,
      respondedAtIso: clock.now().toISOString(),
      responseReason: command.reason,
      revision: nextRevision(request.revision),
    };
    const commit = contactAcceptance.commitAcceptance({
      societyId: request.societyId,
      requestId: request.id,
      expectedRequestRevision: request.revision.revision,
      nextRequest: accepted,
      channel,
      memberships: desiredMemberships(request, channel),
    });
    if (!commit.committed) {
      if (commit.reason === 'REVISION_MISMATCH') {
        return deny('CONCURRENT_WRITE', 'contactRequest');
      }
      if (commit.reason === 'CHANNEL_CONFLICT') {
        return deny('CHANNEL_ALREADY_EXISTS', 'channel');
      }
      if (commit.reason === 'MEMBERSHIP_CONFLICT') {
        return deny('CONCURRENT_WRITE', 'channelMembership');
      }
      return deny('CHANNEL_ALREADY_EXISTS', 'channel');
    }

    emitAudit(
      command.actor,
      'APPROVE',
      request.id,
      command.trace.correlationId,
      'SUCCESS',
    );

    return {
      ok: true,
      value: {
        request: accepted,
        channel: commit.channel,
        memberships: commit.memberships,
        channelCreated: commit.channelCreated,
      },
      warnings: [],
    };
  }

  async function reject(
    command: RespondToContactRequestCommand,
  ): Promise<CommunicationOutcome<ContactRequestRecord>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const permission = evaluateActionPermission(
      command.actor.role,
      'RESPOND_CONTACT_REQUEST',
    );
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const request = contactRequests.read(command.requestId);
    if (request === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'contactRequest');
    }
    const respondent = ensureRespondent(request, command.actor.userId);
    if (!respondent.ok) {
      return respondent;
    }
    const transition = ensureTransition(request, 'REJECTED');
    if (!transition.ok) {
      return transition;
    }
    const rejected: ContactRequestRecord = {
      ...request,
      status: 'REJECTED',
      respondedAtIso: clock.now().toISOString(),
      responseReason: command.reason,
      closedAtIso: clock.now().toISOString(),
      channelId: undefined,
      revision: nextRevision(request.revision),
    };
    if (!contactRequests.update(rejected, request.revision.revision)) {
      return deny('CONCURRENT_WRITE', 'contactRequest');
    }
    emitAudit(
      command.actor,
      'REJECT',
      request.id,
      command.trace.correlationId,
      'SUCCESS',
    );
    return { ok: true, value: rejected, warnings: [] };
  }

  async function cancel(
    command: RespondToContactRequestCommand,
  ): Promise<CommunicationOutcome<ContactRequestRecord>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const request = contactRequests.read(command.requestId);
    if (request === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'contactRequest');
    }
    if (!isContactRequestOwner(request, command.actor.userId)) {
      return deny('IDOR_BLOCKED', 'contactRequest.requesterUserId');
    }
    const transition = ensureTransition(request, 'CANCELLED');
    if (!transition.ok) {
      return transition;
    }
    const cancelled: ContactRequestRecord = {
      ...request,
      status: 'CANCELLED',
      respondedAtIso: clock.now().toISOString(),
      closedAtIso: clock.now().toISOString(),
      channelId: undefined,
      revision: nextRevision(request.revision),
    };
    if (!contactRequests.update(cancelled, request.revision.revision)) {
      return deny('CONCURRENT_WRITE', 'contactRequest');
    }
    emitAudit(
      command.actor,
      'UPDATE',
      request.id,
      command.trace.correlationId,
      'SUCCESS',
    );
    return { ok: true, value: cancelled, warnings: [] };
  }

  async function blockResident(
    command: BlockResidentCommand,
  ): Promise<CommunicationOutcome<ResidentBlock>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const permission = evaluateActionPermission(command.actor.role, 'BLOCK_RESIDENT');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const target = directoryEntries.readByResidentProfileId(
      command.societyId,
      command.blockedResidentProfileId,
    );
    if (target === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'blockedResidentProfileId');
    }
    if (target.userId === command.actor.userId) {
      return deny('SELF_CONTACT_BLOCKED', 'blockedResidentProfileId');
    }
    const actorEntry = directoryEntries
      .listBySociety(command.societyId)
      .find((entry) => entry.userId === command.actor.userId);
    if (actorEntry === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'actor');
    }
    const existing = blocks.findPair(
      command.societyId,
      actorEntry.residentProfileId,
      target.residentProfileId,
    );
    if (existing !== undefined) {
      return { ok: true, value: existing, warnings: ['ALREADY_BLOCKED'] };
    }
    const record: ResidentBlock = {
      id: `block-${command.idempotencyKey}`,
      scope: {
        societyId: command.societyId,
        owningEntityType: 'RESIDENT_PROFILE',
        owningEntityId: actorEntry.residentProfileId,
      },
      societyId: command.societyId,
      blockingUserId: command.actor.userId,
      blockingResidentProfileId: actorEntry.residentProfileId,
      blockedUserId: target.userId,
      blockedResidentProfileId: target.residentProfileId,
      reason: command.reason,
      createdAtIso: clock.now().toISOString(),
      createdByUserId: command.actor.userId,
      revision: { revision: 1, revisionToken: 'rev-1' },
    };
    if (!blocks.insert(record)) {
      return deny('CONCURRENT_WRITE', 'block');
    }
    emitAudit(
      command.actor,
      'UPDATE',
      record.id,
      command.trace.correlationId,
      'SUCCESS',
    );
    return { ok: true, value: record, warnings: [] };
  }

  function expireStale(
    societyId: string,
    nowMs: number,
  ): readonly ContactRequestRecord[] {
    const expired: ContactRequestRecord[] = [];
    const open = contactRequests
      .listBySociety(societyId)
      .filter((request) => isContactRequestOpen(request.status));
    for (const request of open) {
      if (!isContactRequestExpired(request.status, request.expiresAtIso, nowMs)) {
        continue;
      }
      const transition = canTransitionContactRequest(request.status, 'EXPIRED');
      if (!transition.allowed) {
        continue;
      }
      const updated: ContactRequestRecord = {
        ...request,
        status: 'EXPIRED',
        closedAtIso: new Date(nowMs).toISOString(),
        channelId: undefined,
        revision: nextRevision(request.revision),
      };
      if (contactRequests.update(updated, request.revision.revision)) {
        expired.push(updated);
      }
    }
    return expired;
  }

  return {
    create,
    accept,
    reject,
    cancel,
    blockResident,
    expireStale,
    listIncoming: contactRequests.listIncoming,
    listOutgoing: contactRequests.listOutgoing,
  };
}
