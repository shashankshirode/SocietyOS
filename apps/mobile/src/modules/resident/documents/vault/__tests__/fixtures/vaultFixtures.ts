import type {
  DocumentStore,
  LegalHoldStore,
  UploadSessionStore,
  VaultPorts,
  VersionStore,
  VerificationCaseStore,
  SignatureEnvelopeStore,
  RetrievalTicketStore,
  AccessLogSink,
} from '../../application/ports';
import type { AuditLogEntry } from '../../../../../../core/audit/audit.types';
import type {
  DocumentRecord,
  DocumentVersionRecord,
  MalwareScanRecord,
} from '../../domain/types/document.types';
import type { DocumentPolicySet, CategoryPolicy } from '../../domain/types/policy.types';
import type { AccessLogEntry, RetrievalTicket } from '../../domain/types/access.types';
import type { SignatureEnvelope, VerificationCase } from '../../domain/types/verification.types';
import type { LegalHold } from '../../domain/types/retention.types';
import type { UploadSession } from '../../domain/types/upload.types';
import type { VaultActor, VaultClock } from '../../domain/types/primitives';

export const FIXED_INSTANT = new Date('2026-03-01T10:00:00.000Z');

export function testClock(start: Date = FIXED_INSTANT): VaultClock & { advance: (ms: number) => void } {
  let current = start.getTime();
  return {
    now: () => new Date(current),
    advance: (ms: number) => {
      current += ms;
    },
  };
}

export function makeActor(overrides: Partial<VaultActor> = {}): VaultActor {
  return {
    userId: 'user-owner-1',
    role: 'RESIDENT_OWNER',
    actorType: 'RESIDENT_OWNER',
    societyId: 'soc-1',
    sessionId: 'sess-1',
    authenticatedAt: FIXED_INSTANT.toISOString(),
    ...overrides,
  };
}

export const PDF_BYTES = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37, 0x0a, 0x25]);

export const PNG_BYTES = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x01,
]);

export const ELF_BYTES = new Uint8Array([0x7f, 0x45, 0x4c, 0x46, 0x02, 0x01, 0x01, 0x00]);

export const TEXT_BYTES = new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x0a]);

export const FNV_OFFSET = 0x811c9dc5;

export function digestHex(payload: Uint8Array): string {
  let hash = FNV_OFFSET;
  for (const byte of payload) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

export const testDigests = { algorithm: 'SHA-256' as const, digestHex };

export function category(overrides: Partial<CategoryPolicy> = {}): CategoryPolicy {
  return {
    categoryCode: 'OWNER_KYC',
    categoryGroup: 'OWNER',
    displayName: 'Owner identity document',
    allowedEntityTypes: ['OWNER', 'USER', 'RESIDENT'],
    allowedMimeTypes: [
      { mimeType: 'application/pdf', maxBytes: 5_000_000, requiresMalwareScan: true, allowsThumbnail: false },
      { mimeType: 'image/png', maxBytes: 2_000_000, requiresMalwareScan: true, allowsThumbnail: true },
    ],
    requiresVerification: true,
    requiresSignature: true,
    signatureMethod: 'ADMIN_DIGITAL',
    defaultSensitivity: 'SENSITIVE',
    allowedVisibilities: ['OWN_ENTITY_ONLY', 'SOCIETY_COMMITTEE'],
    expiryApplicable: false,
    defaultExpiryDays: undefined,
    retentionPolicyId: 'ret-owner-kyc',
    minimumRequiredChecklistItems: 2,
    ...overrides,
  };
}

export function policySet(overrides: Partial<DocumentPolicySet> = {}): DocumentPolicySet {
  return {
    policySetId: 'pol-1',
    version: 1,
    window: { effectiveFrom: '2026-01-01T00:00:00.000Z', effectiveTo: undefined },
    categories: [category()],
    sensitivities: [
      {
        sensitivity: 'PUBLIC',
        permittedActions: ['VIEW_METADATA', 'VIEW_CONTENT', 'DOWNLOAD'],
        requiresFreshAuthorization: false,
        maximumRetrievalTtlSeconds: 300,
        requiresReasonForExport: false,
        redactActorPII: false,
      },
      {
        sensitivity: 'SENSITIVE',
        permittedActions: [
          'VIEW_METADATA',
          'VIEW_CONTENT',
          'DOWNLOAD',
          'UPLOAD',
          'REPLACE_VERSION',
          'SUBMIT_FOR_VERIFICATION',
          'REQUEST_ACCESS',
          'ARCHIVE',
        ],
        requiresFreshAuthorization: true,
        maximumRetrievalTtlSeconds: 120,
        requiresReasonForExport: true,
        redactActorPII: true,
      },
      {
        sensitivity: 'RESTRICTED',
        permittedActions: ['VIEW_METADATA', 'VIEW_CONTENT', 'DOWNLOAD', 'ARCHIVE', 'VIEW_ACCESS_LOG'],
        requiresFreshAuthorization: true,
        maximumRetrievalTtlSeconds: 60,
        requiresReasonForExport: true,
        redactActorPII: true,
      },
    ],
    historicalAccess: {
      formerOccupantMayAccessOwnSubmitted: true,
      currentOccupantMayAccessPredecessorDocuments: ['MOVE_OUT', 'MOVE_IN'],
      committeeAlwaysAllowed: true,
      auditorAlwaysAllowed: true,
      publicSensitivityVisibleToFormerOccupant: false,
    },
    maximumFileBytes: 10_000_000,
    maximumVersionsPerDocument: 10,
    uploadSessionTtlSeconds: 900,
    maximumRetrievalTtlSeconds: 300,
    allowedIntegrityAlgorithms: ['SHA-256', 'SHA-512'],
    requireQuarantineBeforeAvailability: true,
    requireChecksumVerificationOnRetrieval: true,
    ...overrides,
  };
}

export type TestHarness = {
  readonly ports: VaultPorts;
  readonly documents: Map<string, DocumentRecord>;
  readonly versions: Map<string, DocumentVersionRecord>;
  readonly uploads: Map<string, UploadSession>;
  readonly objects: Map<string, Uint8Array>;
  readonly auditEntries: AuditLogEntry[];
  readonly accessEntries: AccessLogEntry[];
  readonly scanQueue: MalwareScanRecord[];
  setScanResult: (scan: MalwareScanRecord) => void;
  setObjectStoreFailure: (failing: boolean) => void;
};

export function createHarness(options: { readonly clock?: VaultClock } = {}): TestHarness {
  const documents = new Map<string, DocumentRecord>();
  const versions = new Map<string, DocumentVersionRecord>();
  const uploads = new Map<string, UploadSession>();
  const objects = new Map<string, Uint8Array>();
  const auditEntries: AuditLogEntry[] = [];
  const accessEntries: AccessLogEntry[] = [];
  const scanQueue: MalwareScanRecord[] = [];
  let objectStoreFailing = false;
  let queuedScan: MalwareScanRecord = {
    scannerId: 'scanner-1',
    status: 'CLEAN',
    signatureVersion: 'sig-2026-02',
    scannedAt: FIXED_INSTANT.toISOString(),
    detail: undefined,
  };

  const documentStore: DocumentStore = {
    insert: (document) => {
      if (documents.has(document.id)) {
        return false;
      }
      documents.set(document.id, document);
      return true;
    },
    update: (document, expectedRevision) => {
      const current = documents.get(document.id);
      if (current === undefined || current.revision.revision !== expectedRevision) {
        return false;
      }
      documents.set(document.id, document);
      return true;
    },
    read: (documentId) => documents.get(documentId),
    readByChecksum: (societyId, checksum) =>
      Array.from(documents.values()).filter(
        (document) =>
          document.scope.societyId === societyId && document.id === document.id && checksum.length > 0,
      ),
    list: (societyId) =>
      Array.from(documents.values()).filter((document) => document.scope.societyId === societyId),
  };

  const versionStore: VersionStore = {
    insert: (version) => {
      if (versions.has(version.id)) {
        return false;
      }
      versions.set(version.id, version);
      return true;
    },
    update: (version) => versions.set(version.id, version).size >= 0,
    read: (versionId) => versions.get(versionId),
    listByDocument: (documentId) =>
      Array.from(versions.values()).filter((version) => version.documentId === documentId),
  };

  const uploadStore: UploadSessionStore = {
    insert: (session) => {
      if (uploads.has(session.id)) {
        return false;
      }
      uploads.set(session.id, session);
      return true;
    },
    update: (session) => uploads.set(session.id, session).size >= 0,
    read: (sessionId) => uploads.get(sessionId),
    list: () => Array.from(uploads.values()),
  };

  const verificationStore: VerificationCaseStore = {
    insert: () => true,
    update: () => true,
    read: () => undefined,
    listByDocument: () => [],
    listBySociety: () => [],
  };

  const envelopeStore: SignatureEnvelopeStore = {
    insert: () => true,
    update: () => true,
    read: () => undefined,
    readByDocument: () => undefined,
  };

  const ticketStore: RetrievalTicketStore = {
    insert: () => true,
    update: () => true,
    read: () => undefined,
  };

  const accessLog: AccessLogSink = {
    append: (entry) => {
      accessEntries.push(entry);
      return true;
    },
    listByDocument: (documentId) =>
      accessEntries.filter((entry) => entry.documentId === documentId),
  };

  const legalHoldStore: LegalHoldStore = {
    insert: () => true,
    update: () => true,
    listByDocument: () => [],
  };

  const ports: VaultPorts = {
    clock: options.clock ?? testClock(),
    digests: testDigests,
    documents: documentStore,
    versions: versionStore,
    uploads: uploadStore,
    verificationCases: verificationStore,
    signatureEnvelopes: envelopeStore,
    retrievalTickets: ticketStore,
    accessLog,
    legalHolds: legalHoldStore,
    audit: {
      emit: (entry) => {
        auditEntries.push(entry);
      },
    },
    objects: {
      putQuarantined: async (_sessionId, payload) => {
        if (objectStoreFailing) {
          return '';
        }
        const ref = `objref-${objects.size + 1}`;
        objects.set(ref, payload);
        return ref;
      },
      read: async (digestRef) => objects.get(digestRef),
      delete: async (digestRef) => objects.delete(digestRef),
      exists: async (digestRef) => objects.has(digestRef),
    },
    scanner: {
      scannerId: 'scanner-1',
      scan: async () => {
        const next = scanQueue[0] ?? queuedScan;
        if (next.status === 'CLEAN') {
          return { status: 'CLEAN' as const, signatureVersion: next.signatureVersion ?? 'sig-unknown' };
        }
        if (next.status === 'INFECTED') {
          return {
            status: 'INFECTED' as const,
            signatureVersion: next.signatureVersion ?? 'sig-unknown',
            detail: next.detail ?? 'infected',
          };
        }
        return { status: 'UNAVAILABLE' as const, detail: next.detail ?? 'scanner offline' };
      },
    },
    signatures: {
      providerId: 'sig-provider-1',
      available: async () => true,
      seal: async () => ({ acknowledged: true, detail: 'sealed' }),
    },
    notifications: {
      notifyVerificationDecided: () => undefined,
    },
  };

  return {
    ports,
    documents,
    versions,
    uploads,
    objects,
    auditEntries,
    accessEntries,
    scanQueue,
    setScanResult: (scan) => {
      queuedScan = scan;
    },
    setObjectStoreFailure: (failing) => {
      objectStoreFailing = failing;
    },
  };
}

export function seedDocument(
  harness: TestHarness,
  document: DocumentRecord,
  version: DocumentVersionRecord,
): void {
  harness.versions.set(version.id, version);
  harness.documents.set(document.id, document);
}

export type { VerificationCase, SignatureEnvelope, LegalHold, RetrievalTicket, AccessLogEntry };
