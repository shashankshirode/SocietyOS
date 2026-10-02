import type { Absent } from '../../../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../../../core/audit/audit.types';
import type {
  DocumentVaultErrorCode,
  VaultActor,
  VaultClock,
  TraceContext,
  Revision,
} from '../domain/types/primitives';
import { violation, denied, allowedWith } from '../domain/types/primitives';
import type {
  DocumentRecord,
  DocumentVersionRecord,
  DocumentCategoryGroup,
  DocumentOwningEntityType,
  DocumentSensitivity,
  StorageLifecycleState,
  VerificationLifecycleState,
  SignatureLifecycleState,
  ExpiryLifecycleState,
  RetentionLifecycleState,
  IntegrityRecord,
  MalwareScanRecord,
  DocumentRetentionPolicyRef,
} from '../domain/types/document.types';
import type { CategoryPolicy, DocumentPolicySet } from '../domain/types/policy.types';
import { findCategoryPolicy, isEffectiveAt, resolvePolicySet } from '../domain/types/policy.types';
import type { UploadIntent, UploadSession, UploadSessionState } from '../domain/types/upload.types';
import type { VerificationCase, VerificationChecklist } from '../domain/types/verification.types';
import type { SignatureEnvelope, SignatureMethod } from '../domain/types/verification.types';
import type { AccessLogEntry, RetrievalTicket, AccessGrant, DocumentAction } from '../domain/types/access.types';
import type { LegalHold, RetentionAssessment, RetentionBasis, DispositionOutcome, RetentionJobOutcome, TraceableRetentionRecord } from '../domain/types/retention.types';
import type { ObservedContentType } from '../domain/engines/integrityEngine';
import {
  canTransitionStorage,
  canTransitionUpload,
  isStorageRetrievable,
  pendingScan,
  unavailableScan,
  isSessionExpired,
  isSessionResumable,
  isSessionHalfValid,
  isQuarantineObjectMissing,
  isScanTerminalClean,
  mustFailClosed,
  isWeakAlgorithm,
} from '../domain/stateMachines/storageStateMachine';
import {
  nextVersionNumber,
  versionLimitReached,
  activateVersion,
  supersedeVersion,
  versionBlocksRetrieval,
  historyOf,
  findVersion,
  assertVersionNotInheriting,
} from '../domain/stateMachines/versionStateMachine';
import {
  computeIntegrity,
  duplicateScope,
  expectedChecksumOrAbsent,
  observedTypeOf,
  validateUploadDeclaration,
  integrityGate,
} from '../domain/engines/integrityEngine';
import { evaluateActionPermission, evaluateTenantBoundary, evaluateAccess } from '../domain/guards/authorizationGuard';
import { createUploadService } from './uploadService';
import { createVerificationService } from './verificationService';
import { createAccessService } from './accessService';
import { createRetentionService } from './retentionService';
import { createExpiryService } from './expiryService';
import type { VaultPorts, ServiceOutcome, CommittedUpload } from './ports';

export type DocumentVaultService = {
  upload: ReturnType<typeof createUploadService>;
  verification: ReturnType<typeof createVerificationService>;
  access: ReturnType<typeof createAccessService>;
  retention: ReturnType<typeof createRetentionService>;
  expiry: ReturnType<typeof createExpiryService>;

  getDocument(documentId: string): DocumentRecord | Absent;
  getDocumentVersions(documentId: string): readonly DocumentVersionRecord[];
  getDocumentHistory(documentId: string): readonly DocumentVersionRecord[];
  getActiveVersion(documentId: string): DocumentVersionRecord | Absent;
  getVerificationCases(documentId: string): readonly VerificationCase[];
  getAccessLogs(documentId: string): readonly AccessLogEntry[];
  getRetrievalTicket(ticketId: string): RetrievalTicket | Absent;
  getAccessGrants(documentId: string): readonly AccessGrant[];
  getLegalHolds(documentId: string): readonly LegalHold[];
  getRetentionHistory(documentId: string): readonly TraceableRetentionRecord[];
  listDocuments(societyId: string): readonly DocumentRecord[];
  listPendingVerificationCases(societyId: string): readonly VerificationCase[];

  sweepExpiredUploads(): readonly string[];
  evaluateAllExpiry(societyId: string): readonly DocumentRecord[];
};

function fail(code: DocumentVaultErrorCode, message: string): ServiceOutcome<never> {
  return { ok: false, code, message };
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function generateRevision(base: Revision): Revision {
  return { revision: base.revision + 1, revisionToken: `rev-${base.revisionToken.split('-').pop()}-${base.revision + 1}` };
}

export function createDocumentVaultService(ports: VaultPorts): DocumentVaultService {
  const upload = createUploadService(ports);
  const verification = createVerificationService({
    verificationCases: ports.verificationCases,
    signatureEnvelopes: ports.signatureEnvelopes,
    audit: ports.audit,
    notifications: ports.notifications,
    clock: ports.clock,
  });
  const access = createAccessService({
    accessLog: ports.accessLog,
    retrievalTickets: ports.retrievalTickets,
    audit: ports.audit,
    clock: ports.clock,
  });
  const retention = createRetentionService({
    legalHolds: ports.legalHolds,
    objects: ports.objects,
    audit: ports.audit,
    clock: ports.clock,
  });
  const expiry = createExpiryService({
    clock: ports.clock,
    documents: {
      list: ports.documents.list,
      update: ports.documents.update,
    },
  });

  const getDocument = (documentId: string): DocumentRecord | Absent => ports.documents.read(documentId);

  const getDocumentVersions = (documentId: string): readonly DocumentVersionRecord[] => ports.versions.listByDocument(documentId);

  const getDocumentHistory = (documentId: string): readonly DocumentVersionRecord[] => {
    const versions = ports.versions.listByDocument(documentId);
    return historyOf(versions, documentId);
  };

  const getActiveVersion = (documentId: string): DocumentVersionRecord | Absent => {
    const document = ports.documents.read(documentId);
    if (!document) return undefined;
    return ports.versions.read(document.currentVersionId);
  };

  const getVerificationCases = (documentId: string): readonly VerificationCase[] => ports.verificationCases.listByDocument(documentId);

  const getAccessLogs = (documentId: string): readonly AccessLogEntry[] => ports.accessLog.listByDocument(documentId);

  const getRetrievalTicket = (ticketId: string): RetrievalTicket | Absent => ports.retrievalTickets.read(ticketId);

  const getAccessGrants = (documentId: string): readonly AccessGrant[] => access.getAccessGrants(documentId);

  const getLegalHolds = (documentId: string): readonly LegalHold[] => ports.legalHolds.listByDocument(documentId);

  const getRetentionHistory = (documentId: string): readonly TraceableRetentionRecord[] => retention.getRetentionHistory(documentId);

  const listDocuments = (societyId: string): readonly DocumentRecord[] => ports.documents.list(societyId);

  const listPendingVerificationCases = (societyId: string): readonly VerificationCase[] => {
    return ports.verificationCases.listBySociety(societyId).filter((c) => c.state === 'OPEN' || c.state === 'IN_REVIEW');
  };

  const sweepExpiredUploads = (): readonly string[] => upload.sweepExpired();

  const evaluateAllExpiry = (societyId: string): readonly DocumentRecord[] => {
    const docs = ports.documents.list(societyId);
    return docs.map((doc) => {
      const newState = expiry.evaluateExpiry(doc);
      if (newState !== doc.expiryLifecycle) {
        return { ...doc, expiryLifecycle: newState };
      }
      return doc;
    });
  };

  return {
    upload,
    verification,
    access,
    retention,
    expiry,
    getDocument,
    getDocumentVersions,
    getDocumentHistory,
    getActiveVersion,
    getVerificationCases,
    getAccessLogs,
    getRetrievalTicket,
    getAccessGrants,
    getLegalHolds,
    getRetentionHistory,
    listDocuments,
    listPendingVerificationCases,
    sweepExpiredUploads,
    evaluateAllExpiry,
  };
}