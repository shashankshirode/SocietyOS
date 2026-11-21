import type { Absent } from '../../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../../core/audit/audit.types';
import type { DisputeCase } from '../domain/types/case.types';
import type { EvidenceRecord, EvidenceVaultPort } from '../domain/types/evidence.types';
import type { TimelineEvent, CaseAuditEntry } from '../domain/types/timeline.types';
import type { Inspection } from '../domain/types/inspection.types';
import type {
  ClosureProof,
  MediatorNote,
  ResolutionProposal,
} from '../domain/types/mediation.types';
import type { Escalation } from '../domain/types/escalation.types';
import type { DisputeRetentionRecord } from '../domain/types/retention.types';
import type {
  DisputeIdempotencyLedger,
  DisputeConcurrencyStore,
  DisputeCommandEnvelope,
} from '../domain/guards/commandGuard';
import type { Mediation } from '../domain/stateMachines/mediationMachine';
import type { CommunicationThreadPort } from './communicationPorts';
import type {
  DisputeClock,
  DisputePolicySet,
  FinanceLinkRequest,
  MoveOutLinkRequest,
} from '../domain/types';

export type DisputeCaseStore = DisputeConcurrencyStore<DisputeCase> & {
  readonly insert: (disputeCase: DisputeCase) => boolean;
  readonly listBySociety: (societyId: string) => readonly DisputeCase[];
  readonly listByParty: (societyId: string, userId: string) => readonly DisputeCase[];
  readonly nextCaseSequence: (societyId: string) => number;
};

export type EvidenceStore = {
  readonly insert: (record: EvidenceRecord) => boolean;
  readonly update: (record: EvidenceRecord) => boolean;
  readonly read: (evidenceId: string) => EvidenceRecord | Absent;
  readonly listByCase: (caseId: string) => readonly EvidenceRecord[];
};

export type TimelineStore = {
  readonly append: (event: TimelineEvent) => boolean;
  readonly listByCase: (caseId: string) => readonly TimelineEvent[];
};

export type InspectionStore = {
  readonly insert: (inspection: Inspection) => boolean;
  readonly update: (inspection: Inspection) => boolean;
  readonly read: (inspectionId: string) => Inspection | Absent;
  readonly listByCase: (caseId: string) => readonly Inspection[];
};

export type MediationStore = {
  readonly insert: (mediation: Mediation) => boolean;
  readonly update: (mediation: Mediation) => boolean;
  readonly read: (mediationId: string) => Mediation | Absent;
};

export type ProposalStore = {
  readonly insert: (proposal: ResolutionProposal) => boolean;
  readonly update: (proposal: ResolutionProposal) => boolean;
  readonly read: (proposalId: string) => ResolutionProposal | Absent;
  readonly listByCase: (caseId: string) => readonly ResolutionProposal[];
};

export type ClosureProofStore = {
  readonly insert: (proof: ClosureProof) => boolean;
  readonly update: (proof: ClosureProof) => boolean;
  readonly listByCase: (caseId: string) => readonly ClosureProof[];
  readonly read: (proofId: string) => ClosureProof | Absent;
};

export type EscalationStore = {
  readonly insert: (escalation: Escalation) => boolean;
  readonly update: (escalation: Escalation) => boolean;
  readonly read: (escalationId: string) => Escalation | Absent;
  readonly listByCase: (caseId: string) => readonly Escalation[];
};

export type RetentionStore = {
  readonly upsert: (record: DisputeRetentionRecord) => boolean;
  readonly read: (caseId: string) => DisputeRetentionRecord | Absent;
  readonly listBySociety: (societyId: string) => readonly DisputeRetentionRecord[];
};

export type FinanceLinkStore = {
  readonly insert: (request: FinanceLinkRequest) => boolean;
  readonly update: (request: FinanceLinkRequest) => boolean;
  readonly read: (linkId: string) => FinanceLinkRequest | Absent;
  readonly listByCase: (caseId: string) => readonly FinanceLinkRequest[];
};

export type MoveOutLinkStore = {
  readonly insert: (request: MoveOutLinkRequest) => boolean;
  readonly update: (request: MoveOutLinkRequest) => boolean;
  readonly read: (linkId: string) => MoveOutLinkRequest | Absent;
  readonly listByCase: (caseId: string) => readonly MoveOutLinkRequest[];
};

export type CaseAuditSink = {
  readonly emit: (entry: CaseAuditEntry) => void;
  readonly listByCase: (caseId: string) => readonly CaseAuditEntry[];
};

export type PlatformAuditSink = {
  readonly emit: (entry: AuditLogEntry) => void;
};

export type CaseNotificationEvent =
  | 'CASE_OPENED'
  | 'RESPONSE_REQUESTED'
  | 'RESPONSE_RECEIVED'
  | 'INSPECTION_SCHEDULED'
  | 'INSPECTION_COMPLETED'
  | 'MEDIATION_ASSIGNED'
  | 'RESOLUTION_PROPOSED'
  | 'PROPOSAL_DECIDED'
  | 'CASE_ESCALATED'
  | 'CASE_CLOSED'
  | 'FINANCE_LINK_DECIDED'
  | 'SLA_BREACH';

export type CaseNotification = {
  readonly notificationId: string;
  readonly caseId: string;
  readonly societyId: string;
  readonly event: CaseNotificationEvent;
  readonly recipientUserIds: readonly string[];
  readonly channel: 'IN_APP' | 'NOTICE';
  readonly subject: string;
  readonly delivered: boolean;
  readonly skipReason: string | Absent;
  readonly createdAt: string;
};

export type CaseNotificationPort = {
  readonly notificationChannel: string;
  readonly isAvailable: () => boolean;
  readonly send: (notification: CaseNotification) => CaseNotification;
  readonly listByCase: (caseId: string) => readonly CaseNotification[];
};

export type DisputeCaseNumbering = {
  readonly prefix: string;
};

export type DisputePorts = {
  readonly clock: DisputeClock;
  readonly ledger: DisputeIdempotencyLedger;
  readonly cases: DisputeCaseStore;
  readonly evidence: EvidenceStore;
  readonly timeline: TimelineStore;
  readonly inspections: InspectionStore;
  readonly mediations: MediationStore;
  readonly proposals: ProposalStore;
  readonly closureProofs: ClosureProofStore;
  readonly escalations: EscalationStore;
  readonly retention: RetentionStore;
  readonly financeLinks: FinanceLinkStore;
  readonly moveOutLinks: MoveOutLinkStore;
  readonly caseAudit: CaseAuditSink;
  readonly platformAudit: PlatformAuditSink;
  readonly notifications: CaseNotificationPort;
  readonly evidenceVault: EvidenceVaultPort;
  readonly policies: DisputePolicySet;
  readonly numbering: DisputeCaseNumbering;
  readonly communicationThreads: CommunicationThreadPort;
};

export type DisputeCommandContext = {
  readonly envelope: DisputeCommandEnvelope;
  readonly expectedRevision: number;
};

export type MediatorNoteInput = {
  readonly note: string;
  readonly visibility: MediatorNote['visibility'];
};
