import type { Absent } from '../../../shared/types/absence.types';
import type { AuditActorType } from '../../../core/audit/audit.types';
import type {
  ChannelMembershipRecord,
  ChannelRecord,
  CommunicationActor,
  CommunicationDecision,
  DeniedDecision,
  DeniedTransition,
  CommunicationErrorCode,
  CommunicationOutcome,
  CommunicationScope,
  DepartmentCode,
  GroupScopeType,
  MessageRecord,
  TraceContext,
} from '../domain/types';
import { allowedWith, denied, deniedOutcome, deniedOutcomeFromViolation, nextRevision } from '../domain/types';
import {
  canTransitionChannel,
  canTransitionMessage,
  isChannelAcceptingMessages,
  isMessageRetained,
} from '../domain/stateMachines/channelStateMachine';
import {
  evaluateActionPermission,
  evaluateChannelMembership,
  evaluateSessionFreshness,
  evaluateTenantBoundary,
} from '../domain/guards/authorizationGuard';

import type { CommunicationPorts } from './ports';

const MAXIMUM_SESSION_AGE_MS = 60 * 60 * 1000;
const MAXIMUM_BODY_LENGTH = 4000;
const MINIMUM_BODY_LENGTH = 1;
const DEFAULT_RETENTION_DAYS = 365;
const MAXIMUM_DELIVERY_ATTEMPTS = 3;

export type SendMessageCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly channelId: string;
  readonly clientMessageId: string;
  readonly bodyCiphertextRef: string;
  readonly bodyLength: number;
  readonly replyToMessageId: string | Absent;
  readonly attachments: readonly MessageRecord['attachments'][number][];
  readonly trace: TraceContext;
};

export type MarkMessageDeliveredCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly messageId: string;
  readonly trace: TraceContext;
};

export type SetChannelStatusCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly channelId: string;
  readonly trace: TraceContext;
};

export type MarkMessageReadCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly channelId: string;
  readonly messageId: string;
  readonly trace: TraceContext;
};

export type CreateGroupChannelCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly displayName: string;
  readonly description: string | Absent;
  readonly groupScopeType: GroupScopeType;
  readonly groupScopeValue: string;
  readonly memberUserIds: readonly string[];
  readonly trace: TraceContext;
};

export type CreateDepartmentChannelCommand = CommunicationScope & {
  readonly actor: CommunicationActor;
  readonly departmentCode: DepartmentCode;
  readonly displayName: string;
  readonly description: string | Absent;
  readonly memberUserIds: readonly string[];
  readonly trace: TraceContext;
};

export type ChannelSummary = {
  readonly channel: ChannelRecord;
  readonly membership: ChannelMembershipRecord;
  readonly unreadCount: number;
};

export type MessageService = {
  readonly sendMessage: (command: SendMessageCommand) => Promise<CommunicationOutcome<MessageRecord>>;
  readonly markDelivered: (command: MarkMessageDeliveredCommand) => Promise<CommunicationOutcome<MessageRecord>>;
  readonly markRead: (command: MarkMessageReadCommand) => Promise<CommunicationOutcome<MessageRecord>>;
  readonly listMessages: (
    societyId: string,
    actor: CommunicationActor,
    channelId: string,
  ) => Promise<CommunicationOutcome<readonly MessageRecord[]>>;
  readonly listChannels: (societyId: string, actor: CommunicationActor) => readonly ChannelSummary[];
  readonly createControlledGroup: (
    command: CreateGroupChannelCommand,
  ) => Promise<CommunicationOutcome<ChannelRecord>>;
  readonly createDepartmentChannel: (
    command: CreateDepartmentChannelCommand,
  ) => Promise<CommunicationOutcome<ChannelRecord>>;
  readonly suspendChannel: (command: SetChannelStatusCommand) => Promise<CommunicationOutcome<ChannelRecord>>;
  readonly closeChannel: (command: SetChannelStatusCommand) => Promise<CommunicationOutcome<ChannelRecord>>;
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

export function createMessageService(ports: CommunicationPorts): MessageService {
  const {
    clock,
    channels,
    channelMemberships,
    messages,
    readReceipts,
    unreadSummaries,
    messageDeliveryAttempts,
    audit,
    realtime,
    directoryEntries,
    privacySettings,
  } = ports;

  function auditActorType(actor: CommunicationActor): AuditActorType {
    if (actor.actorType.startsWith('RESIDENT')) {
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
    action: 'CREATE' | 'READ' | 'UPDATE',
    entityId: string,
    channelId: string,
    correlationId: string,
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
      entityType: 'COMMUNICATION_MESSAGE',
      entityId,
      metadata: { source: 'MOBILE', channelId, correlationId },
      outcome: 'SUCCESS',
    });
  }

  function requireChannel(
    societyId: string,
    channelId: string,
  ): CommunicationOutcome<ChannelRecord> {
    const channel = channels.read(channelId);
    if (channel === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'channel');
    }
    if (channel.societyId !== societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'channel.societyId');
    }
    return { ok: true, value: channel, warnings: [] };
  }

  function requireMembership(
    channel: ChannelRecord,
    userId: string,
    requireActive: boolean,
  ): CommunicationOutcome<ChannelMembershipRecord> {
    const membership = channelMemberships.findMembership(channel.id, userId);
    if (membership === undefined) {
      return deny('CHANNEL_MEMBERSHIP_REQUIRED', 'channelMembership');
    }
    if (requireActive) {
      const decision = evaluateChannelMembership(userId, channel, membership);
      if (!decision.allowed) {
        return denyDecision(decision);
      }
    }
    return { ok: true, value: membership, warnings: [] };
  }

  async function sendMessage(
    command: SendMessageCommand,
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
    const permission = evaluateActionPermission(command.actor.role, 'SEND_MESSAGE');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    if (command.clientMessageId.trim().length === 0) {
      return deny('VALIDATION_FAILED', 'clientMessageId');
    }
    if (command.bodyCiphertextRef.trim().length === 0 || command.bodyLength === 0) {
      return deny('MESSAGE_EMPTY', 'bodyCiphertextRef');
    }
    if (
      command.bodyLength < MINIMUM_BODY_LENGTH ||
      command.bodyLength > MAXIMUM_BODY_LENGTH
    ) {
      return deny('MESSAGE_TOO_LONG', 'bodyLength');
    }

    const existing = messages.findByClientMessageId(
      command.societyId,
      command.clientMessageId,
    );
    if (existing !== undefined) {
      if (existing.senderUserId !== command.actor.userId) {
        return deny('IDEMPOTENCY_KEY_CONFLICT', 'clientMessageId');
      }
      return { ok: true, value: existing, warnings: ['REPLAYED_CLIENT_MESSAGE'] };
    }

    const channel = requireChannel(command.societyId, command.channelId);
    if (!channel.ok) {
      return channel;
    }
    if (!isChannelAcceptingMessages(channel.value.status)) {
      return deny('CHANNEL_NOT_ACTIVE', 'channel.status');
    }
    const membership = requireMembership(channel.value, command.actor.userId, true);
    if (!membership.ok) {
      return membership;
    }

    const nowIso = clock.now().toISOString();
    const expiresAtIso = new Date(
      clock.now().getTime() + channel.value.retentionDays * 24 * 60 * 60 * 1000,
    ).toISOString();
    const message: MessageRecord = {
      id: `message-${command.clientMessageId}`,
      scope: channel.value.scope,
      societyId: command.societyId,
      channelId: command.channelId,
      clientMessageId: command.clientMessageId,
      senderUserId: command.actor.userId,
      senderResidentProfileId: membership.value.residentProfileId,
      bodyCiphertextRef: command.bodyCiphertextRef,
      bodyLength: command.bodyLength,
      attachments: command.attachments,
      replyToMessageId: command.replyToMessageId,
      deliveryState: 'QUEUED',
      sequence: messages.nextSequence(command.channelId),
      createdAtIso: nowIso,
      sentAtIso: undefined,
      deliveredAtIso: undefined,
      readAtIso: undefined,
      failedAtIso: undefined,
      failureReason: undefined,
      expiresAtIso,
      withdrawnAtIso: undefined,
      revision: { revision: 1, revisionToken: 'rev-1' },
    };
    if (!messages.insert(message)) {
      return deny('CONCURRENT_WRITE', 'message');
    }

    emitAudit(
      command.actor,
      'CREATE',
      message.id,
      command.channelId,
      command.trace.correlationId,
    );
    realtime.publish(command.channelId, {
      kind: 'MESSAGE_CREATED',
      messageId: message.id,
      sequence: message.sequence,
    });

    const sent: MessageRecord = { ...message, deliveryState: 'SENT', sentAtIso: nowIso };
    messages.update(sent, message.revision.revision);
    return { ok: true, value: sent, warnings: [] };
  }

  async function markDelivered(
    command: MarkMessageDeliveredCommand,
  ): Promise<CommunicationOutcome<MessageRecord>> {
    const message = messages.read(command.messageId);
    if (message === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'message');
    }
    if (message.societyId !== command.societyId) {
      return deny('CROSS_SOCIETY_BLOCKED', 'message.societyId');
    }
    const transition = canTransitionMessage(message.deliveryState, 'DELIVERED');
    if (!transition.allowed) {
      return denyTransition(transition);
    }
    const delivered: MessageRecord = {
      ...message,
      deliveryState: 'DELIVERED',
      deliveredAtIso: clock.now().toISOString(),
      revision: nextRevision(message.revision),
    };
    if (!messages.update(delivered, message.revision.revision)) {
      return deny('CONCURRENT_WRITE', 'message');
    }
    realtime.publish(message.channelId, {
      kind: 'MESSAGE_STATE_CHANGED',
      messageId: message.id,
      state: 'DELIVERED',
    });
    return { ok: true, value: delivered, warnings: [] };
  }

  async function markRead(
    command: MarkMessageReadCommand,
  ): Promise<CommunicationOutcome<MessageRecord>> {
    const permission = evaluateActionPermission(command.actor.role, 'READ_MESSAGE');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const channel = requireChannel(command.societyId, command.channelId);
    if (!channel.ok) {
      return channel;
    }
    const membership = requireMembership(channel.value, command.actor.userId, true);
    if (!membership.ok) {
      return membership;
    }
    const message = messages.read(command.messageId);
    if (message === undefined) {
      return deny('AGGREGATE_NOT_FOUND', 'message');
    }
    if (message.channelId !== command.channelId) {
      return deny('IDOR_BLOCKED', 'message.channelId');
    }
    const nowIso = clock.now().toISOString();
    readReceipts.insert({
      id: `read-${message.id}-${command.actor.userId}`,
      societyId: command.societyId,
      messageId: message.id,
      channelId: command.channelId,
      readerUserId: command.actor.userId,
      readAtIso: nowIso,
    });
    if (message.deliveryState === 'DELIVERED') {
      const read: MessageRecord = {
        ...message,
        deliveryState: 'READ',
        readAtIso: nowIso,
        revision: nextRevision(message.revision),
      };
      if (messages.update(read, message.revision.revision)) {
        realtime.publish(command.channelId, {
          kind: 'MESSAGE_STATE_CHANGED',
          messageId: message.id,
          state: 'READ',
        });
        return { ok: true, value: read, warnings: [] };
      }
    }
    return { ok: true, value: message, warnings: [] };
  }

  async function listMessages(
    societyId: string,
    actor: CommunicationActor,
    channelId: string,
  ): Promise<CommunicationOutcome<readonly MessageRecord[]>> {
    const permission = evaluateActionPermission(actor.role, 'READ_MESSAGE');
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const channel = requireChannel(societyId, channelId);
    if (!channel.ok) {
      return channel;
    }
    const membership = requireMembership(channel.value, actor.userId, true);
    if (!membership.ok) {
      return membership;
    }
    const nowMs = clock.now().getTime();
    const retained = messages
      .listByChannel(channelId)
      .filter(
        (message) =>
          message.withdrawnAtIso === undefined &&
          isMessageRetained(message.deliveryState, message.expiresAtIso, nowMs),
      )
      .slice()
      .sort((a, b) => a.sequence - b.sequence);
    return { ok: true, value: retained, warnings: [] };
  }

  function listChannels(
    societyId: string,
    actor: CommunicationActor,
  ): readonly ChannelSummary[] {
    return channels
      .listByUser(societyId, actor.userId)
      .map((channel) => {
        const membership = channelMemberships.findMembership(channel.id, actor.userId);
        if (membership === undefined || membership.status !== 'ACTIVE') {
          return undefined;
        }
        const summary = unreadSummaries.read(societyId, channel.id, actor.userId);
        return {
          channel,
          membership,
          unreadCount: summary === undefined ? 0 : summary.unreadCount,
        };
      })
      .filter((value): value is ChannelSummary => value !== undefined);
  }

  function validateGroupInvites(
    societyId: string,
    actorUserId: string,
    memberUserIds: readonly string[],
  ): CommunicationOutcome<true> {
    const entries = directoryEntries.listBySociety(societyId);
    for (const memberUserId of memberUserIds) {
      if (memberUserId === actorUserId) {
        continue;
      }
      const entry = entries.find((candidate) => candidate.userId === memberUserId);
      if (entry === undefined) {
        return deny('AGGREGATE_NOT_FOUND', 'memberUserIds');
      }
      if (entry.occupancyStatus !== 'ACTIVE') {
        return deny('INACTIVE_RESIDENT_BLOCKED', 'memberUserIds');
      }
      if (!entry.groupInvitesAllowed) {
        return deny('PRIVACY_OPT_OUT_BLOCKED', 'memberUserIds');
      }
      const privacy = privacySettings.read(societyId, entry.residentProfileId);
      if (privacy !== undefined && !privacy.allowGroupInvite) {
        return deny('PRIVACY_OPT_OUT_BLOCKED', 'memberUserIds');
      }
    }
    return { ok: true, value: true, warnings: [] };
  }

  function createChannel(
    actor: CommunicationActor,
    scope: CommunicationScope,
    kind: ChannelRecord['kind'],
    displayName: string,
    description: string | Absent,
    groupScopeType: GroupScopeType | Absent,
    groupScopeValue: string | Absent,
    departmentCode: DepartmentCode | Absent,
    memberUserIds: readonly string[],
    memberRole: ChannelMembershipRecord['memberRole'],
  ): CommunicationOutcome<ChannelRecord> {
    const nowIso = clock.now().toISOString();
    const uniqueMemberIds = Array.from(new Set(memberUserIds));
    if (uniqueMemberIds.length === 0) {
      return deny('VALIDATION_FAILED', 'memberUserIds');
    }
    if (!uniqueMemberIds.includes(actor.userId)) {
      uniqueMemberIds.push(actor.userId);
    }
    const inviteCheck = validateGroupInvites(scope.societyId, actor.userId, uniqueMemberIds);
    if (!inviteCheck.ok) {
      return inviteCheck;
    }
    const channel: ChannelRecord = {
      id: `channel-${kind.toLowerCase()}-${scope.owningEntityId}-${nowIso}`,
      scope,
      societyId: scope.societyId,
      kind,
      displayName,
      description,
      status: 'ACTIVE',
      groupScopeType,
      groupScopeValue,
      departmentCode,
      contactRequestId: undefined,
      createdByUserId: actor.userId,
      createdAtIso: nowIso,
      closedAtIso: undefined,
      retentionDays: DEFAULT_RETENTION_DAYS,
      revision: { revision: 1, revisionToken: 'rev-1' },
    };
    if (!channels.insert(channel)) {
      return deny('CHANNEL_ALREADY_EXISTS', 'channel');
    }
    for (const memberUserId of uniqueMemberIds) {
      const directoryEntry = directoryEntries
        .listBySociety(scope.societyId)
        .find((entry) => entry.userId === memberUserId);
      const membership: ChannelMembershipRecord = {
        id: `membership-${channel.id}-${memberUserId}`,
        scope,
        societyId: scope.societyId,
        channelId: channel.id,
        userId: memberUserId,
        residentProfileId: directoryEntry === undefined ? undefined : directoryEntry.residentProfileId,
        unitId: directoryEntry === undefined ? undefined : directoryEntry.unitId,
        memberRole: memberUserId === actor.userId ? memberRole : 'MEMBER',
        status: 'ACTIVE',
        joinedAtIso: nowIso,
        removedAtIso: undefined,
        removedByUserId: undefined,
        revision: { revision: 1, revisionToken: 'rev-1' },
      };
      channelMemberships.insert(membership);
    }
    return { ok: true, value: channel, warnings: [] };
  }

  async function createControlledGroup(
    command: CreateGroupChannelCommand,
  ): Promise<CommunicationOutcome<ChannelRecord>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const permission = evaluateActionPermission(
      command.actor.role,
      'MANAGE_CONTROLLED_GROUP',
    );
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    const result = createChannel(
      command.actor,
      {
        societyId: command.societyId,
        owningEntityType: 'CONTROLLED_GROUP',
        owningEntityId: `${command.groupScopeType}:${command.groupScopeValue}`,
      },
      'CONTROLLED_GROUP',
      command.displayName,
      command.description,
      command.groupScopeType,
      command.groupScopeValue,
      undefined,
      command.memberUserIds,
      'MANAGER',
    );
    return result;
  }

  async function createDepartmentChannel(
    command: CreateDepartmentChannelCommand,
  ): Promise<CommunicationOutcome<ChannelRecord>> {
    const tenant = evaluateTenantBoundary(command.actor.societyId, command.societyId);
    if (!tenant.allowed) {
      return denyDecision(tenant);
    }
    const permission = evaluateActionPermission(
      command.actor.role,
      'MANAGE_DEPARTMENT_CHANNEL',
    );
    if (!permission.allowed) {
      return denyDecision(permission);
    }
    return createChannel(
      command.actor,
      {
        societyId: command.societyId,
        owningEntityType: 'DEPARTMENT',
        owningEntityId: command.departmentCode,
      },
      'DEPARTMENT',
      command.displayName,
      command.description,
      undefined,
      undefined,
      command.departmentCode,
      command.memberUserIds,
      'MANAGER',
    );
  }

  async function setChannelStatus(
    command: SetChannelStatusCommand,
    next: ChannelRecord['status'],
  ): Promise<CommunicationOutcome<ChannelRecord>> {
    const channel = requireChannel(command.societyId, command.channelId);
    if (!channel.ok) {
      return channel;
    }
    const authority = evaluateChannelAuthority(command.actor.userId, channel.value);
    if (!authority.allowed) {
      return denyDecision(authority);
    }
    const transition = canTransitionChannel(channel.value.status, next);
    if (!transition.allowed) {
      return denyTransition(transition);
    }
    const updated: ChannelRecord = {
      ...channel.value,
      status: next,
      closedAtIso: next === 'CLOSED' ? clock.now().toISOString() : undefined,
      revision: nextRevision(channel.value.revision),
    };
    if (!channels.update(updated, channel.value.revision.revision)) {
      return deny('CONCURRENT_WRITE', 'channel');
    }
    realtime.publish(updated.id, {
      kind: 'CHANNEL_STATE_CHANGED',
      channelId: updated.id,
      state: next,
    });
    return { ok: true, value: updated, warnings: [] };
  }

  function evaluateChannelAuthority(
    actorUserId: string,
    channel: ChannelRecord,
  ): CommunicationDecision {
    if (channel.kind === 'PRIVATE_DIRECT') {
      return denied([
        {
          code: 'MODERATION_SCOPE_BLOCKED',
          field: 'channel.kind',
          blocking: true,
          detail: 'A direct channel is closed only through a moderation action.',
        },
      ]);
    }
    const membership = channelMemberships.findMembership(channel.id, actorUserId);
    if (
      membership !== undefined &&
      membership.status === 'ACTIVE' &&
      (membership.memberRole === 'MANAGER' || membership.memberRole === 'MODERATOR')
    ) {
      return allowedWith([]);
    }
    return denied([
      {
        code: 'ACTOR_NOT_AUTHORIZED',
        field: 'channelMembership.memberRole',
        blocking: true,
        detail: 'Only an active channel manager or moderator may change channel status.',
      },
    ]);
  }

  function suspendChannel(
    command: SetChannelStatusCommand,
  ): Promise<CommunicationOutcome<ChannelRecord>> {
    return setChannelStatus(command, 'SUSPENDED');
  }

  function closeChannel(
    command: SetChannelStatusCommand,
  ): Promise<CommunicationOutcome<ChannelRecord>> {
    return setChannelStatus(command, 'CLOSED');
  }

  return {
    sendMessage,
    markDelivered,
    markRead,
    listMessages,
    listChannels,
    createControlledGroup,
    createDepartmentChannel,
    suspendChannel,
    closeChannel,
  };
}

export const MAXIMUM_MESSAGE_DELIVERY_ATTEMPTS = MAXIMUM_DELIVERY_ATTEMPTS;
