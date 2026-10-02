import type { Absent } from '../../../../../../shared/types/absence.types';
export { type DocumentAction } from './policy.types';
import type { DocumentVisibility } from './document.types';
import type { SensitivityPolicy } from './policy.types';
import type { Revision, TraceContext, VaultScope } from './primitives';

export type AccessOutcome = 'GRANTED' | 'DENIED' | 'ALLOWED_WITH_REASON' | 'QUARANTINED_BLOCK';

export type AccessEvaluation = {
  readonly outcome: AccessOutcome;
  readonly policy: SensitivityPolicy | Absent;
  readonly reason: string;
  readonly requiresReason: boolean;
  readonly maximumTtlSeconds: number;
  readonly redactionRequired: boolean;
};

export type AccessRequest = {
  readonly id: string;
  readonly scope: VaultScope;
  readonly documentId: string;
  readonly versionId: string;
  readonly requestedBy: string;
  readonly requestedAt: string;
  readonly action: DocumentAction;
  readonly reason: string | Absent;
  readonly outcome: AccessOutcome;
  readonly decisionReason: string;
  readonly decidedAt: string;
  readonly decidedBy: string;
  readonly state: 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED' | 'REVOKED';
  readonly expiresAt: string | Absent;
  readonly revision: Revision;
  readonly trace: TraceContext;
};

export type RetrievalTicket = {
  readonly id: string;
  readonly scope: VaultScope;
  readonly documentId: string;
  readonly versionId: string;
  readonly issuedToUserId: string;
  readonly grantedAction: DocumentAction;
  readonly issuedAt: string;
  readonly expiresAt: string;
  readonly singleUse: boolean;
  readonly consumedAt: string | Absent;
  readonly revokedAt: string | Absent;
  readonly streamHandle: string;
  readonly trace: TraceContext;
};

export type AccessLogEntry = {
  readonly id: string;
  readonly societyId: string;
  readonly documentId: string;
  readonly versionId: string | Absent;
  readonly actorUserId: string;
  readonly actorRole: string;
  readonly action: DocumentAction;
  readonly outcome: AccessOutcome;
  readonly occurredAt: string;
  readonly reasonCode: string;
  readonly correlationId: string;
  readonly sessionId: string;
  readonly deviceClass: string;
  readonly redactedActor: boolean;
};

export type VisibilityAssignment = {
  readonly documentId: string;
  readonly visibility: DocumentVisibility;
  readonly grantedBy: string;
  readonly grantedAt: string;
  readonly note: string | Absent;
};

export type AccessGrant = {
  readonly id: string;
  readonly scope: VaultScope;
  readonly documentId: string;
  readonly granteeUserId: string;
  readonly granteeRole: string;
  readonly actions: readonly DocumentAction[];
  readonly grantedBy: string;
  readonly grantedAt: string;
  readonly expiresAt: string | Absent;
  readonly revokedAt: string | Absent;
  readonly reason: string;
};
