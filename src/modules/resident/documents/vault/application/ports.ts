import type { Absent } from '../../../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../../../core/audit/audit.types';
import type { DocumentVaultErrorCode, VaultClock } from '../domain/types/primitives';
import type { DocumentRecord, DocumentVersionRecord } from '../domain/types/document.types';
import type { UploadSession } from '../domain/types/upload.types';
import type { VerificationCase } from '../domain/types/verification.types';
import type { SignatureEnvelope } from '../domain/types/verification.types';
import type { AccessLogEntry, RetrievalTicket } from '../domain/types/access.types';
import type { LegalHold } from '../domain/types/retention.types';
import type { DigestProvider } from '../domain/engines/integrityEngine';
import type { DocumentPolicySet } from '../domain/types/policy.types';
import type { CommittedUpload } from './uploadService';

export type DocumentStore = {
  readonly insert: (document: DocumentRecord) => boolean;
  readonly update: (document: DocumentRecord, expectedRevision: number) => boolean;
  readonly read: (documentId: string) => DocumentRecord | Absent;
  readonly readByChecksum: (societyId: string, checksum: string) => readonly DocumentRecord[];
  readonly list: (societyId: string) => readonly DocumentRecord[];
};

export type VersionStore = {
  readonly insert: (version: DocumentVersionRecord) => boolean;
  readonly update: (version: DocumentVersionRecord) => boolean;
  readonly read: (versionId: string) => DocumentVersionRecord | Absent;
  readonly listByDocument: (documentId: string) => readonly DocumentVersionRecord[];
};

export type UploadSessionStore = {
  readonly insert: (session: UploadSession) => boolean;
  readonly update: (session: UploadSession) => boolean;
  readonly read: (sessionId: string) => UploadSession | Absent;
  readonly list: () => readonly UploadSession[];
};

export type VerificationCaseStore = {
  readonly insert: (verificationCase: VerificationCase) => boolean;
  readonly update: (verificationCase: VerificationCase) => boolean;
  readonly read: (caseId: string) => VerificationCase | Absent;
  readonly listByDocument: (documentId: string) => readonly VerificationCase[];
  readonly listBySociety: (societyId: string) => readonly VerificationCase[];
};

export type SignatureEnvelopeStore = {
  readonly insert: (envelope: SignatureEnvelope) => boolean;
  readonly update: (envelope: SignatureEnvelope) => boolean;
  readonly read: (envelopeId: string) => SignatureEnvelope | Absent;
  readonly readByDocument: (documentId: string) => SignatureEnvelope | Absent;
};

export type RetrievalTicketStore = {
  readonly insert: (ticket: RetrievalTicket) => boolean;
  readonly update: (ticket: RetrievalTicket) => boolean;
  readonly read: (ticketId: string) => RetrievalTicket | Absent;
};

export type AccessLogSink = {
  readonly append: (entry: AccessLogEntry) => boolean;
  readonly listByDocument: (documentId: string) => readonly AccessLogEntry[];
};

export type LegalHoldStore = {
  readonly insert: (hold: LegalHold) => boolean;
  readonly update: (hold: LegalHold) => boolean;
  readonly listByDocument: (documentId: string) => readonly LegalHold[];
};

export type AuditSink = {
  readonly emit: (entry: AuditLogEntry) => void;
};

export type MalwareScanner = {
  readonly scannerId: string;
  readonly scan: (
    versionId: string,
    contentType: string,
    byteSize: number,
  ) => Promise<
    | { readonly status: 'CLEAN'; readonly signatureVersion: string }
    | { readonly status: 'INFECTED'; readonly signatureVersion: string; readonly detail: string }
    | { readonly status: 'UNAVAILABLE'; readonly detail: string }
  >;
};

export type ObjectStorePort = {
  readonly putQuarantined: (sessionId: string, payload: Uint8Array) => Promise<string>;
  readonly read: (digestRef: string) => Promise<Uint8Array | Absent>;
  readonly delete: (digestRef: string) => Promise<boolean>;
  readonly exists: (digestRef: string) => Promise<boolean>;
};

export type SignatureProviderPort = {
  readonly providerId: string;
  readonly available: () => Promise<boolean>;
  readonly seal: (input: {
    envelopeId: string;
    payloadDigest: string;
    signers: readonly { readonly signerId: string; readonly signerRole: string }[];
  }) => Promise<{ readonly acknowledged: boolean; readonly detail: string }>;
};

export type NotificationPort = {
  readonly notifyVerificationDecided: (input: {
    documentId: string;
    societyId: string;
    decidedBy: string;
    decision: string;
  }) => void;
};

export type VaultPorts = {
  readonly clock: VaultClock;
  readonly digests: DigestProvider;
  readonly documents: DocumentStore;
  readonly versions: VersionStore;
  readonly uploads: UploadSessionStore;
  readonly verificationCases: VerificationCaseStore;
  readonly signatureEnvelopes: SignatureEnvelopeStore;
  readonly retrievalTickets: RetrievalTicketStore;
  readonly accessLog: AccessLogSink;
  readonly legalHolds: LegalHoldStore;
  readonly audit: AuditSink;
  readonly objects: ObjectStorePort;
  readonly scanner: MalwareScanner;
  readonly signatures: SignatureProviderPort;
  readonly notifications: NotificationPort;
};

export type ServiceOutcome<T> =
  | { readonly ok: true; readonly value: T; readonly warnings: readonly string[] }
  | { readonly ok: false; readonly code: DocumentVaultErrorCode; readonly message: string };

export { type DocumentPolicySet } from '../domain/types/policy.types';
export { type CommittedUpload } from './uploadService';
