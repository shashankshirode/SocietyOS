import type { Absent } from '../../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../../core/audit/audit.types';
import type { DisputeCase } from '../domain/types/case.types';
import type { EvidenceRecord, EvidenceVaultPort } from '../domain/types/evidence.types';
import { VAULT_UNAVAILABLE } from '../domain/types/evidence.types';
import type { CaseAuditEntry, TimelineEvent } from '../domain/types/timeline.types';
import type { Inspection } from '../domain/types/inspection.types';
import type { ClosureProof, ResolutionProposal } from '../domain/types/mediation.types';
import type { Mediation } from '../domain/stateMachines/mediationMachine';
import type { Escalation } from '../domain/types/escalation.types';
import type { DisputeRetentionRecord } from '../domain/types/retention.types';
import type { FinanceLinkRequest, MoveOutLinkRequest } from '../domain/types/policy.types';
import type { DisputeClock } from '../domain/types/primitives';
import type { DisputeIdempotencyLedger } from '../domain/guards/commandGuard';
import { createInMemoryDisputeLedger } from '../domain/guards/commandGuard';
import type {
  CaseAuditSink,
  CaseNotification,
  CaseNotificationPort,
  ClosureProofStore,
  DisputeCaseStore,
  EscalationStore,
  EvidenceStore,
  FinanceLinkStore,
  InspectionStore,
  MediationStore,
  MoveOutLinkStore,
  PlatformAuditSink,
  ProposalStore,
  RetentionStore,
  TimelineStore,
} from '../application/ports';

export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

export function createInMemoryCaseStore(): DisputeCaseStore & {
  readonly snapshot: () => readonly DisputeCase[];
} {
  const cases = new Map<string, DisputeCase>();
  const sequences = new Map<string, number>();
  return {
    read: (caseId) => cases.get(caseId),
    insert: (disputeCase) => {
      if (cases.has(disputeCase.id)) {
        return false;
      }
      cases.set(disputeCase.id, disputeCase);
      return true;
    },
    commit: (caseId, disputeCase, expectedRevision) => {
      const current = cases.get(caseId);
      if (current === undefined || current.revision.revision !== expectedRevision) {
        return false;
      }
      cases.set(caseId, disputeCase);
      return true;
    },
    listBySociety: (societyId) =>
      [...cases.values()].filter((disputeCase) => disputeCase.societyId === societyId),
    listByParty: (societyId, userId) =>
      [...cases.values()].filter(
        (disputeCase) =>
          disputeCase.societyId === societyId &&
          disputeCase.parties.some(
            (party) => party.userId === userId && party.accessRevokedAt === undefined,
          ),
      ),
    nextCaseSequence: (societyId) => {
      const next = (sequences.get(societyId) ?? 0) + 1;
      sequences.set(societyId, next);
      return next;
    },
    snapshot: () => [...cases.values()],
  };
}

export function createInMemoryEvidenceStore(): EvidenceStore {
  const records = new Map<string, EvidenceRecord>();
  return {
    insert: (record) => {
      if (records.has(record.id)) {
        return false;
      }
      records.set(record.id, record);
      return true;
    },
    update: (record) => {
      if (!records.has(record.id)) {
        return false;
      }
      records.set(record.id, record);
      return true;
    },
    read: (evidenceId) => records.get(evidenceId),
    listByCase: (caseId) => [...records.values()].filter((record) => record.caseId === caseId),
  };
}

export function createInMemoryTimelineStore(): TimelineStore {
  const events: TimelineEvent[] = [];
  return {
    append: (event) => {
      if (events.some((existing) => existing.id === event.id)) {
        return false;
      }
      events.push(event);
      return true;
    },
    listByCase: (caseId) =>
      events
        .filter((event) => event.caseId === caseId)
        .sort((left, right) => left.sequence - right.sequence),
  };
}

export function createInMemoryInspectionStore(): InspectionStore {
  const records = new Map<string, Inspection>();
  return {
    insert: (inspection) => {
      if (records.has(inspection.id)) {
        return false;
      }
      records.set(inspection.id, inspection);
      return true;
    },
    update: (inspection) => {
      if (!records.has(inspection.id)) {
        return false;
      }
      records.set(inspection.id, inspection);
      return true;
    },
    read: (inspectionId) => records.get(inspectionId),
    listByCase: (caseId) => [...records.values()].filter((record) => record.caseId === caseId),
  };
}

export function createInMemoryMediationStore(): MediationStore {
  const records = new Map<string, Mediation>();
  return {
    insert: (mediation) => {
      if (records.has(mediation.id)) {
        return false;
      }
      records.set(mediation.id, mediation);
      return true;
    },
    update: (mediation) => {
      if (!records.has(mediation.id)) {
        return false;
      }
      records.set(mediation.id, mediation);
      return true;
    },
    read: (mediationId) => records.get(mediationId),
  };
}

export function createInMemoryProposalStore(): ProposalStore {
  const records = new Map<string, ResolutionProposal>();
  return {
    insert: (proposal) => {
      if (records.has(proposal.id)) {
        return false;
      }
      records.set(proposal.id, proposal);
      return true;
    },
    update: (proposal) => {
      if (!records.has(proposal.id)) {
        return false;
      }
      records.set(proposal.id, proposal);
      return true;
    },
    read: (proposalId) => records.get(proposalId),
    listByCase: (caseId) => [...records.values()].filter((record) => record.caseId === caseId),
  };
}

export function createInMemoryClosureProofStore(): ClosureProofStore {
  const records = new Map<string, ClosureProof>();
  return {
    insert: (proof) => {
      if (records.has(proof.id)) {
        return false;
      }
      records.set(proof.id, proof);
      return true;
    },
    update: (proof) => {
      if (!records.has(proof.id)) {
        return false;
      }
      records.set(proof.id, proof);
      return true;
    },
    read: (proofId) => records.get(proofId),
    listByCase: (caseId) => [...records.values()].filter((record) => record.caseId === caseId),
  };
}

export function createInMemoryEscalationStore(): EscalationStore {
  const records = new Map<string, Escalation>();
  return {
    insert: (escalation) => {
      if (records.has(escalation.id)) {
        return false;
      }
      records.set(escalation.id, escalation);
      return true;
    },
    update: (escalation) => {
      if (!records.has(escalation.id)) {
        return false;
      }
      records.set(escalation.id, escalation);
      return true;
    },
    read: (escalationId) => records.get(escalationId),
    listByCase: (caseId) => [...records.values()].filter((record) => record.caseId === caseId),
  };
}

export function createInMemoryRetentionStore(): RetentionStore {
  const records = new Map<string, DisputeRetentionRecord>();
  return {
    upsert: (record) => {
      records.set(record.caseId, record);
      return true;
    },
    read: (caseId) => records.get(caseId),
    listBySociety: (societyId) =>
      [...records.values()].filter((record) => record.societyId === societyId),
  };
}

export function createInMemoryFinanceLinkStore(): FinanceLinkStore {
  const records = new Map<string, FinanceLinkRequest>();
  return {
    insert: (request) => {
      if (records.has(request.id)) {
        return false;
      }
      records.set(request.id, request);
      return true;
    },
    update: (request) => {
      if (!records.has(request.id)) {
        return false;
      }
      records.set(request.id, request);
      return true;
    },
    read: (linkId) => records.get(linkId),
    listByCase: (caseId) => [...records.values()].filter((record) => record.caseId === caseId),
  };
}

export function createInMemoryMoveOutLinkStore(): MoveOutLinkStore {
  const records = new Map<string, MoveOutLinkRequest>();
  return {
    insert: (request) => {
      if (records.has(request.id)) {
        return false;
      }
      records.set(request.id, request);
      return true;
    },
    update: (request) => {
      if (!records.has(request.id)) {
        return false;
      }
      records.set(request.id, request);
      return true;
    },
    read: (linkId) => records.get(linkId),
    listByCase: (caseId) => [...records.values()].filter((record) => record.caseId === caseId),
  };
}

export function createInMemoryCaseAuditSink(): CaseAuditSink & {
  readonly entries: () => readonly CaseAuditEntry[];
} {
  const entries: CaseAuditEntry[] = [];
  return {
    emit: (entry) => {
      entries.push(entry);
    },
    listByCase: (caseId) => entries.filter((entry) => entry.caseId === caseId),
    entries: () => [...entries],
  };
}

export function createInMemoryPlatformAuditSink(): PlatformAuditSink & {
  readonly entries: () => readonly AuditLogEntry[];
} {
  const entries: AuditLogEntry[] = [];
  return {
    emit: (entry) => {
      entries.push(entry);
    },
    entries: () => [...entries],
  };
}

export function createInMemoryNotificationPort(
  notificationChannel = 'in-memory',
): CaseNotificationPort & {
  readonly sent: () => readonly CaseNotification[];
} {
  const notifications: CaseNotification[] = [];
  return {
    notificationChannel,
    isAvailable: () => true,
    send: (notification) => {
      notifications.push(notification);
      return notification;
    },
    listByCase: (caseId) => notifications.filter((entry) => entry.caseId === caseId),
    sent: () => [...notifications],
  };
}

export function createFailClosedEvidenceVault(
  vaultName = 'unwired-document-vault',
): EvidenceVaultPort {
  return {
    vaultName,
    verify: () => VAULT_UNAVAILABLE,
  };
}

export function createFixedClock(start: Date, stepMs = 0): DisputeClock & {
  readonly advance: (ms: number) => Date;
} {
  let current = new Date(start.getTime());
  return {
    now: () => new Date(current.getTime()),
    advance: (ms: number) => {
      current = new Date(current.getTime() + ms + stepMs);
      return new Date(current.getTime());
    },
  };
}

export function createInMemoryIdempotencyLedger(): DisputeIdempotencyLedger {
  return createInMemoryDisputeLedger();
}

export type { Absent };
