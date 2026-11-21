import type { Absent } from '../../../../shared/types/absence.types';
import type { CommunicationScope, Revision } from './primitives';

export type ReportCategory =
  | 'HARASSMENT'
  | 'SPAM'
  | 'ABUSIVE_LANGUAGE'
  | 'THREAT'
  | 'IRRELEVANT_CONTACT'
  | 'PRIVACY_VIOLATION'
  | 'FRAUD_SUSPICIOUS'
  | 'IMPERSONATION'
  | 'OTHER';

export type ModerationTargetType = 'MESSAGE' | 'RESIDENT' | 'CONTACT_REQUEST' | 'CHANNEL';

export type ModerationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ACTION_TAKEN'
  | 'DISMISSED'
  | 'ESCALATED';

export type ModerationActionType =
  | 'NONE'
  | 'WARN_RESIDENT'
  | 'HIDE_MESSAGE'
  | 'MUTE_RESIDENT'
  | 'REMOVE_RESIDENT_ACCESS'
  | 'CLOSE_CHANNEL'
  | 'ESCALATE_TO_COMMITTEE';

export type ModerationEvidence = {
  readonly evidenceId: string;
  readonly caseId: string;
  readonly targetType: ModerationTargetType;
  readonly targetId: string;
  readonly reportedByUserId: string;
  readonly reportedAtIso: string;
  readonly channelId: string | Absent;
  readonly messageId: string | Absent;
  readonly reporterStatement: string;
  readonly evidenceConsentGranted: boolean;
  readonly capturedAtIso: string;
};

export type ModerationCase = {
  readonly id: string;
  readonly scope: CommunicationScope;
  readonly societyId: string;
  readonly targetType: ModerationTargetType;
  readonly targetId: string;
  readonly channelId: string | Absent;
  readonly category: ReportCategory;
  readonly status: ModerationStatus;
  readonly description: string;
  readonly reportedByUserId: string;
  readonly reportedAtIso: string;
  readonly assignedModeratorUserId: string | Absent;
  readonly actionTaken: ModerationActionType;
  readonly actionReason: string | Absent;
  readonly actionTakenByUserId: string | Absent;
  readonly actionTakenAtIso: string | Absent;
  readonly escalatedAtIso: string | Absent;
  readonly evidenceIds: readonly string[];
  readonly retentionDays: number;
  readonly revision: Revision;
};

export type ModerationAccessGrant = {
  readonly id: string;
  readonly societyId: string;
  readonly moderatorUserId: string;
  readonly caseId: string;
  readonly purpose: string;
  readonly grantedByUserId: string;
  readonly grantedAtIso: string;
  readonly expiresAtIso: string;
  readonly revokedAtIso: string | Absent;
};

export type ModerationAuditEntry = {
  readonly id: string;
  readonly societyId: string;
  readonly caseId: string;
  readonly actorUserId: string;
  readonly actorRole: string;
  readonly purpose: string;
  readonly correlationId: string;
  readonly occurredAtIso: string;
  readonly metadata: Readonly<Record<string, string | number | boolean>>;
};
