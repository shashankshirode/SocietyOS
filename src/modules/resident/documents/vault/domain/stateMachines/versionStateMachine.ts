import type { Absent } from '../../../../../../shared/types/absence.types';
import type {
  DocumentVaultViolation,
  TransitionResult,
  VaultClock,
} from '../types/primitives';
import { violation } from '../types/primitives';
import type {
  DocumentRecord,
  DocumentVersionRecord,
  VersionLifecycleState,
} from '../types/document.types';

const VERSION_TRANSITIONS: Readonly<
  Record<VersionLifecycleState, readonly VersionLifecycleState[]>
> = {
  ACTIVE: ['SUPERSEDED', 'ARCHIVED'],
  SUPERSEDED: ['ARCHIVED'],
  ARCHIVED: [],
};

export function canTransitionVersion(
  from: VersionLifecycleState,
  to: VersionLifecycleState,
): TransitionResult<VersionLifecycleState> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  if (!VERSION_TRANSITIONS[from].includes(to)) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `version.lifecycle.${to}`,
        `Version cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function nextVersionNumber(document: DocumentRecord): number {
  return document.currentVersionNumber + 1;
}

export function versionLimitReached(
  document: DocumentRecord,
  maximumVersions: number,
): boolean {
  return document.versionCount >= maximumVersions;
}

export function activateVersion(
  version: DocumentVersionRecord,
  activatedAt: string,
  changeReason: string,
): DocumentVersionRecord {
  return {
    ...version,
    versionLifecycle: 'ACTIVE',
    uploadedAt: activatedAt,
    changeReason,
  };
}

export function supersedeVersion(
  version: DocumentVersionRecord,
  supersededAt: string,
  supersededByVersionId: string,
): DocumentVersionRecord {
  return {
    ...version,
    versionLifecycle: 'SUPERSEDED',
    supersededAt,
    supersededByVersionId,
  };
}

export function archiveVersion(
  version: DocumentVersionRecord,
): DocumentVersionRecord {
  return { ...version, versionLifecycle: 'ARCHIVED' };
}

export function isVersionImmutable(version: DocumentVersionRecord): boolean {
  return version.versionLifecycle !== 'ACTIVE';
}

export function isIntegrityIntact(version: DocumentVersionRecord): boolean {
  return version.integrity.verifiedAt !== undefined;
}

export function versionBlocksRetrieval(version: DocumentVersionRecord): DocumentVaultViolation | Absent {
  if (version.versionLifecycle === 'ARCHIVED') {
    return violation(
      'OBJECT_NOT_AVAILABLE',
      'version.versionLifecycle',
      'Archived versions are not retrievable.',
    );
  }
  if (!isIntegrityIntact(version)) {
    return violation(
      'INTEGRITY_CHECKSUM_MISMATCH',
      'version.integrity',
      'Version integrity has not been verified.',
    );
  }
  if (version.malwareScan.status === 'INFECTED') {
    return violation(
      'MALWARE_SCAN_FAILED',
      'version.malwareScan',
      'The stored object failed malware scanning.',
    );
  }
  if (version.malwareScan.status !== 'CLEAN') {
    return violation(
      'MALWARE_SCAN_PENDING',
      'version.malwareScan',
      'Malware scan has not produced a clean result.',
    );
  }
  if (version.storageLifecycle !== 'AVAILABLE') {
    return violation(
      'OBJECT_NOT_AVAILABLE',
      'version.storageLifecycle',
      `Version object is ${version.storageLifecycle} and cannot be retrieved.`,
    );
  }
  return undefined;
}

const UNINHERITED_VERIFICATION_STATES: readonly string[] = ['NOT_SUBMITTED', 'NOT_REQUIRED'];

export function assertVersionNotInheriting(
  priorVerificationState: string,
  newVersionVerificationState: string,
): DocumentVaultViolation | Absent {
  if (UNINHERITED_VERIFICATION_STATES.includes(newVersionVerificationState)) {
    return undefined;
  }
  return violation(
    'VERSION_VERIFICATION_NOT_INHERITED',
    'version.verificationLifecycle',
    `A new version must start as ${UNINHERITED_VERIFICATION_STATES.join(' or ')} and must not inherit ${priorVerificationState}.`,
  );
}

export function historyOf(
  versions: readonly DocumentVersionRecord[],
  documentId: string,
): readonly DocumentVersionRecord[] {
  return versions
    .filter((version) => version.documentId === documentId)
    .slice()
    .sort((left, right) => right.versionNumber - left.versionNumber);
}

export function findVersion(
  versions: readonly DocumentVersionRecord[],
  versionId: string,
): DocumentVersionRecord | Absent {
  return versions.find((version) => version.id === versionId);
}

export function isExpiredAt(
  document: Pick<DocumentRecord, 'expiresAt'>,
  clock: VaultClock,
): boolean {
  if (document.expiresAt === undefined) {
    return false;
  }
  const expiry = Date.parse(document.expiresAt);
  if (Number.isNaN(expiry)) {
    return false;
  }
  return expiry <= clock.now().getTime();
}

export function isExpiringWithin(
  document: Pick<DocumentRecord, 'expiresAt'>,
  clock: VaultClock,
  days: number,
): boolean {
  if (document.expiresAt === undefined) {
    return false;
  }
  const expiry = Date.parse(document.expiresAt);
  if (Number.isNaN(expiry)) {
    return false;
  }
  return expiry <= clock.now().getTime() + days * 24 * 60 * 60 * 1000;
}
