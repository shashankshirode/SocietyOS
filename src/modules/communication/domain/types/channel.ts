import type { Absent } from '../../../../shared/types/absence.types';
import type { CommunicationScope, Revision } from './primitives';

export type ChannelKind =
  | 'PRIVATE_DIRECT'
  | 'CONTROLLED_GROUP'
  | 'DEPARTMENT'
  | 'BROADCAST';

export type ChannelStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

export type GroupScopeType = 'TOWER' | 'FLOOR' | 'OWNERS' | 'TENANTS' | 'COMMUNITY';

export type DepartmentCode =
  | 'SECURITY'
  | 'ACCOUNTS'
  | 'FACILITY'
  | 'HELPDESK'
  | 'SOCIETY_OFFICE';

export type ChannelRecord = {
  readonly id: string;
  readonly scope: CommunicationScope;
  readonly societyId: string;
  readonly kind: ChannelKind;
  readonly displayName: string;
  readonly description: string | Absent;
  readonly status: ChannelStatus;
  readonly groupScopeType: GroupScopeType | Absent;
  readonly groupScopeValue: string | Absent;
  readonly departmentCode: DepartmentCode | Absent;
  readonly contactRequestId: string | Absent;
  readonly createdByUserId: string;
  readonly createdAtIso: string;
  readonly closedAtIso: string | Absent;
  readonly retentionDays: number;
  readonly revision: Revision;
};

export type ChannelMemberRole = 'MEMBER' | 'MODERATOR' | 'MANAGER';

export type ChannelMembershipStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REMOVED';

export type ChannelMembershipRecord = {
  readonly id: string;
  readonly scope: CommunicationScope;
  readonly societyId: string;
  readonly channelId: string;
  readonly userId: string;
  readonly residentProfileId: string | Absent;
  readonly unitId: string | Absent;
  readonly memberRole: ChannelMemberRole;
  readonly status: ChannelMembershipStatus;
  readonly joinedAtIso: string;
  readonly removedAtIso: string | Absent;
  readonly removedByUserId: string | Absent;
  readonly revision: Revision;
};

export type MessageDeliveryState =
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED'
  | 'EXPIRED'
  | 'WITHDRAWN';

export type MessageAttachmentKind = 'IMAGE' | 'DOCUMENT' | 'VOICE' | 'SYSTEM_CARD';

export type MessageAttachment = {
  readonly attachmentId: string;
  readonly kind: MessageAttachmentKind;
  readonly storageReference: string;
  readonly byteSize: number;
  readonly contentType: string;
  readonly scanState: 'PENDING' | 'CLEAN' | 'REJECTED';
};

export type MessageRecord = {
  readonly id: string;
  readonly scope: CommunicationScope;
  readonly societyId: string;
  readonly channelId: string;
  readonly clientMessageId: string;
  readonly senderUserId: string;
  readonly senderResidentProfileId: string | Absent;
  readonly bodyCiphertextRef: string;
  readonly bodyLength: number;
  readonly attachments: readonly MessageAttachment[];
  readonly replyToMessageId: string | Absent;
  readonly deliveryState: MessageDeliveryState;
  readonly sequence: number;
  readonly createdAtIso: string;
  readonly sentAtIso: string | Absent;
  readonly deliveredAtIso: string | Absent;
  readonly readAtIso: string | Absent;
  readonly failedAtIso: string | Absent;
  readonly failureReason: string | Absent;
  readonly expiresAtIso: string;
  readonly withdrawnAtIso: string | Absent;
  readonly revision: Revision;
};

export type MessageReadReceipt = {
  readonly id: string;
  readonly societyId: string;
  readonly messageId: string;
  readonly channelId: string;
  readonly readerUserId: string;
  readonly readAtIso: string;
};

export type ChannelDeliveryAttempt = {
  readonly id: string;
  readonly societyId: string;
  readonly messageId: string;
  readonly channelKind: 'PUSH' | 'SMS' | 'EMAIL' | 'WHATSAPP_LIKE';
  readonly attemptNumber: number;
  readonly outcome: 'DELIVERED' | 'FAILED' | 'THROTTLED' | 'SKIPPED';
  readonly providerReference: string | Absent;
  readonly attemptedAtIso: string;
  readonly failureReason: string | Absent;
};

export type ChannelUnreadSummary = {
  readonly societyId: string;
  readonly channelId: string;
  readonly userId: string;
  readonly unreadCount: number;
  readonly lastDeliveredAtIso: string | Absent;
};

export type QueuedMessageIntent = {
  readonly id: string;
  readonly societyId: string;
  readonly channelId: string;
  readonly senderUserId: string;
  readonly clientMessageId: string;
  readonly queuedAtIso: string;
  readonly lastRevalidatedAtIso: string | Absent;
  readonly attempts: number;
  readonly lastRejectionCode: string | Absent;
};
