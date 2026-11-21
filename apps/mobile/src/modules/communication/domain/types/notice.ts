import type { Absent } from '../../../../shared/types/absence.types';
import type { CommunicationScope, Revision } from './primitives';
import type { DepartmentCode } from './channel';

export type NoticePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type NoticeStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'PARTIALLY_DELIVERED'
  | 'EXPIRED'
  | 'WITHDRAWN'
  | 'FAILED';

export type NoticeAudienceType =
  | 'ALL_RESIDENTS'
  | 'TOWER'
  | 'FLOOR'
  | 'UNITS'
  | 'OWNERS'
  | 'TENANTS'
  | 'COMMITTEE'
  | 'DEPARTMENT';

export type NoticeRecipientState =
  | 'PENDING'
  | 'QUEUED'
  | 'DELIVERED'
  | 'READ'
  | 'ACKNOWLEDGED'
  | 'FAILED'
  | 'SUPPRESSED';

export type NoticeRevisionRecord = {
  readonly id: string;
  readonly societyId: string;
  readonly noticeId: string;
  readonly revision: number;
  readonly bodyCiphertextRef: string;
  readonly subjectCiphertextRef: string;
  readonly localizedBodyRefs: Readonly<Record<string, string>>;
  readonly attachmentReferences: readonly string[];
  readonly changedByUserId: string;
  readonly changeReason: string;
  readonly createdAtIso: string;
};

export type NoticeAudienceSnapshotEntry = {
  readonly residentProfileId: string;
  readonly userId: string;
  readonly unitId: string;
  readonly flatNumber: string;
  readonly towerOrWing: string;
  readonly occupancyRole: string;
  readonly resolvedAtIso: string;
};

export type NoticeAudienceSnapshot = {
  readonly id: string;
  readonly societyId: string;
  readonly noticeId: string;
  readonly audienceType: NoticeAudienceType;
  readonly audienceValue: string | Absent;
  readonly entries: readonly NoticeAudienceSnapshotEntry[];
  readonly frozenAtIso: string;
  readonly frozenByUserId: string;
  readonly totalRecipients: number;
};

export type NoticeRecord = {
  readonly id: string;
  readonly scope: CommunicationScope;
  readonly societyId: string;
  readonly title: string;
  readonly subjectCiphertextRef: string;
  readonly bodyCiphertextRef: string;
  readonly localizedBodyRefs: Readonly<Record<string, string>>;
  readonly attachmentReferences: readonly string[];
  readonly priority: NoticePriority;
  readonly status: NoticeStatus;
  readonly audienceSnapshotId: string | Absent;
  readonly currentRevision: number;
  readonly effectiveFromIso: string;
  readonly effectiveUntilIso: string | Absent;
  readonly scheduledPublishAtIso: string | Absent;
  readonly publishedAtIso: string | Absent;
  readonly deliveredAtIso: string | Absent;
  readonly expiredAtIso: string | Absent;
  readonly withdrawnAtIso: string | Absent;
  readonly withdrawalReason: string | Absent;
  readonly emergencyOverride: boolean;
  readonly emergencyOverrideReason: string | Absent;
  readonly emergencyOverrideApprovedByUserId: string | Absent;
  readonly quietHoursOverride: boolean;
  readonly allowedDepartments: readonly DepartmentCode[];
  readonly requiresAcknowledgement: boolean;
  readonly acknowledgementDueAtIso: string | Absent;
  readonly retentionDays: number;
  readonly createdByUserId: string;
  readonly createdAtIso: string;
  readonly revision: Revision;
};

export type NoticeRecipientRecord = {
  readonly id: string;
  readonly societyId: string;
  readonly noticeId: string;
  readonly revision: number;
  readonly residentProfileId: string;
  readonly userId: string;
  readonly unitId: string;
  readonly state: NoticeRecipientState;
  readonly deliveryAttempts: number;
  readonly lastAttemptAtIso: string | Absent;
  readonly deliveredAtIso: string | Absent;
  readonly readAtIso: string | Absent;
  readonly acknowledgedAtIso: string | Absent;
  readonly acknowledgedRevision: number | Absent;
  readonly failureReason: string | Absent;
  readonly suppressedReason: string | Absent;
};

export type NoticeDeliveryAttempt = {
  readonly id: string;
  readonly societyId: string;
  readonly noticeId: string;
  readonly recipientId: string;
  readonly channel: 'PUSH' | 'SMS' | 'EMAIL' | 'WHATSAPP_LIKE';
  readonly attemptNumber: number;
  readonly outcome: 'DELIVERED' | 'FAILED' | 'THROTTLED' | 'SKIPPED';
  readonly providerReference: string | Absent;
  readonly attemptedAtIso: string;
  readonly failureReason: string | Absent;
};

export type NoticeAcknowledgement = {
  readonly id: string;
  readonly societyId: string;
  readonly noticeId: string;
  readonly revision: number;
  readonly residentProfileId: string;
  readonly userId: string;
  readonly acknowledgedAtIso: string;
  readonly deliveryStateAtAcknowledgement: NoticeRecipientState;
};

export type NoticeAcknowledgementReport = {
  readonly societyId: string;
  readonly noticeId: string;
  readonly revision: number;
  readonly totalAudience: number;
  readonly delivered: number;
  readonly read: number;
  readonly acknowledged: number;
  readonly pending: number;
  readonly failed: number;
  readonly generatedAtIso: string;
};
