import type {
  DocumentRecord,
  DocumentVersionRecord,
  IntegrityAlgorithm,
  MalwareScanRecord,
} from '../domain/types/document.types';
import type { CategoryPolicy, DocumentPolicySet, SignatureMethodPolicy } from '../domain/types/policy.types';
import { findCategoryPolicy } from '../domain/types/policy.types';
import type { Absent } from '../../../../../shared/types/absence.types';
import type { AuditLogEntry } from '../../../../../core/audit/audit.types';
import type {
  ResumeDirective,
  UploadIntent,
  UploadScanSource,
  UploadSession,
  UploadSessionState,
} from '../domain/types/upload.types';
import {
  canTransitionUpload,
  isQuarantineObjectMissing,
  isScanTerminalClean,
  isSessionExpired,
  isSessionHalfValid,
  isSessionResumable,
  pendingScan,
  unavailableScan,
} from '../domain/stateMachines/storageStateMachine';
import {
  activateVersion,
  nextVersionNumber,
  supersedeVersion,
  versionLimitReached,
} from '../domain/stateMachines/versionStateMachine';
import {
  computeIntegrity,
  duplicateScope,
  expectedChecksumOrAbsent,
  observedTypeOf,
  validateUploadDeclaration,
  type ObservedContentType,
} from '../domain/engines/integrityEngine';
import { evaluateActionPermission, evaluateTenantBoundary } from '../domain/guards/authorizationGuard';
import { violation, type DocumentVaultViolation, type VaultActor } from '../domain/types/primitives';
import type { ServiceOutcome, VaultPorts } from './ports';

export type UploadService = {
  readonly initiate: (
    actor: VaultActor,
    policy: DocumentPolicySet,
    intent: UploadIntent,
    head: Uint8Array,
    idempotencyKey: string,
  ) => ServiceOutcome<UploadSession>;
  readonly recordProgress: (
    actor: VaultActor,
    sessionId: string,
    bytesReceived: number,
  ) => ServiceOutcome<UploadSession>;
  readonly resumeDirective: (actor: VaultActor, sessionId: string) => ServiceOutcome<ResumeDirective>;
  readonly completeBytes: (
    actor: VaultActor,
    sessionId: string,
    payload: Uint8Array,
  ) => Promise<ServiceOutcome<UploadSession>>;
  readonly recordScanResult: (
    source: UploadScanSource,
    sessionId: string,
    scan: MalwareScanRecord,
  ) => Promise<ServiceOutcome<UploadSession>>;
  readonly commit: (
    actor: VaultActor,
    policy: DocumentPolicySet,
    sessionId: string,
    observed: ObservedContentType,
  ) => Promise<ServiceOutcome<CommittedUpload>>;
  readonly abandon: (actor: VaultActor, sessionId: string, reason: string) => ServiceOutcome<UploadSession>;
  readonly sweepExpired: () => readonly string[];
};

export type CommittedUpload = {
  readonly session: UploadSession;
  readonly document: DocumentRecord;
  readonly version: DocumentVersionRecord;
};

function fail(code: DocumentVaultViolation['code'], message: string): ServiceOutcome<never> {
  return { ok: false, code, message };
}

function firstViolation(violations: readonly DocumentVaultViolation[]): DocumentVaultViolation {
  return violations[0] ?? violation('VALIDATION_FAILED', 'request', 'Request rejected.');
}

function advance(
  session: UploadSession,
  next: UploadSessionState,
  patch: Partial<UploadSession> = {},
): UploadSession {
  const revision = session.revision.revision + 1;
  return {
    ...session,
    ...patch,
    state: next,
    revision: { revision, revisionToken: `rev-${session.id}-${revision}` },
  };
}

function sessionBelongsToActor(session: UploadSession, actor: VaultActor): boolean {
  return session.initiatedBy === actor.userId && session.scope.societyId === actor.societyId;
}

export function createUploadService(ports: VaultPorts): UploadService {
  const now = (): string => ports.clock.now().toISOString();

  const persist = (session: UploadSession): ServiceOutcome<UploadSession> =>
    ports.uploads.update(session)
      ? { ok: true, value: session, warnings: [] }
      : fail('CONCURRENT_WRITE', `Upload session ${session.id} was modified concurrently.`);

  const initiate: UploadService['initiate'] = (actor, policy, intent, head, idempotencyKey) => {
    if (idempotencyKey.trim().length === 0) {
      return fail('IDEMPOTENCY_KEY_REQUIRED', 'An idempotency key is required to initiate an upload.');
    }
    if (intent.scope.societyId !== actor.societyId) {
      return fail('CROSS_SOCIETY_BLOCKED', 'The upload scope does not match the authenticated society.');
    }
    const permission = evaluateActionPermission(
      actor,
      intent.documentId === undefined ? 'UPLOAD' : 'REPLACE_VERSION',
    );
    if (!permission.allowed) {
      return fail('ACTOR_NOT_AUTHORIZED', firstViolation(permission.violations).detail ?? 'Not authorized.');
    }
    if (intent.title.trim().length === 0 || intent.declaredFileName.trim().length === 0) {
      return fail('VALIDATION_FAILED', 'A document title and file name are required.');
    }
    if (ports.digests.algorithm !== intent.integrityAlgorithm) {
      return fail(
        'INTEGRITY_WEAK_ALGORITHM',
        `The platform digest provider supplies ${ports.digests.algorithm}, not ${intent.integrityAlgorithm}.`,
      );
    }

    const sessionId = `ups-${idempotencyKey}`;
    const replay = ports.uploads.read(sessionId);
    if (replay !== undefined) {
      return { ok: true, value: replay, warnings: ['IDEMPOTENT_REPLAY'] };
    }

    const observed = observedTypeOf(head);
    const validation = validateUploadDeclaration({
      categoryCode: intent.categoryCode,
      declaredMimeType: intent.declaredMimeType,
      declaredByteSize: intent.declaredByteSize,
      integrityAlgorithm: intent.integrityAlgorithm,
      observed,
      policy,
    });
    if (!validation.allowed) {
      const blocking = validation.violations[0];
      return fail(
        blocking?.code ?? 'VALIDATION_FAILED',
        blocking?.detail ?? 'Upload declaration rejected by policy.',
      );
    }
    if (findCategoryPolicy(policy, intent.categoryCode) === undefined) {
      return fail('POLICY_CONFIG_INVALID', `Category ${intent.categoryCode} is not configured.`);
    }

    let targetVersionNumber = 1;
    if (intent.documentId !== undefined) {
      const existing = ports.documents.read(intent.documentId);
      if (existing === undefined) {
        return fail('AGGREGATE_NOT_FOUND', `Document ${intent.documentId} does not exist.`);
      }
      const boundary = evaluateTenantBoundary(actor, existing);
      if (!boundary.allowed) {
        return fail(
          'CROSS_SOCIETY_BLOCKED',
          firstViolation(boundary.violations).detail ?? 'Cross-society access blocked.',
        );
      }
      if (existing.categoryGroup !== intent.categoryGroup) {
        return fail(
          'PRECONDITION_FAILED',
          `A new version must stay in category group ${existing.categoryGroup}.`,
        );
      }
      if (versionLimitReached(existing, policy.maximumVersionsPerDocument)) {
        return fail('VERSION_SEQUENCE_CONFLICT', 'The document has reached its configured version limit.');
      }
      targetVersionNumber = nextVersionNumber(existing);
    }

    const session: UploadSession = {
      id: sessionId,
      scope: intent.scope,
      categoryGroup: intent.categoryGroup,
      categoryCode: intent.categoryCode,
      title: intent.title.trim(),
      documentId: intent.documentId,
      targetVersionNumber,
      state: 'INITIATED',
      declaredFileName: intent.declaredFileName,
      declaredMimeType: intent.declaredMimeType,
      declaredByteSize: intent.declaredByteSize,
      bytesReceived: 0,
      resumeToken: `rt-${idempotencyKey}`,
      integrityAlgorithm: intent.integrityAlgorithm,
      expectedChecksum: expectedChecksumOrAbsent(intent.expectedChecksum),
      computedIntegrity: undefined,
      objectDigestRef: undefined,
      malwareScan: pendingScan(ports.scanner.scannerId, 'PENDING', undefined),
      failureCode: undefined,
      failureDetail: undefined,
      initiatedBy: actor.userId,
      initiatedAt: now(),
      expiresAt: new Date(ports.clock.now().getTime() + policy.uploadSessionTtlSeconds * 1000).toISOString(),
      committedAt: undefined,
      committedVersionId: undefined,
      revision: { revision: 1, revisionToken: `rev-${sessionId}-1` },
      trace: { correlationId: idempotencyKey, causationId: undefined },
    };

    return ports.uploads.insert(session)
      ? { ok: true, value: session, warnings: [] }
      : fail('CONCURRENT_WRITE', `Upload session ${sessionId} already exists.`);
  };

  const recordProgress: UploadService['recordProgress'] = (actor, sessionId, bytesReceived) => {
    const session = ports.uploads.read(sessionId);
    if (session === undefined) {
      return fail('AGGREGATE_NOT_FOUND', `Upload session ${sessionId} does not exist.`);
    }
    if (!sessionBelongsToActor(session, actor)) {
      return fail('ACTOR_NOT_AUTHORIZED', 'The upload session belongs to a different actor.');
    }
    if (isSessionHalfValid(session)) {
      return fail('PRECONDITION_FAILED', 'The upload session is inconsistent and must be abandoned.');
    }
    if (isSessionExpired(session, ports.clock)) {
      return fail('UPLOAD_NOT_RESUMABLE', 'The upload session has expired.');
    }
    if (!isSessionResumable(session, ports.clock)) {
      return fail('UPLOAD_NOT_RESUMABLE', `Upload session is ${session.state} and cannot accept bytes.`);
    }
    if (bytesReceived < session.bytesReceived) {
      return fail('UPLOAD_NOT_RESUMABLE', 'Reported progress moved backwards.');
    }
    if (bytesReceived > session.declaredByteSize) {
      return fail('UPLOAD_SIZE_MISMATCH', 'Reported progress exceeds the declared byte size.');
    }
    if (bytesReceived === session.bytesReceived) {
      return { ok: true, value: session, warnings: [] };
    }
    const transition = canTransitionUpload(session.state, 'UPLOADING');
    if (!transition.allowed) {
      return fail('ILLEGAL_TRANSITION', transition.violation.detail ?? 'Illegal upload transition.');
    }
    return persist(advance(session, 'UPLOADING', { bytesReceived }));
  };

  const resumeDirective: UploadService['resumeDirective'] = (actor, sessionId) => {
    const session = ports.uploads.read(sessionId);
    if (session === undefined) {
      return fail('AGGREGATE_NOT_FOUND', `Upload session ${sessionId} does not exist.`);
    }
    if (!sessionBelongsToActor(session, actor)) {
      return fail('ACTOR_NOT_AUTHORIZED', 'The upload session belongs to a different actor.');
    }
    if (isSessionHalfValid(session)) {
      return fail('PRECONDITION_FAILED', 'The upload session is inconsistent and must be abandoned.');
    }
    if (isSessionExpired(session, ports.clock)) {
      return fail('UPLOAD_NOT_RESUMABLE', 'The upload session has expired and cannot be resumed.');
    }
    if (!isSessionResumable(session, ports.clock)) {
      return fail('UPLOAD_NOT_RESUMABLE', `Upload session is ${session.state} and cannot be resumed.`);
    }
    return {
      ok: true,
      value: {
        resumable: true,
        resumeToken: session.resumeToken,
        nextByteOffset: session.bytesReceived,
      },
      warnings: [],
    };
  };

  const completeBytes: UploadService['completeBytes'] = async (actor, sessionId, payload) => {
    const session = ports.uploads.read(sessionId);
    if (session === undefined) {
      return fail('AGGREGATE_NOT_FOUND', `Upload session ${sessionId} does not exist.`);
    }
    if (!sessionBelongsToActor(session, actor)) {
      return fail('ACTOR_NOT_AUTHORIZED', 'The upload session belongs to a different actor.');
    }
    if (isSessionHalfValid(session)) {
      return fail('PRECONDITION_FAILED', 'The upload session is inconsistent and must be abandoned.');
    }
    if (isSessionExpired(session, ports.clock)) {
      return fail('UPLOAD_NOT_RESUMABLE', 'The upload session expired before its bytes were received.');
    }
    if (payload.length !== session.declaredByteSize) {
      return fail(
        'UPLOAD_SIZE_MISMATCH',
        `Received ${payload.length} bytes but ${session.declaredByteSize} were declared.`,
      );
    }
    const transition = canTransitionUpload(session.state, 'BYTES_COMPLETE');
    if (!transition.allowed) {
      return fail('ILLEGAL_TRANSITION', transition.violation.detail ?? 'Illegal upload transition.');
    }

    const integrity = computeIntegrity(payload, ports.digests, ports.clock);
    if (session.expectedChecksum !== undefined && integrity.checksum !== session.expectedChecksum) {
      return fail(
        'INTEGRITY_CHECKSUM_MISMATCH',
        'The full payload digest does not match the declared checksum.',
      );
    }

    const digestRef = await ports.objects.putQuarantined(session.id, payload);
    if (digestRef.trim().length === 0) {
      return fail('PRECONDITION_FAILED', 'The quarantine store did not return an object reference.');
    }

    const staged = advance(session, 'BYTES_COMPLETE', {
      bytesReceived: payload.length,
      computedIntegrity: integrity,
      objectDigestRef: digestRef,
    });
    const saved = await persist(staged);
    if (!saved.ok) {
      return saved;
    }

    const quarantineTransition = canTransitionUpload(staged.state, 'QUARANTINED');
    if (!quarantineTransition.allowed) {
      return fail(
        'ILLEGAL_TRANSITION',
        quarantineTransition.violation.detail ?? 'Illegal quarantine transition.',
      );
    }
    return persist(advance(staged, 'QUARANTINED'));
  };

  const recordScanResult: UploadService['recordScanResult'] = async (source, sessionId, scan) => {
    const session = ports.uploads.read(sessionId);
    if (session === undefined) {
      return fail('AGGREGATE_NOT_FOUND', `Upload session ${sessionId} does not exist.`);
    }
    if (isSessionHalfValid(session)) {
      return fail('PRECONDITION_FAILED', 'The upload session is inconsistent and must be abandoned.');
    }
    if (source.kind === 'SCANNER_CALLBACK') {
      if (source.scannerId !== ports.scanner.scannerId) {
        return fail('ACTOR_NOT_AUTHORIZED', 'The scan result came from an untrusted scanner.');
      }
    } else if (
      source.actorUserId !== session.initiatedBy ||
      source.societyId !== session.scope.societyId
    ) {
      return fail('ACTOR_NOT_AUTHORIZED', 'The upload session belongs to a different actor.');
    }
    if (isQuarantineObjectMissing(session)) {
      return fail('PRECONDITION_FAILED', 'The quarantined object reference is missing for this session.');
    }
    if (scan.scannerId !== ports.scanner.scannerId) {
      return fail('ACTOR_NOT_AUTHORIZED', 'The scan record names an untrusted scanner.');
    }
    if (session.state === 'COMMITTED' || session.state === 'FAILED' || session.state === 'ABANDONED') {
      return { ok: true, value: session, warnings: ['SCAN_RESULT_IGNORED'] };
    }

    const scanning = canTransitionUpload(session.state, 'SCANNING');
    if (!scanning.allowed) {
      return fail('ILLEGAL_TRANSITION', scanning.violation.detail ?? 'Scan cannot begin from this state.');
    }
    const staged = advance(session, 'SCANNING', { malwareScan: scan });
    const saved = await persist(staged);
    if (!saved.ok) {
      return saved;
    }

    if (scan.status === 'INFECTED') {
      const failure = canTransitionUpload(staged.state, 'FAILED');
      if (!failure.allowed) {
        return fail('ILLEGAL_TRANSITION', failure.violation.detail ?? 'Illegal failure transition.');
      }
      return persist(
        advance(saved.value, 'FAILED', {
          failureCode: 'MALWARE_SCAN_FAILED',
          failureDetail: 'The object failed malware scanning and remains quarantined.',
        }),
      );
    }

    if (scan.status === 'CLEAN') {
      return { ok: true, value: saved.value, warnings: [] };
    }

    const holdTransition = canTransitionUpload(saved.value.state, 'QUARANTINED');
    if (!holdTransition.allowed) {
      return fail('ILLEGAL_TRANSITION', holdTransition.violation.detail ?? 'Illegal quarantine transition.');
    }
    return persist(
      advance(saved.value, 'QUARANTINED', {
        malwareScan:
          scan.status === 'UNAVAILABLE'
            ? unavailableScan(ports.scanner.scannerId, 'The malware scanner is unavailable; the object stays quarantined.')
            : scan,
        failureCode: 'MALWARE_SCAN_PENDING',
        failureDetail: 'The object stays quarantined until a clean malware scan is recorded.',
      }),
    );
  };

  const commit: UploadService['commit'] = async (actor, policy, sessionId, observed) => {
    const session = ports.uploads.read(sessionId);
    if (session === undefined) {
      return fail('AGGREGATE_NOT_FOUND', `Upload session ${sessionId} does not exist.`);
    }
    if (!sessionBelongsToActor(session, actor)) {
      return fail('ACTOR_NOT_AUTHORIZED', 'The upload session belongs to a different actor.');
    }
    if (isSessionHalfValid(session)) {
      return fail('PRECONDITION_FAILED', 'The upload session is inconsistent and must be abandoned.');
    }
    if (session.state === 'COMMITTED') {
      return { ok: true, value: stagedCommitted(ports, session), warnings: ['ALREADY_COMMITTED'] };
    }
    if (policy.requireQuarantineBeforeAvailability && session.state === 'BYTES_COMPLETE') {
      return fail('MALWARE_SCAN_PENDING', 'The object must be quarantined and scanned before commit.');
    }
    if (session.objectDigestRef === undefined || session.computedIntegrity === undefined) {
      return fail('PRECONDITION_FAILED', 'The session has no quarantined object or computed digest to commit.');
    }
    if (isQuarantineObjectMissing(session)) {
      return fail('PRECONDITION_FAILED', 'The quarantined object reference is missing for this session.');
    }
    if (!isScanTerminalClean(session.malwareScan)) {
      return fail('MALWARE_SCAN_PENDING', `Malware scan status is ${session.malwareScan.status}.`);
    }
    if (session.computedIntegrity.verifiedAt === undefined && policy.requireChecksumVerificationOnRetrieval) {
      return fail('INTEGRITY_CHECKSUM_MISMATCH', 'The committed digest was never verified.');
    }
    const transition = canTransitionUpload(session.state, 'COMMITTED');
    if (!transition.allowed) {
      return fail('ILLEGAL_TRANSITION', transition.violation.detail ?? 'Illegal commit transition.');
    }

    const category = findCategoryPolicy(policy, session.categoryCode);
    if (category === undefined) {
      return fail('POLICY_CONFIG_INVALID', `Category ${session.categoryCode} is not configured.`);
    }

    const validation = validateUploadDeclaration({
      categoryCode: session.categoryCode,
      declaredMimeType: session.declaredMimeType,
      declaredByteSize: session.declaredByteSize,
      integrityAlgorithm: session.integrityAlgorithm,
      observed,
      policy,
    });
    if (!validation.allowed) {
      const blocking = firstViolation(validation.violations);
      return fail(blocking.code, blocking.detail ?? 'Rejected.');
    }

    const existingDocument =
      session.documentId === undefined ? undefined : ports.documents.read(session.documentId);
    if (session.documentId !== undefined && existingDocument === undefined) {
      return fail('AGGREGATE_NOT_FOUND', `Document ${session.documentId} no longer exists.`);
    }
    if (existingDocument !== undefined) {
      const boundary = evaluateTenantBoundary(actor, existingDocument);
      if (!boundary.allowed) {
        return fail(
          'CROSS_SOCIETY_BLOCKED',
          firstViolation(boundary.violations).detail ?? 'Cross-society commit blocked.',
        );
      }
    }

    const integrity = session.computedIntegrity;
    if (existingDocument === undefined) {
      const duplicate = duplicateChecksumInScope(ports, session, integrity.checksum);
      if (duplicate !== undefined) {
        return fail(
          'DUPLICATE_CONTENT_SCOPE',
          `An identical document already exists for this entity and category (${duplicate}).`,
        );
      }
    }

    const committedAt = now();
    const documentId = session.documentId ?? `doc-${session.id}`;
    const versionId = `ver-${session.id}-${session.targetVersionNumber}`;
    const superseding =
      existingDocument === undefined ? undefined : ports.versions.read(existingDocument.currentVersionId);
    if (existingDocument !== undefined && superseding === undefined) {
      return fail('PRECONDITION_FAILED', 'The current version referenced by the document is missing.');
    }

    const version = activateVersion(
      {
        id: versionId,
        documentId,
        versionNumber: session.targetVersionNumber,
        fileName: session.declaredFileName,
        declaredMimeType: session.declaredMimeType,
        observedMimeType: observed.mimeType,
        byteSize: session.declaredByteSize,
        storageLifecycle: 'AVAILABLE',
        versionLifecycle: 'ACTIVE',
        integrity,
        malwareScan: session.malwareScan,
        quarantineReason: undefined,
        uploadedBy: actor.userId,
        uploadedAt: committedAt,
        effectiveFrom: committedAt,
        changeReason: session.categoryCode,
        supersededAt: undefined,
        supersededByVersionId: undefined,
        objectDigestRef: session.objectDigestRef,
      },
      committedAt,
      session.categoryCode,
    );

    const document =
      existingDocument === undefined
        ? newDocument(ports, session, version, category, actor, committedAt)
        : supersededDocument(existingDocument, version, committedAt);

    if (!ports.versions.insert(version)) {
      return fail('CONCURRENT_WRITE', `Version ${versionId} already exists.`);
    }
    if (existingDocument !== undefined) {
      if (!ports.documents.update(document, existingDocument.revision.revision)) {
        if (superseding !== undefined) {
          ports.versions.update(supersedeVersion(superseding, committedAt, versionId));
        }
        return fail(
          'CONCURRENT_WRITE',
          'The document was modified concurrently; the staged version was rolled back.',
        );
      }
      if (superseding !== undefined) {
        ports.versions.update(supersedeVersion(superseding, committedAt, versionId));
      }
    } else if (!ports.documents.insert(document)) {
      return fail('CONCURRENT_WRITE', 'The document already exists; the staged version was not linked.');
    }

    const committed = advance(session, 'COMMITTED', {
      committedAt,
      committedVersionId: versionId,
      documentId,
    });
    const saved = await persist(committed);
    if (!saved.ok) {
      return saved;
    }

    ports.audit.emit(committedAudit(ports, session, version, actor, superseding));

    return { ok: true, value: { session: committed, document, version }, warnings: [] };
  };

  const abandon: UploadService['abandon'] = (actor, sessionId, reason) => {
    const session = ports.uploads.read(sessionId);
    if (session === undefined) {
      return fail('AGGREGATE_NOT_FOUND', `Upload session ${sessionId} does not exist.`);
    }
    if (!sessionBelongsToActor(session, actor)) {
      return fail('ACTOR_NOT_AUTHORIZED', 'The upload session belongs to a different actor.');
    }
    if (session.state === 'COMMITTED') {
      return fail('TERMINAL_STATE', 'A committed upload session cannot be abandoned.');
    }
    const transition = canTransitionUpload(session.state, 'ABANDONED');
    if (!transition.allowed) {
      return fail('ILLEGAL_TRANSITION', transition.violation.detail ?? 'Illegal abandon transition.');
    }
    return persist(
      advance(session, 'ABANDONED', {
        failureCode: 'ABANDONED_BY_ACTOR',
        failureDetail: reason.trim().length === 0 ? 'Abandoned by the uploader.' : reason.trim(),
      }),
    );
  };

  const sweepExpired = (): readonly string[] => {
    const swept: string[] = [];
    for (const session of ports.uploads.list()) {
      if (!isSessionExpired(session, ports.clock)) {
        continue;
      }
      if (session.state === 'COMMITTED' || session.state === 'EXPIRED' || session.state === 'ABANDONED') {
        continue;
      }
      const transition = canTransitionUpload(session.state, 'EXPIRED');
      if (!transition.allowed) {
        continue;
      }
      ports.uploads.update(
        advance(session, 'EXPIRED', {
          failureCode: 'UPLOAD_NOT_RESUMABLE',
          failureDetail: 'The upload session expired before commit.',
        }),
      );
      swept.push(session.id);
    }
    return swept;
  };

  return {
    initiate,
    recordProgress,
    resumeDirective,
    completeBytes,
    recordScanResult,
    commit,
    abandon,
    sweepExpired,
  };
}

function duplicateChecksumInScope(
  ports: VaultPorts,
  session: UploadSession,
  checksum: string,
): string | Absent {
  for (const candidate of ports.documents.list(session.scope.societyId)) {
    if (candidate.categoryCode !== session.categoryCode) {
      continue;
    }
    for (const version of ports.versions.listByDocument(candidate.id)) {
      const duplicate = duplicateScope(
        version.integrity.checksum,
        checksum,
        candidate.scope.owningEntityId,
        session.scope.owningEntityId,
        candidate.categoryCode,
        session.categoryCode,
      );
      if (duplicate.isDuplicate) {
        return candidate.id;
      }
    }
  }
  return undefined;
}

function stagedCommitted(ports: VaultPorts, session: UploadSession): CommittedUpload {
  const documentId = session.documentId ?? `doc-${session.id}`;
  const document = ports.documents.read(documentId);
  const version = ports.versions.read(session.committedVersionId ?? '');
  if (document === undefined || version === undefined) {
    throw new Error(`Committed upload session ${session.id} is missing its document or version.`);
  }
  return { session, document, version };
}

function newDocument(
  ports: VaultPorts,
  session: UploadSession,
  version: DocumentVersionRecord,
  category: CategoryPolicy,
  actor: VaultActor,
  committedAt: string,
): DocumentRecord {
  return {
    id: `doc-${session.id}`,
    title: session.title,
    categoryGroup: session.categoryGroup,
    categoryCode: session.categoryCode,
    scope: session.scope,
    visibility: category.allowedVisibilities[0] ?? 'OWN_ENTITY_ONLY',
    sensitivity: category.defaultSensitivity,
    ownerUserId: actor.userId,
    storageLifecycle: 'AVAILABLE',
    verificationLifecycle: category.requiresVerification ? 'NOT_SUBMITTED' : 'NOT_REQUIRED',
    signatureLifecycle: category.requiresSignature ? 'NOT_REQUESTED' : 'NOT_REQUIRED',
    expiryLifecycle: category.expiryApplicable ? 'NOT_EXPIRED' : 'NOT_APPLICABLE',
    retentionLifecycle: 'ACTIVE',
    currentVersionId: version.id,
    currentVersionNumber: version.versionNumber,
    versionCount: 1,
    activeVerificationCaseId: undefined,
    signatureEnvelopeId: undefined,
    issuedAt: undefined,
    expiresAt:
      category.defaultExpiryDays === undefined
        ? undefined
        : new Date(
            ports.clock.now().getTime() + category.defaultExpiryDays * 24 * 60 * 60 * 1000,
          ).toISOString(),
    retentionPolicy: undefined,
    legalHoldIds: [],
    createdAt: committedAt,
    createdBy: actor.userId,
    updatedAt: committedAt,
    revision: { revision: 1, revisionToken: `rev-doc-${session.id}-1` },
    trace: session.trace,
  };
}

function supersededDocument(
  existing: DocumentRecord,
  version: DocumentVersionRecord,
  committedAt: string,
): DocumentRecord {
  const revision = existing.revision.revision + 1;
  return {
    ...existing,
    currentVersionId: version.id,
    currentVersionNumber: version.versionNumber,
    versionCount: existing.versionCount + 1,
    storageLifecycle: 'AVAILABLE',
    verificationLifecycle:
      existing.verificationLifecycle === 'NOT_REQUIRED' ? 'NOT_REQUIRED' : 'NOT_SUBMITTED',
    signatureLifecycle: existing.signatureLifecycle === 'NOT_REQUIRED' ? 'NOT_REQUIRED' : 'NOT_REQUESTED',
    activeVerificationCaseId: undefined,
    signatureEnvelopeId: undefined,
    issuedAt: undefined,
    updatedAt: committedAt,
    revision: { revision, revisionToken: `rev-${existing.id}-${revision}` },
  };
}

function committedAudit(
  ports: VaultPorts,
  session: UploadSession,
  version: DocumentVersionRecord,
  actor: VaultActor,
  superseding: DocumentVersionRecord | Absent,
): AuditLogEntry {
  return {
    id: `aud-${version.id}`,
    timestamp: ports.clock.now().toISOString(),
    correlationId: session.trace.correlationId,
    actor: {
      userId: actor.userId,
      type: 'RESIDENT',
      role: actor.role,
      societyId: session.scope.societyId,
      unitId: session.scope.owningEntityType === 'UNIT' ? session.scope.owningEntityId : undefined,
    },
    action: 'CREATE',
    entityType: 'DOCUMENT_VERSION',
    entityId: version.id,
    previousState:
      superseding === undefined ? undefined : { versionNumber: superseding.versionNumber },
    newState: {
      versionNumber: version.versionNumber,
      checksum: version.integrity.checksum,
      malwareStatus: version.malwareScan.status,
    },
    metadata: {
      idempotencyKey: session.id,
      source: 'MOBILE',
      documentId: version.documentId,
      categoryCode: session.categoryCode,
    },
    outcome: 'SUCCESS',
  };
}

export const UPLOAD_INTEGRITY_ALGORITHMS: readonly IntegrityAlgorithm[] = ['SHA-256', 'SHA-512'];
export const UPLOAD_SUPPORTED_METHODS: readonly SignatureMethodPolicy[] = [
  'ADMIN_DIGITAL',
  'E_SIGN_PROVIDER',
  'DSC_PROVIDER',
  'AADHAAR_ESIGN',
  'WET_INK_OFFLINE',
];
