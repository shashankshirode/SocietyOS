import type { Absent } from '../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../core/audit/audit.types';
import type {
  BlockStore,
  ChannelMembershipStore,
  ChannelStore,
  ChannelUnreadStore,
  ContactAcceptancePort,
  ContactRequestStore,
  DirectoryEntryStore,
  IdempotencyStore,
  MessageDeliveryAttemptStore,
  MessageReadReceiptStore,
  MessageStore,
  ModerationAccessGrantStore,
  ModerationAuditStore,
  ModerationCaseStore,
  ModerationEvidenceStore,
  NoticeAcknowledgementStore,
  NoticeAudienceStore,
  NoticeDeliveryAttemptStore,
  NoticeRecipientStore,
  NoticeRevisionStore,
  NoticeStore,
  PrivacySettingsStore,
  QueuedMessageStore,
  RealtimeTransportPort,
  AuditSink,
} from '../application/ports';
import type {
  ChannelDeliveryAttempt,
  ChannelMembershipRecord,
  ChannelRecord,
  ChannelUnreadSummary,
  ContactRequestRecord,
  MessageReadReceipt,
  MessageRecord,
  ModerationAccessGrant,
  ModerationAuditEntry,
  ModerationCase,
  ModerationEvidence,
  NoticeAcknowledgement,
  NoticeAudienceSnapshot,
  NoticeDeliveryAttempt,
  NoticeRecipientRecord,
  NoticeRecord,
  NoticeRevisionRecord,
  QueuedMessageIntent,
  ResidentBlock,
  ResidentDirectoryEntry,
  ResidentPrivacySettings,
  CommunicationClock,
} from '../domain/types';

type Revisioned = { readonly revision: { readonly revision: number } };
type NumericallyRevisioned = { readonly revision: number };

function casRevisioned<T extends Revisioned>(current: T, expected: number): boolean {
  return current.revision.revision === expected;
}

function casNumeric<T extends NumericallyRevisioned>(current: T, expected: number): boolean {
  return current.revision === expected;
}

function upsertMap<T>(map: Map<string, T>, record: T, id: string): boolean {
  if (map.has(id)) {
    return false;
  }
  map.set(id, record);
  return true;
}

export type InMemoryCommunicationRepository = {
  readonly directoryEntries: DirectoryEntryStore;
  readonly privacySettings: PrivacySettingsStore;
  readonly blocks: BlockStore;
  readonly contactRequests: ContactRequestStore;
  readonly contactAcceptance: ContactAcceptancePort;
  readonly channels: ChannelStore;
  readonly channelMemberships: ChannelMembershipStore;
  readonly messages: MessageStore;
  readonly readReceipts: MessageReadReceiptStore;
  readonly unreadSummaries: ChannelUnreadStore;
  readonly messageDeliveryAttempts: MessageDeliveryAttemptStore;
  readonly queuedMessages: QueuedMessageStore;
  readonly moderationCases: ModerationCaseStore;
  readonly moderationEvidence: ModerationEvidenceStore;
  readonly moderationAccessGrants: ModerationAccessGrantStore;
  readonly moderationAudit: ModerationAuditStore;
  readonly notices: NoticeStore;
  readonly noticeRevisions: NoticeRevisionStore;
  readonly noticeAudiences: NoticeAudienceStore;
  readonly noticeRecipients: NoticeRecipientStore;
  readonly noticeDeliveryAttempts: NoticeDeliveryAttemptStore;
  readonly noticeAcknowledgements: NoticeAcknowledgementStore;
  readonly audit: AuditSink;
  readonly idempotency: IdempotencyStore;
  readonly realtime: RealtimeTransportPort;
  readonly clock: CommunicationClock;
  readonly advanceClockTo: (instant: Date) => void;
};

export function createInMemoryCommunicationRepository(
  initialNow: Date,
): InMemoryCommunicationRepository {
  const entryMap = new Map<string, ResidentDirectoryEntry>();
  const privacyMap = new Map<string, ResidentPrivacySettings>();
  const blockMap = new Map<string, ResidentBlock>();
  const requestMap = new Map<string, ContactRequestRecord>();
  const channelMap = new Map<string, ChannelRecord>();
  const membershipMap = new Map<string, ChannelMembershipRecord>();
  const membershipIdMap = new Map<string, ChannelMembershipRecord>();
  const messageMap = new Map<string, MessageRecord>();
  const messageClientIndex = new Map<string, string>();
  const receiptMap = new Map<string, MessageReadReceipt>();
  const unreadMap = new Map<string, ChannelUnreadSummary>();
  const attemptMap = new Map<string, ChannelDeliveryAttempt>();
  const queuedMap = new Map<string, QueuedMessageIntent>();
  const caseMap = new Map<string, ModerationCase>();
  const evidenceMap = new Map<string, ModerationEvidence>();
  const grantMap = new Map<string, ModerationAccessGrant>();
  const moderationAuditMap = new Map<string, ModerationAuditEntry>();
  const noticeMap = new Map<string, NoticeRecord>();
  const noticeRevisionMap = new Map<string, NoticeRevisionRecord>();
  const noticeAudienceMap = new Map<string, NoticeAudienceSnapshot>();
  const noticeRecipientMap = new Map<string, NoticeRecipientRecord>();
  const noticeAttemptMap = new Map<string, NoticeDeliveryAttempt>();
  const noticeAckMap = new Map<string, NoticeAcknowledgement>();
  const auditLog: AuditLogEntry[] = [];
  const idempotencyMap = new Map<string, { readonly fingerprint: string; readonly aggregateId: string }>();
  const realtimeEvents: { readonly channelId: string; readonly kind: string }[] = [];
  let nowMs = initialNow.getTime();

  const clock: CommunicationClock = {
    now: (): Date => new Date(nowMs),
  };

  function idempotencyKey(societyId: string, key: string): string {
    return `${societyId}::${key}`;
  }

  function privacyKey(societyId: string, residentProfileId: string): string {
    return `${societyId}::${residentProfileId}`;
  }

  function membershipKey(channelId: string, userId: string): string {
    return `${channelId}::${userId}`;
  }

  function unreadKey(societyId: string, channelId: string, userId: string): string {
    return `${societyId}::${channelId}::${userId}`;
  }

  const directoryEntries: DirectoryEntryStore = {
    insert: (entry) => upsertMap(entryMap, entry, entry.id),
    update: (entry, expectedRevision) => {
      const current = entryMap.get(entry.id);
      if (current === undefined || !casRevisioned(current, expectedRevision)) {
        return false;
      }
      entryMap.set(entry.id, entry);
      return true;
    },
    read: (entryId) => entryMap.get(entryId),
    readByResidentProfileId: (societyId, residentProfileId) =>
      findValue(entryMap, (entry) =>
        entry.societyId === societyId && entry.residentProfileId === residentProfileId,
      ),
    readByUserId: (societyId, userId) =>
      findValue(entryMap, (entry) => entry.societyId === societyId && entry.userId === userId),
    listBySociety: (societyId) =>
      listValues(entryMap, (entry) => entry.societyId === societyId),
    listByUnit: (societyId, unitId) =>
      listValues(
        entryMap,
        (entry) => entry.societyId === societyId && entry.unitId === unitId,
      ),
    listByTower: (societyId, towerOrWing) =>
      listValues(
        entryMap,
        (entry) => entry.societyId === societyId && entry.towerOrWing === towerOrWing,
      ),
  };

  const privacySettings: PrivacySettingsStore = {
    upsert: (settings) => {
      privacyMap.set(
        privacyKey(settings.societyId, settings.residentProfileId),
        settings,
      );
      return true;
    },
    read: (societyId, residentProfileId) =>
      privacyMap.get(privacyKey(societyId, residentProfileId)),
    listBySociety: (societyId) =>
      listValues(privacyMap, (settings) => settings.societyId === societyId),
  };

  const blocks: BlockStore = {
    insert: (block) => upsertMap(blockMap, block, block.id),
    read: (blockId) => blockMap.get(blockId),
    listByUser: (societyId, userId) =>
      listValues(
        blockMap,
        (block) =>
          block.societyId === societyId &&
          (block.blockingUserId === userId || block.blockedUserId === userId),
      ),
    findPair: (societyId, profileIdA, profileIdB) =>
      findValue(
        blockMap,
        (block) =>
          block.societyId === societyId &&
          ((block.blockingResidentProfileId === profileIdA &&
            block.blockedResidentProfileId === profileIdB) ||
            (block.blockingResidentProfileId === profileIdB &&
              block.blockedResidentProfileId === profileIdA)),
      ),
  };

  const contactRequests: ContactRequestStore = {
    insert: (request) => upsertMap(requestMap, request, request.id),
    update: (request, expectedRevision) => {
      const current = requestMap.get(request.id);
      if (current === undefined || !casRevisioned(current, expectedRevision)) {
        return false;
      }
      requestMap.set(request.id, request);
      return true;
    },
    read: (requestId) => requestMap.get(requestId),
    findByIdempotencyKey: (societyId, key) => {
      const matchedId = idempotencyMap.get(idempotencyKey(societyId, key))?.aggregateId;
      if (matchedId === undefined || matchedId.length === 0) {
        return undefined;
      }
      return requestMap.get(matchedId);
    },
    listOutgoing: (societyId, requesterUserId) =>
      listValues(
        requestMap,
        (request) =>
          request.societyId === societyId && request.requesterUserId === requesterUserId,
      ),
    listIncoming: (societyId, recipientUserId) =>
      listValues(
        requestMap,
        (request) =>
          request.societyId === societyId && request.recipientUserId === recipientUserId,
      ),
    listOpenForResident: (societyId, residentProfileId) =>
      listValues(
        requestMap,
        (request) =>
          request.societyId === societyId &&
          (request.requesterResidentProfileId === residentProfileId ||
            request.recipientResidentProfileId === residentProfileId),
      ),
    listByPair: (pair) =>
      listValues(
        requestMap,
        (request) =>
          request.societyId === pair.societyId &&
          ((request.requesterResidentProfileId === pair.residentProfileIdA &&
            request.recipientResidentProfileId === pair.residentProfileIdB) ||
            (request.requesterResidentProfileId === pair.residentProfileIdB &&
              request.recipientResidentProfileId === pair.residentProfileIdA)),
      ),
    listBySociety: (societyId) =>
      listValues(requestMap, (request) => request.societyId === societyId),
  };

  const channels: ChannelStore = {
    insert: (channel) => upsertMap(channelMap, channel, channel.id),
    update: (channel, expectedRevision) => {
      const current = channelMap.get(channel.id);
      if (current === undefined || !casRevisioned(current, expectedRevision)) {
        return false;
      }
      channelMap.set(channel.id, channel);
      return true;
    },
    read: (channelId) => channelMap.get(channelId),
    findByContactRequest: (contactRequestId) =>
      findValue(
        channelMap,
        (channel) =>
          channel.contactRequestId !== undefined &&
          channel.contactRequestId === contactRequestId,
      ),
    findDirectByPair: (societyId, residentProfileIdA, residentProfileIdB) =>
      findValue(
        channelMap,
        (channel) =>
          channel.societyId === societyId &&
          channel.kind === 'PRIVATE_DIRECT' &&
          channel.status !== 'CLOSED' &&
          hasPairMemberships(channel.id, residentProfileIdA, residentProfileIdB),
      ),
    listBySociety: (societyId) =>
      listValues(channelMap, (channel) => channel.societyId === societyId),
    listByUser: (societyId, userId) =>
      listValues(
        channelMap,
        (channel) =>
          channel.societyId === societyId && hasActiveMembership(channel.id, userId),
      ),
  };

  const channelMemberships: ChannelMembershipStore = {
    insert: (membership) =>
      upsertMap(membershipMap, membership, membershipKey(membership.channelId, membership.userId)),
    update: (membership, expectedRevision) => {
      const key = membershipKey(membership.channelId, membership.userId);
      const current = membershipMap.get(key);
      if (current === undefined || !casRevisioned(current, expectedRevision)) {
        return false;
      }
      membershipMap.set(key, membership);
      membershipIdMap.set(membership.id, membership);
      return true;
    },
    read: (membershipId) => membershipIdMap.get(membershipId),
    findMembership: (channelId, userId) =>
      membershipMap.get(membershipKey(channelId, userId)),
    listByChannel: (channelId) =>
      listValues(membershipMap, (membership) => membership.channelId === channelId),
    listByUser: (societyId, userId) =>
      listValues(
        membershipMap,
        (membership) => membership.societyId === societyId && membership.userId === userId,
      ),
    countActiveManagers: (channelId) =>
      listValues(
        membershipMap,
        (membership) =>
          membership.channelId === channelId &&
          membership.status === 'ACTIVE' &&
          (membership.memberRole === 'MANAGER' || membership.memberRole === 'MODERATOR'),
      ).length,
  };

  const messages: MessageStore = {
    insert: (message) => {
      if (!upsertMap(messageMap, message, message.id)) {
        return false;
      }
      messageClientIndex.set(
        `${message.societyId}::${message.clientMessageId}`,
        message.id,
      );
      return true;
    },
    update: (message, expectedRevision) => {
      const current = messageMap.get(message.id);
      if (current === undefined || !casRevisioned(current, expectedRevision)) {
        return false;
      }
      messageMap.set(message.id, message);
      return true;
    },
    read: (messageId) => messageMap.get(messageId),
    findByClientMessageId: (societyId, clientMessageId) => {
      const matchedId = messageClientIndex.get(`${societyId}::${clientMessageId}`);
      if (matchedId === undefined) {
        return undefined;
      }
      return messageMap.get(matchedId);
    },
    listByChannel: (channelId) =>
      listValues(
        messageMap,
        (message) => message.channelId === channelId,
      ).sort((left, right) => left.sequence - right.sequence),
    listExpiredBefore: (cutoffIso) =>
      listValues(messageMap, (message) => message.expiresAtIso <= cutoffIso),
    nextSequence: (channelId) =>
      listValues(messageMap, (message) => message.channelId === channelId).reduce(
        (highest, message) => (message.sequence > highest ? message.sequence : highest),
        0,
      ) + 1,
  };

  const readReceipts: MessageReadReceiptStore = {
    insert: (receipt) => upsertMap(receiptMap, receipt, receipt.id),
    listByMessage: (messageId) =>
      listValues(receiptMap, (receipt) => receipt.messageId === messageId),
    listByReader: (societyId, userId) =>
      listValues(
        receiptMap,
        (receipt) => receipt.societyId === societyId && receipt.readerUserId === userId,
      ),
  };

  const unreadSummaries: ChannelUnreadStore = {
    read: (societyId, channelId, userId) =>
      unreadMap.get(unreadKey(societyId, channelId, userId)),
    upsert: (summary) => {
      unreadMap.set(
        unreadKey(summary.societyId, summary.channelId, summary.userId),
        summary,
      );
      return true;
    },
    listByUser: (societyId, userId) =>
      listValues(
        unreadMap,
        (summary) => summary.societyId === societyId && summary.userId === userId,
      ),
  };

  const messageDeliveryAttempts: MessageDeliveryAttemptStore = {
    insert: (attempt) => upsertMap(attemptMap, attempt, attempt.id),
    listByMessage: (messageId) =>
      listValues(attemptMap, (attempt) => attempt.messageId === messageId),
    countByMessage: (messageId) =>
      listValues(attemptMap, (attempt) => attempt.messageId === messageId).length,
  };

  const queuedMessages: QueuedMessageStore = {
    upsert: (intent) => {
      queuedMap.set(intent.id, intent);
      return true;
    },
    read: (queuedId) => queuedMap.get(queuedId),
    listPending: (societyId) =>
      listValues(queuedMap, (intent) => intent.societyId === societyId),
  };

  const moderationCases: ModerationCaseStore = {
    insert: (moderationCase) => upsertMap(caseMap, moderationCase, moderationCase.id),
    update: (moderationCase, expectedRevision) => {
      const current = caseMap.get(moderationCase.id);
      if (current === undefined || !casRevisioned(current, expectedRevision)) {
        return false;
      }
      caseMap.set(moderationCase.id, moderationCase);
      return true;
    },
    read: (caseId) => caseMap.get(caseId),
    listBySociety: (societyId) =>
      listValues(caseMap, (moderationCase) => moderationCase.societyId === societyId),
    listByTarget: (societyId, targetId) =>
      listValues(
        caseMap,
        (moderationCase) =>
          moderationCase.societyId === societyId && moderationCase.targetId === targetId,
      ),
    findByIdempotencyKey: (societyId, key) => {
      const matchedId = idempotencyMap.get(idempotencyKey(societyId, key))?.aggregateId;
      if (matchedId === undefined || matchedId.length === 0) {
        return undefined;
      }
      return caseMap.get(matchedId);
    },
  };

  const moderationEvidence: ModerationEvidenceStore = {
    insert: (evidence) => upsertMap(evidenceMap, evidence, evidence.evidenceId),
    read: (evidenceId) => evidenceMap.get(evidenceId),
    listByCase: (caseId) =>
      listValues(evidenceMap, (evidence) => evidence.caseId === caseId),
  };

  const moderationAccessGrants: ModerationAccessGrantStore = {
    insert: (grant) => upsertMap(grantMap, grant, grant.id),
    read: (grantId) => grantMap.get(grantId),
    findActiveForCase: (caseId, moderatorUserId) =>
      findValue(
        grantMap,
        (grant) =>
          grant.caseId === caseId &&
          grant.moderatorUserId === moderatorUserId &&
          grant.revokedAtIso === undefined,
      ),
    listByCase: (caseId) =>
      listValues(grantMap, (grant) => grant.caseId === caseId),
  };

  const moderationAudit: ModerationAuditStore = {
    append: (entry) => upsertMap(moderationAuditMap, entry, entry.id),
    listByCase: (caseId) =>
      listValues(moderationAuditMap, (entry) => entry.caseId === caseId),
    listBySociety: (societyId) =>
      listValues(moderationAuditMap, (entry) => entry.societyId === societyId),
  };

  const notices: NoticeStore = {
    insert: (notice) => upsertMap(noticeMap, notice, notice.id),
    update: (notice, expectedRevision) => {
      const current = noticeMap.get(notice.id);
      if (current === undefined || !casRevisioned(current, expectedRevision)) {
        return false;
      }
      noticeMap.set(notice.id, notice);
      return true;
    },
    read: (noticeId) => noticeMap.get(noticeId),
    findByIdempotencyKey: (societyId, key) => {
      const matchedId = idempotencyMap.get(idempotencyKey(societyId, key))?.aggregateId;
      if (matchedId === undefined || matchedId.length === 0) {
        return undefined;
      }
      return noticeMap.get(matchedId);
    },
    listBySociety: (societyId) =>
      listValues(noticeMap, (notice) => notice.societyId === societyId),
    listScheduledDue: (cutoffIso) =>
      listValues(
        noticeMap,
        (notice) =>
          notice.status === 'SCHEDULED' &&
          notice.scheduledPublishAtIso !== undefined &&
          notice.scheduledPublishAtIso <= cutoffIso,
      ),
    listExpiringBefore: (cutoffIso) =>
      listValues(
        noticeMap,
        (notice) =>
          notice.effectiveUntilIso !== undefined &&
          notice.effectiveUntilIso <= cutoffIso &&
          notice.status !== 'EXPIRED' &&
          notice.status !== 'WITHDRAWN',
      ),
  };

  const noticeRevisions: NoticeRevisionStore = {
    insert: (revision) => upsertMap(noticeRevisionMap, revision, revision.id),
    read: (revisionId) => noticeRevisionMap.get(revisionId),
    listByNotice: (noticeId) =>
      listValues(
        noticeRevisionMap,
        (revision) => revision.noticeId === noticeId,
      ).sort((left, right) => left.revision - right.revision),
  };

  const noticeAudiences: NoticeAudienceStore = {
    insert: (snapshot) => upsertMap(noticeAudienceMap, snapshot, snapshot.id),
    read: (snapshotId) => noticeAudienceMap.get(snapshotId),
    listByNotice: (noticeId) =>
      listValues(noticeAudienceMap, (snapshot) => snapshot.noticeId === noticeId),
  };

  const noticeRecipients: NoticeRecipientStore = {
    insert: (recipient) => upsertMap(noticeRecipientMap, recipient, recipient.id),
    update: (recipient, expectedRevision) => {
      const current = noticeRecipientMap.get(recipient.id);
      if (current === undefined || !casNumeric(current, expectedRevision)) {
        return false;
      }
      noticeRecipientMap.set(recipient.id, recipient);
      return true;
    },
    read: (recipientId) => noticeRecipientMap.get(recipientId),
    findByNoticeAndResident: (noticeId, residentProfileId) =>
      findValue(
        noticeRecipientMap,
        (recipient) =>
          recipient.noticeId === noticeId &&
          recipient.residentProfileId === residentProfileId,
      ),
    listByNotice: (noticeId) =>
      listValues(noticeRecipientMap, (recipient) => recipient.noticeId === noticeId),
    listPendingByNotice: (noticeId) =>
      listValues(
        noticeRecipientMap,
        (recipient) =>
          recipient.noticeId === noticeId &&
          (recipient.state === 'PENDING' || recipient.state === 'QUEUED'),
      ),
  };

  const noticeDeliveryAttempts: NoticeDeliveryAttemptStore = {
    insert: (attempt) => upsertMap(noticeAttemptMap, attempt, attempt.id),
    listByRecipient: (recipientId) =>
      listValues(noticeAttemptMap, (attempt) => attempt.recipientId === recipientId),
    countByRecipient: (recipientId) =>
      listValues(noticeAttemptMap, (attempt) => attempt.recipientId === recipientId).length,
  };

  const noticeAcknowledgements: NoticeAcknowledgementStore = {
    insert: (acknowledgement) =>
      upsertMap(noticeAckMap, acknowledgement, acknowledgement.id),
    read: (acknowledgementId) => noticeAckMap.get(acknowledgementId),
    findByNoticeAndResident: (noticeId, residentProfileId) =>
      findValue(
        noticeAckMap,
        (acknowledgement) =>
          acknowledgement.noticeId === noticeId &&
          acknowledgement.residentProfileId === residentProfileId,
      ),
    listByNotice: (noticeId) =>
      listValues(noticeAckMap, (acknowledgement) => acknowledgement.noticeId === noticeId),
  };

  const audit: AuditSink = {
    emit: (entry) => {
      auditLog.push(entry);
    },
    list: (societyId) =>
      auditLog.filter((entry) => entry.actor.societyId === societyId),
  };

  const idempotency: IdempotencyStore = {
    claim: (societyId, key, fingerprint) => {
      const composite = idempotencyKey(societyId, key);
      const existing = idempotencyMap.get(composite);
      if (existing !== undefined) {
        return existing.fingerprint === fingerprint;
      }
      idempotencyMap.set(composite, { fingerprint, aggregateId: '' });
      return true;
    },
    bindAggregate: (societyId, key, aggregateId) => {
      const composite = idempotencyKey(societyId, key);
      const existing = idempotencyMap.get(composite);
      if (existing === undefined) {
        return;
      }
      idempotencyMap.set(composite, { fingerprint: existing.fingerprint, aggregateId });
    },
    release: (societyId, key) => idempotencyMap.delete(idempotencyKey(societyId, key)),
  };

  const realtime: RealtimeTransportPort = {
    available: false,
    publish: (channelId, event) => {
      realtimeEvents.push({ channelId, kind: event.kind });
    },
  };

  const contactAcceptance: ContactAcceptancePort = {
    commitAcceptance: (plan) => {
      const stored = requestMap.get(plan.requestId);
      if (stored === undefined || !casRevisioned(stored, plan.expectedRequestRevision)) {
        return { committed: false, reason: 'REVISION_MISMATCH' };
      }
      const competing = channels.findByContactRequest(plan.requestId);
      if (
        competing !== undefined &&
        competing.id !== plan.channel.id &&
        plan.nextRequest.channelId !== undefined
      ) {
        return { committed: false, reason: 'CHANNEL_CONFLICT' };
      }
      const pairChannel = channels.findDirectByPair(
        plan.societyId,
        plan.nextRequest.requesterResidentProfileId,
        plan.nextRequest.recipientResidentProfileId,
      );
      if (
        pairChannel !== undefined &&
        pairChannel.id !== plan.channel.id &&
        plan.nextRequest.channelId !== undefined
      ) {
        return { committed: false, reason: 'CHANNEL_CONFLICT' };
      }
      for (const membership of plan.memberships) {
        const existing = membershipMap.get(membershipKey(membership.channelId, membership.userId));
        if (existing !== undefined && existing.id !== membership.id) {
          return { committed: false, reason: 'MEMBERSHIP_CONFLICT' };
        }
      }
      const channelCreated = channelMap.get(plan.channel.id) === undefined;
      if (channelCreated && !upsertMap(channelMap, plan.channel, plan.channel.id)) {
        return { committed: false, reason: 'PERSISTENCE_FAILURE' };
      }
      const committedMemberships: ChannelMembershipRecord[] = [];
      for (const membership of plan.memberships) {
        const existing = membershipMap.get(membershipKey(membership.channelId, membership.userId));
        if (existing !== undefined) {
          committedMemberships.push(existing);
          continue;
        }
        membershipMap.set(membershipKey(membership.channelId, membership.userId), membership);
        membershipIdMap.set(membership.id, membership);
        committedMemberships.push(membership);
      }
      requestMap.set(plan.requestId, plan.nextRequest);
      return {
        committed: true,
        channel: channelMap.get(plan.channel.id) ?? plan.channel,
        memberships: committedMemberships,
        channelCreated,
      };
    },
  };

  function hasActiveMembership(channelId: string, userId: string): boolean {
    const membership = membershipMap.get(membershipKey(channelId, userId));
    return membership !== undefined && membership.status === 'ACTIVE';
  }

  function hasPairMemberships(
    channelId: string,
    residentProfileIdA: string,
    residentProfileIdB: string,
  ): boolean {
    const active = listValues(
      membershipMap,
      (membership) => membership.channelId === channelId && membership.status === 'ACTIVE',
    );
    const profileIds = new Set<string>();
    for (const membership of active) {
      if (membership.residentProfileId !== undefined) {
        profileIds.add(membership.residentProfileId);
      }
    }
    return (
      profileIds.has(residentProfileIdA) && profileIds.has(residentProfileIdB)
    );
  }

  return {
    directoryEntries,
    privacySettings,
    blocks,
    contactRequests,
    contactAcceptance,
    channels,
    channelMemberships,
    messages,
    readReceipts,
    unreadSummaries,
    messageDeliveryAttempts,
    queuedMessages,
    moderationCases,
    moderationEvidence,
    moderationAccessGrants,
    moderationAudit,
    notices,
    noticeRevisions,
    noticeAudiences,
    noticeRecipients,
    noticeDeliveryAttempts,
    noticeAcknowledgements,
    audit,
    idempotency,
    realtime,
    clock,
    advanceClockTo: (instant: Date): void => {
      nowMs = instant.getTime();
    },
  };
}

function findValue<T>(map: Map<string, T>, predicate: (value: T) => boolean): T | Absent {
  for (const value of map.values()) {
    if (predicate(value)) {
      return value;
    }
  }
  return undefined;
}

function listValues<T>(map: Map<string, T>, predicate: (value: T) => boolean): T[] {
  const matched: T[] = [];
  for (const value of map.values()) {
    if (predicate(value)) {
      matched.push(value);
    }
  }
  return matched;
}
