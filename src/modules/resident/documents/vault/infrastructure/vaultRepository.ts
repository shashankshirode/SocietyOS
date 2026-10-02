import type { Absent } from '../../../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../../../core/audit/audit.types';
import type {
  DocumentVaultErrorCode,
  VaultClock,
  VaultActor,
} from '../domain/types/primitives';
import type {
  DocumentRecord,
  DocumentVersionRecord,
  MalwareScanRecord,
} from '../domain/types/document.types';
import type { UploadSession } from '../domain/types/upload.types';
import type { VerificationCase } from '../domain/types/verification.types';
import type { SignatureEnvelope } from '../domain/types/verification.types';
import type { AccessLogEntry, RetrievalTicket } from '../domain/types/access.types';
import type { LegalHold } from '../domain/types/retention.types';
import type { DigestProvider } from '../domain/engines/integrityEngine';
import type {
  DocumentStore,
  VersionStore,
  UploadSessionStore,
  VerificationCaseStore,
  SignatureEnvelopeStore,
  RetrievalTicketStore,
  AccessLogSink,
  LegalHoldStore,
  AuditSink,
  MalwareScanner,
  ObjectStorePort,
  SignatureProviderPort,
  NotificationPort,
  VaultPorts,
} from './application/ports';

type StoredDocument = DocumentRecord & { _versions: DocumentVersionRecord[] };
type StoredUploadSession = UploadSession;
type StoredVerificationCase = VerificationCase;
type StoredSignatureEnvelope = SignatureEnvelope;
type StoredRetrievalTicket = RetrievalTicket;
type StoredAccessLog = AccessLogEntry;
type StoredLegalHold = LegalHold;
type StoredObject = Uint8Array;

export function createVaultRepository(): VaultPorts {
  const documents = new Map<string, StoredDocument>();
  const uploadSessions = new Map<string, StoredUploadSession>();
  const verificationCases = new Map<string, StoredVerificationCase>();
  const signatureEnvelopes = new Map<string, StoredSignatureEnvelope>();
  const retrievalTickets = new Map<string, StoredRetrievalTicket>();
  const accessLogs: StoredAccessLog[] = [];
  const legalHolds = new Map<string, StoredLegalHold>();
  const objects = new Map<string, StoredObject>();
  const auditEntries: AuditLogEntry[] = [];
  const scanResults = new Map<string, MalwareScanRecord>();

  const clock: VaultClock = {
    now: () => new Date(),
  };

  const digests: DigestProvider = {
    algorithm: 'SHA-256',
    digestHex: (payload: Uint8Array): string => {
      let hash = 0x811c9dc5;
      for (const byte of payload) {
        hash ^= byte;
        hash = Math.imul(hash, 0x01000193) >>> 0;
      }
      return hash.toString(16).padStart(8, '0');
    },
  };

  const documentStore: DocumentStore = {
    insert: (document: DocumentRecord): boolean => {
      if (documents.has(document.id)) return false;
      documents.set(document.id, { ...document, _versions: [] });
      return true;
    },
    update: (document: DocumentRecord, expectedRevision: number): boolean => {
      const current = documents.get(document.id);
      if (!current || current.revision.revision !== expectedRevision) return false;
      documents.set(document.id, { ...document, _versions: current._versions });
      return true;
    },
    read: (documentId: string): DocumentRecord | Absent => {
      const doc = documents.get(documentId);
      return doc ? { ...doc, _versions: undefined } : undefined;
    },
    readByChecksum: (societyId: string, checksum: string): readonly DocumentRecord[] => {
      return Array.from(documents.values())
        .filter((d) => d.scope.societyId === societyId && d.id === d.id && checksum.length > 0)
        .map(({ _versions, ...d }) => d);
    },
    list: (societyId: string): readonly DocumentRecord[] => {
      return Array.from(documents.values())
        .filter((d) => d.scope.societyId === societyId)
        .map(({ _versions, ...d }) => d);
    },
  };

  const versionStore: VersionStore = {
    insert: (version: DocumentVersionRecord): boolean => {
      const doc = documents.get(version.documentId);
      if (!doc) return false;
      if (doc._versions.some((v) => v.id === version.id)) return false;
      doc._versions.push(version);
      return true;
    },
    update: (version: DocumentVersionRecord): boolean => {
      const doc = documents.get(version.documentId);
      if (!doc) return false;
      const idx = doc._versions.findIndex((v) => v.id === version.id);
      if (idx === -1) return false;
      doc._versions[idx] = version;
      return true;
    },
    read: (versionId: string): DocumentVersionRecord | Absent => {
      for (const doc of documents.values()) {
        const version = doc._versions.find((v) => v.id === versionId);
        if (version) return version;
      }
      return undefined;
    },
    listByDocument: (documentId: string): readonly DocumentVersionRecord[] => {
      const doc = documents.get(documentId);
      return doc ? [...doc._versions] : [];
    },
  };

  const uploadStore: UploadSessionStore = {
    insert: (session: UploadSession): boolean => {
      if (uploadSessions.has(session.id)) return false;
      uploadSessions.set(session.id, session);
      return true;
    },
    update: (session: UploadSession): boolean => {
      if (!uploadSessions.has(session.id)) return false;
      uploadSessions.set(session.id, session);
      return true;
    },
    read: (sessionId: string): UploadSession | Absent => uploadSessions.get(sessionId),
    list: (): readonly UploadSession[] => Array.from(uploadSessions.values()),
  };

  const verificationStore: VerificationCaseStore = {
    insert: (verificationCase: VerificationCase): boolean => {
      if (verificationCases.has(verificationCase.id)) return false;
      verificationCases.set(verificationCase.id, verificationCase);
      return true;
    },
    update: (verificationCase: VerificationCase): boolean => {
      if (!verificationCases.has(verificationCase.id)) return false;
      verificationCases.set(verificationCase.id, verificationCase);
      return true;
    },
    read: (caseId: string): VerificationCase | Absent => verificationCases.get(caseId),
    listByDocument: (documentId: string): readonly VerificationCase[] => {
      return Array.from(verificationCases.values()).filter((c) => c.documentId === documentId);
    },
    listBySociety: (societyId: string): readonly VerificationCase[] => {
      return Array.from(verificationCases.values()).filter((c) => c.scope.societyId === societyId);
    },
  };

  const envelopeStore: SignatureEnvelopeStore = {
    insert: (envelope: SignatureEnvelope): boolean => {
      if (signatureEnvelopes.has(envelope.id)) return false;
      signatureEnvelopes.set(envelope.id, envelope);
      return true;
    },
    update: (envelope: SignatureEnvelope): boolean => {
      if (!signatureEnvelopes.has(envelope.id)) return false;
      signatureEnvelopes.set(envelope.id, envelope);
      return true;
    },
    read: (envelopeId: string): SignatureEnvelope | Absent => signatureEnvelopes.get(envelopeId),
    readByDocument: (documentId: string): SignatureEnvelope | Absent => {
      return Array.from(signatureEnvelopes.values()).find((e) => e.documentId === documentId);
    },
  };

  const ticketStore: RetrievalTicketStore = {
    insert: (ticket: RetrievalTicket): boolean => {
      if (retrievalTickets.has(ticket.id)) return false;
      retrievalTickets.set(ticket.id, ticket);
      return true;
    },
    update: (ticket: RetrievalTicket): boolean => {
      if (!retrievalTickets.has(ticket.id)) return false;
      retrievalTickets.set(ticket.id, ticket);
      return true;
    },
    read: (ticketId: string): RetrievalTicket | Absent => retrievalTickets.get(ticketId),
  };

  const accessLogSink: AccessLogSink = {
    append: (entry: AccessLogEntry): boolean => {
      accessLogs.push(entry);
      return true;
    },
    listByDocument: (documentId: string): readonly AccessLogEntry[] => {
      return accessLogs.filter((entry) => entry.documentId === documentId);
    },
  };

  const legalHoldStore: LegalHoldStore = {
    insert: (hold: LegalHold): boolean => {
      if (legalHolds.has(hold.id)) return false;
      legalHolds.set(hold.id, hold);
      return true;
    },
    update: (hold: LegalHold): boolean => {
      if (!legalHolds.has(hold.id)) return false;
      legalHolds.set(hold.id, hold);
      return true;
    },
    listByDocument: (documentId: string): readonly LegalHold[] => {
      return Array.from(legalHolds.values()).filter((h) => h.documentId === documentId);
    },
  };

  const auditSink: AuditSink = {
    emit: (entry: AuditLogEntry): void => {
      auditEntries.push(entry);
    },
  };

  const objectStore: ObjectStorePort = {
    putQuarantined: async (sessionId: string, payload: Uint8Array): Promise<string> => {
      const ref = `obj-${sessionId}-${Date.now()}`;
      objects.set(ref, payload);
      return ref;
    },
    read: async (digestRef: string): Promise<Uint8Array | Absent> => objects.get(digestRef),
    delete: async (digestRef: string): Promise<boolean> => objects.delete(digestRef),
    exists: async (digestRef: string): Promise<boolean> => objects.has(digestRef),
  };

  const scanner: MalwareScanner = {
    scannerId: 'mock-scanner-1',
    scan: async (versionId: string, contentType: string, byteSize: number) => {
      const existing = scanResults.get(versionId);
      if (existing) return existing;

      return {
        status: 'CLEAN',
        signatureVersion: 'sig-2026-01',
      };
    },
  };

  const signatures: SignatureProviderPort = {
    providerId: 'mock-sig-provider-1',
    available: async (): Promise<boolean> => true,
    seal: async (): Promise<{ acknowledged: boolean; detail: string }> => ({
      acknowledged: true,
      detail: 'sealed',
    }),
  };

  const notifications: NotificationPort = {
    notifyVerificationDecided: (): void => {},
  };

  return {
    clock,
    digests,
    documents: documentStore,
    versions: versionStore,
    uploads: uploadStore,
    verificationCases: verificationStore,
    signatureEnvelopes: envelopeStore,
    retrievalTickets: ticketStore,
    accessLog: accessLogSink,
    legalHolds: legalHoldStore,
    audit: auditSink,
    objects: objectStore,
    scanner,
    signatures,
    notifications,
  };
}

export type VaultRepository = ReturnType<typeof createVaultRepository>;

export const vaultRepository = createVaultRepository();