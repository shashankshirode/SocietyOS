import type { Absent } from '../../../../../../shared/types/absence.types';
import type { DocumentVaultErrorCode, DocumentVaultViolation, TransitionResult, VaultClock } from '../types/primitives';
import { violation } from '../types/primitives';
import type { MalwareScanRecord, StorageLifecycleState } from '../types/document.types';
import type { UploadSession, UploadSessionState } from '../types/upload.types';

const STORAGE_TRANSITIONS: Readonly<Record<StorageLifecycleState, readonly StorageLifecycleState[]>> = {
  NO_OBJECT: ['UPLOAD_IN_PROGRESS'],
  UPLOAD_IN_PROGRESS: ['QUARANTINED', 'PURGED'],
  QUARANTINED: ['SCANNING', 'PURGED', 'LEGAL_HOLD'],
  SCANNING: ['AVAILABLE', 'CORRUPT', 'PURGED', 'LEGAL_HOLD'],
  AVAILABLE: ['CORRUPT', 'PURGED', 'LEGAL_HOLD'],
  CORRUPT: ['PURGED', 'LEGAL_HOLD'],
  PURGED: ['LEGAL_HOLD'],
  LEGAL_HOLD: ['AVAILABLE', 'PURGED'],
};

const UPLOAD_TRANSITIONS: Readonly<Record<UploadSessionState, readonly UploadSessionState[]>> = {
  INITIATED: ['UPLOADING', 'EXPIRED', 'ABANDONED', 'FAILED'],
  UPLOADING: ['UPLOADING', 'INTERRUPTED', 'BYTES_COMPLETE', 'FAILED', 'ABANDONED', 'EXPIRED'],
  INTERRUPTED: ['UPLOADING', 'BYTES_COMPLETE', 'FAILED', 'ABANDONED', 'EXPIRED'],
  BYTES_COMPLETE: ['QUARANTINED', 'FAILED'],
  QUARANTINED: ['SCANNING', 'FAILED', 'ABANDONED'],
  SCANNING: ['COMMITTED', 'FAILED', 'QUARANTINED'],
  COMMITTED: [],
  FAILED: ['ABANDONED'],
  ABANDONED: [],
  EXPIRED: [],
};

const RESUMABLE_UPLOAD_STATES: readonly UploadSessionState[] = ['UPLOADING', 'INTERRUPTED'];

function reject<State extends string>(
  from: State,
  attempted: State,
  code: DocumentVaultErrorCode,
  detail: string,
): { allowed: false; from: State; attempted: State; violation: DocumentVaultViolation } {
  return {
    allowed: false,
    from,
    attempted,
    violation: violation(code, `state.${attempted}`, detail),
  };
}

export function canTransitionStorage(
  from: StorageLifecycleState,
  to: StorageLifecycleState,
): TransitionResult<StorageLifecycleState> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  const allowed = STORAGE_TRANSITIONS[from].includes(to);
  if (!allowed) {
    return reject(from, to, 'ILLEGAL_TRANSITION', `Storage cannot move from ${from} to ${to}.`);
  }
  const warnings: DocumentVaultViolation[] = [];
  if (from === 'AVAILABLE' && to === 'CORRUPT') {
    warnings.push({
      code: 'INTEGRITY_CHECKSUM_MISMATCH',
      field: 'state.CORRUPT',
      blocking: false,
      detail: 'Integrity loss removes the object from every retrieval path.',
    });
  }
  return { allowed: true, from, to, warnings };
}

export function canTransitionUpload(
  from: UploadSessionState,
  to: UploadSessionState,
): TransitionResult<UploadSessionState> {
  if (from === to && to !== 'UPLOADING') {
    return { allowed: true, from, to, warnings: [] };
  }
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  const allowed = UPLOAD_TRANSITIONS[from].includes(to);
  if (!allowed) {
    return reject(from, to, 'ILLEGAL_TRANSITION', `Upload session cannot move from ${from} to ${to}.`);
  }
  return { allowed: true, from, to, warnings: [] };
}

export function isStorageRetrievable(state: StorageLifecycleState): boolean {
  return state === 'AVAILABLE';
}

export function isStorageBlockedForRetrieval(state: StorageLifecycleState): boolean {
  return state !== 'AVAILABLE';
}

export function pendingScan(
  scannerId: string,
  status: MalwareScanRecord['status'],
  detail: string | Absent,
): MalwareScanRecord {
  return {
    scannerId,
    status,
    signatureVersion: undefined,
    scannedAt: undefined,
    detail: detail ?? 'Awaiting malware scan result.',
  };
}

export function cleanScan(
  scannerId: string,
  signatureVersion: string,
  scannedAt: string,
): MalwareScanRecord {
  return {
    scannerId,
    status: 'CLEAN',
    signatureVersion,
    scannedAt,
    detail: undefined,
  };
}

export function infectedScan(
  scannerId: string,
  signatureVersion: string,
  scannedAt: string,
  detail: string,
): MalwareScanRecord {
  return { scannerId, status: 'INFECTED', signatureVersion, scannedAt, detail };
}

export function unavailableScan(
  scannerId: string,
  detail: string,
): MalwareScanRecord {
  return {
    scannerId,
    status: 'UNAVAILABLE',
    signatureVersion: undefined,
    scannedAt: undefined,
    detail,
  };
}

export function isSessionExpired(session: UploadSession, clock: VaultClock): boolean {
  return Date.parse(session.expiresAt) <= clock.now().getTime();
}

export function isSessionResumable(session: UploadSession, clock: VaultClock): boolean {
  if (!RESUMABLE_UPLOAD_STATES.includes(session.state)) {
    return false;
  }
  if (isSessionExpired(session, clock)) {
    return false;
  }
  return session.bytesReceived < session.declaredByteSize;
}

export function isSessionHalfValid(session: UploadSession): boolean {
  if (session.state === 'COMMITTED') {
    return false;
  }
  if (session.state === 'BYTES_COMPLETE' || session.state === 'QUARANTINED' || session.state === 'SCANNING') {
    return session.committedVersionId !== undefined;
  }
  return false;
}

export function isQuarantineObjectMissing(session: UploadSession): boolean {
  return (
    (session.state === 'QUARANTINED' || session.state === 'SCANNING' || session.state === 'COMMITTED') &&
    session.objectDigestRef === undefined
  );
}

export function isScanTerminalClean(scan: MalwareScanRecord): boolean {
  return scan.status === 'CLEAN';
}

export function mustFailClosed(scan: MalwareScanRecord): boolean {
  return scan.status === 'PENDING' || scan.status === 'UNAVAILABLE';
}

export function isWeakAlgorithm(algorithm: string): boolean {
  const normalized = algorithm.trim().toUpperCase();
  return normalized === 'MD5' || normalized === 'SHA1' || normalized === 'SHA-1';
}
