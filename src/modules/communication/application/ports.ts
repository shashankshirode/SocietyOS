import type { Absent } from '../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../core/audit/audit.types';
import type { CommunicationClock } from '../domain/types';
import type {
  ChannelMembershipRecord,
  ChannelRecord,
  ChannelUnreadSummary,
  ChannelDeliveryAttempt,
  MessageReadReceipt,
  MessageRecord,
  QueuedMessageIntent,
} from '../domain/types';
import type {
  ContactRequestPair,
  ContactRequestRecord,
  ResidentBlock,
  ResidentDirectoryEntry,
  ResidentPrivacySettings,
} from '../domain/types';
import type {
  ModerationAccessGrant,
  ModerationAuditEntry,
  ModerationCase,
  ModerationEvidence,
} from '../domain/types';
import type {
  NoticeAcknowledgement,
  NoticeAcknowledgementReport,
  NoticeAudienceSnapshot,
  NoticeDeliveryAttempt,
  NoticeRecipientRecord,
  NoticeRecord,
  NoticeRevisionRecord,
} from '../domain/types';

export type DirectoryEntryStore = {
  readonly insert: (entry: ResidentDirectoryEntry) => boolean;
  readonly update: (entry: ResidentDirectoryEntry, expectedRevision: number) => boolean;
  readonly read: (entryId: string) => ResidentDirectoryEntry | Absent;
  readonly readByResidentProfileId: (
    societyId: string,
    residentProfileId: string,
  ) => ResidentDirectoryEntry | Absent;
  readonly readByUserId: (
    societyId: string,
    userId: string,
  ) => ResidentDirectoryEntry | Absent;
  readonly listBySociety: (societyId: string) => readonly ResidentDirectoryEntry[];
  readonly listByUnit: (societyId: string, unitId: string) => readonly ResidentDirectoryEntry[];
  readonly listByTower: (societyId: string, towerOrWing: string) => readonly ResidentDirectoryEntry[];
};

export type PrivacySettingsStore = {
  readonly upsert: (settings: ResidentPrivacySettings) => boolean;
  readonly read: (societyId: string, residentProfileId: string) => ResidentPrivacySettings | Absent;
  readonly listBySociety: (societyId: string) => readonly ResidentPrivacySettings[];
};

export type BlockStore = {
  readonly insert: (block: ResidentBlock) => boolean;
  readonly read: (blockId: string) => ResidentBlock | Absent;
  readonly listByUser: (societyId: string, userId: string) => readonly ResidentBlock[];
  readonly findPair: (
    societyId: string,
    profileIdA: string,
    profileIdB: string,
  ) => ResidentBlock | Absent;
};

export type ContactRequestStore = {
  readonly insert: (request: ContactRequestRecord) => boolean;
  readonly update: (
    request: ContactRequestRecord,
    expectedRevision: number,
  ) => boolean;
  readonly read: (requestId: string) => ContactRequestRecord | Absent;
  readonly findByIdempotencyKey: (
    societyId: string,
    idempotencyKey: string,
  ) => ContactRequestRecord | Absent;
  readonly listOutgoing: (
    societyId: string,
    requesterUserId: string,
  ) => readonly ContactRequestRecord[];
  readonly listIncoming: (
    societyId: string,
    recipientUserId: string,
  ) => readonly ContactRequestRecord[];
  readonly listOpenForResident: (
    societyId: string,
    residentProfileId: string,
  ) => readonly ContactRequestRecord[];
  readonly listByPair: (pair: ContactRequestPair) => readonly ContactRequestRecord[];
  readonly listBySociety: (societyId: string) => readonly ContactRequestRecord[];
};

export type ContactAcceptancePlan = {
  readonly societyId: string;
  readonly requestId: string;
  readonly expectedRequestRevision: number;
  readonly nextRequest: ContactRequestRecord;
  readonly channel: ChannelRecord;
  readonly memberships: readonly ChannelMembershipRecord[];
};

export type ContactAcceptanceCommit =
  | {
      readonly committed: true;
      readonly channel: ChannelRecord;
      readonly memberships: readonly ChannelMembershipRecord[];
      readonly channelCreated: boolean;
    }
  | {
      readonly committed: false;
      readonly reason:
        | 'REVISION_MISMATCH'
        | 'CHANNEL_CONFLICT'
        | 'MEMBERSHIP_CONFLICT'
        | 'PERSISTENCE_FAILURE';
    };

export type ContactAcceptancePort = {
  readonly commitAcceptance: (plan: ContactAcceptancePlan) => ContactAcceptanceCommit;
};

export type ChannelStore = {
  readonly insert: (channel: ChannelRecord) => boolean;
  readonly update: (channel: ChannelRecord, expectedRevision: number) => boolean;
  readonly read: (channelId: string) => ChannelRecord | Absent;
  readonly findByContactRequest: (contactRequestId: string) => ChannelRecord | Absent;
  readonly findDirectByPair: (
    societyId: string,
    residentProfileIdA: string,
    residentProfileIdB: string,
  ) => ChannelRecord | Absent;
  readonly listBySociety: (societyId: string) => readonly ChannelRecord[];
  readonly listByUser: (societyId: string, userId: string) => readonly ChannelRecord[];
};

export type ChannelMembershipStore = {
  readonly insert: (membership: ChannelMembershipRecord) => boolean;
  readonly update: (
    membership: ChannelMembershipRecord,
    expectedRevision: number,
  ) => boolean;
  readonly read: (membershipId: string) => ChannelMembershipRecord | Absent;
  readonly findMembership: (
    channelId: string,
    userId: string,
  ) => ChannelMembershipRecord | Absent;
  readonly listByChannel: (channelId: string) => readonly ChannelMembershipRecord[];
  readonly listByUser: (societyId: string, userId: string) => readonly ChannelMembershipRecord[];
  readonly countActiveManagers: (channelId: string) => number;
};

export type MessageStore = {
  readonly insert: (message: MessageRecord) => boolean;
  readonly update: (message: MessageRecord, expectedRevision: number) => boolean;
  readonly read: (messageId: string) => MessageRecord | Absent;
  readonly findByClientMessageId: (
    societyId: string,
    clientMessageId: string,
  ) => MessageRecord | Absent;
  readonly listByChannel: (channelId: string) => readonly MessageRecord[];
  readonly listExpiredBefore: (cutoffIso: string) => readonly MessageRecord[];
  readonly nextSequence: (channelId: string) => number;
};

export type MessageReadReceiptStore = {
  readonly insert: (receipt: MessageReadReceipt) => boolean;
  readonly listByMessage: (messageId: string) => readonly MessageReadReceipt[];
  readonly listByReader: (societyId: string, userId: string) => readonly MessageReadReceipt[];
};

export type ChannelUnreadStore = {
  readonly read: (societyId: string, channelId: string, userId: string) => ChannelUnreadSummary | Absent;
  readonly upsert: (summary: ChannelUnreadSummary) => boolean;
  readonly listByUser: (societyId: string, userId: string) => readonly ChannelUnreadSummary[];
};

export type MessageDeliveryAttemptStore = {
  readonly insert: (attempt: ChannelDeliveryAttempt) => boolean;
  readonly listByMessage: (messageId: string) => readonly ChannelDeliveryAttempt[];
  readonly countByMessage: (messageId: string) => number;
};

export type QueuedMessageStore = {
  readonly upsert: (intent: QueuedMessageIntent) => boolean;
  readonly read: (queuedId: string) => QueuedMessageIntent | Absent;
  readonly listPending: (societyId: string) => readonly QueuedMessageIntent[];
};

export type ModerationCaseStore = {
  readonly insert: (moderationCase: ModerationCase) => boolean;
  readonly update: (
    moderationCase: ModerationCase,
    expectedRevision: number,
  ) => boolean;
  readonly read: (caseId: string) => ModerationCase | Absent;
  readonly listBySociety: (societyId: string) => readonly ModerationCase[];
  readonly listByTarget: (societyId: string, targetId: string) => readonly ModerationCase[];
  readonly findByIdempotencyKey: (
    societyId: string,
    idempotencyKey: string,
  ) => ModerationCase | Absent;
};

export type ModerationEvidenceStore = {
  readonly insert: (evidence: ModerationEvidence) => boolean;
  readonly read: (evidenceId: string) => ModerationEvidence | Absent;
  readonly listByCase: (caseId: string) => readonly ModerationEvidence[];
};

export type ModerationAccessGrantStore = {
  readonly insert: (grant: ModerationAccessGrant) => boolean;
  readonly read: (grantId: string) => ModerationAccessGrant | Absent;
  readonly findActiveForCase: (
    caseId: string,
    moderatorUserId: string,
  ) => ModerationAccessGrant | Absent;
  readonly listByCase: (caseId: string) => readonly ModerationAccessGrant[];
};

export type ModerationAuditStore = {
  readonly append: (entry: ModerationAuditEntry) => boolean;
  readonly listByCase: (caseId: string) => readonly ModerationAuditEntry[];
  readonly listBySociety: (societyId: string) => readonly ModerationAuditEntry[];
};

export type NoticeStore = {
  readonly insert: (notice: NoticeRecord) => boolean;
  readonly update: (notice: NoticeRecord, expectedRevision: number) => boolean;
  readonly read: (noticeId: string) => NoticeRecord | Absent;
  readonly findByIdempotencyKey: (
    societyId: string,
    idempotencyKey: string,
  ) => NoticeRecord | Absent;
  readonly listBySociety: (societyId: string) => readonly NoticeRecord[];
  readonly listScheduledDue: (cutoffIso: string) => readonly NoticeRecord[];
  readonly listExpiringBefore: (cutoffIso: string) => readonly NoticeRecord[];
};

export type NoticeRevisionStore = {
  readonly insert: (revision: NoticeRevisionRecord) => boolean;
  readonly listByNotice: (noticeId: string) => readonly NoticeRevisionRecord[];
  readonly read: (revisionId: string) => NoticeRevisionRecord | Absent;
};

export type NoticeAudienceStore = {
  readonly insert: (snapshot: NoticeAudienceSnapshot) => boolean;
  readonly read: (snapshotId: string) => NoticeAudienceSnapshot | Absent;
  readonly listByNotice: (noticeId: string) => readonly NoticeAudienceSnapshot[];
};

export type NoticeRecipientStore = {
  readonly insert: (recipient: NoticeRecipientRecord) => boolean;
  readonly update: (
    recipient: NoticeRecipientRecord,
    expectedRevision: number,
  ) => boolean;
  readonly read: (recipientId: string) => NoticeRecipientRecord | Absent;
  readonly findByNoticeAndResident: (
    noticeId: string,
    residentProfileId: string,
  ) => NoticeRecipientRecord | Absent;
  readonly listByNotice: (noticeId: string) => readonly NoticeRecipientRecord[];
  readonly listPendingByNotice: (noticeId: string) => readonly NoticeRecipientRecord[];
};

export type NoticeDeliveryAttemptStore = {
  readonly insert: (attempt: NoticeDeliveryAttempt) => boolean;
  readonly listByRecipient: (recipientId: string) => readonly NoticeDeliveryAttempt[];
  readonly countByRecipient: (recipientId: string) => number;
};

export type NoticeAcknowledgementStore = {
  readonly insert: (acknowledgement: NoticeAcknowledgement) => boolean;
  readonly read: (acknowledgementId: string) => NoticeAcknowledgement | Absent;
  readonly findByNoticeAndResident: (
    noticeId: string,
    residentProfileId: string,
  ) => NoticeAcknowledgement | Absent;
  readonly listByNotice: (noticeId: string) => readonly NoticeAcknowledgement[];
};

export type AuditSink = {
  readonly emit: (entry: AuditLogEntry) => void;
  readonly list: (societyId: string) => readonly AuditLogEntry[];
};

export type IdempotencyStore = {
  readonly claim: (societyId: string, key: string, fingerprint: string) => boolean;
  readonly bindAggregate: (societyId: string, key: string, aggregateId: string) => void;
  readonly release: (societyId: string, key: string) => boolean;
};

export type NotificationDeliveryPort = {
  readonly channel: 'PUSH' | 'SMS' | 'EMAIL' | 'WHATSAPP_LIKE';
  readonly deliver: (
    recipientUserId: string,
    payloadReference: string,
  ) => Promise<
    | { readonly outcome: 'DELIVERED'; readonly providerReference: string }
    | { readonly outcome: 'FAILED' | 'THROTTLED'; readonly failureReason: string }
  >;
};

export type RealtimeTransportPort = {
  readonly available: boolean;
  readonly publish: (channelId: string, event: RealtimeEvent) => void;
};

export type RealtimeEvent =
  | { readonly kind: 'MESSAGE_CREATED'; readonly messageId: string; readonly sequence: number }
  | { readonly kind: 'MESSAGE_STATE_CHANGED'; readonly messageId: string; readonly state: string }
  | { readonly kind: 'CHANNEL_STATE_CHANGED'; readonly channelId: string; readonly state: string }
  | { readonly kind: 'NOTICE_PUBLISHED'; readonly noticeId: string };

export type CommunicationPorts = {
  readonly clock: CommunicationClock;
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
  readonly notificationProviders: readonly NotificationDeliveryPort[];
  readonly realtime: RealtimeTransportPort;
};
