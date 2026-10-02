import {
  canTransitionStorage,
  canTransitionUpload,
  isQuarantineObjectMissing,
  isScanTerminalClean,
  isSessionHalfValid,
  isSessionResumable,
  isStorageRetrievable,
  isWeakAlgorithm,
  mustFailClosed,
  pendingScan,
} from '../domain/stateMachines/storageStateMachine';
import type { UploadSession } from '../domain/types/upload.types';
import { PDF_BYTES, testClock } from './fixtures/vaultFixtures';

function session(overrides: Partial<UploadSession> = {}): UploadSession {
  return {
    id: 'ups-1',
    scope: { societyId: 'soc-1', owningEntityType: 'OWNER', owningEntityId: 'owner-1' },
    categoryGroup: 'OWNER',
    categoryCode: 'OWNER_KYC',
    title: 'Pan card',
    documentId: undefined,
    targetVersionNumber: 1,
    state: 'UPLOADING',
    declaredFileName: 'pan.pdf',
    declaredMimeType: 'application/pdf',
    declaredByteSize: PDF_BYTES.length,
    bytesReceived: PDF_BYTES.length,
    resumeToken: 'rt-1',
    integrityAlgorithm: 'SHA-256',
    expectedChecksum: undefined,
    computedIntegrity: undefined,
    objectDigestRef: undefined,
    malwareScan: pendingScan('scanner-1', 'PENDING', undefined),
    failureCode: undefined,
    failureDetail: undefined,
    initiatedBy: 'user-owner-1',
    initiatedAt: '2026-03-01T10:00:00.000Z',
    expiresAt: '2026-03-01T10:15:00.000Z',
    committedAt: undefined,
    committedVersionId: undefined,
    revision: { revision: 2, revisionToken: 'rev-ups-1-2' },
    trace: { correlationId: 'corr-1', causationId: undefined },
    ...overrides,
  };
}

describe('storage lifecycle transitions', () => {
  it('permits the quarantine to scanning to available path', () => {
    expect(canTransitionStorage('QUARANTINED', 'SCANNING').allowed).toBe(true);
    expect(canTransitionStorage('SCANNING', 'AVAILABLE').allowed).toBe(true);
  });

  it('never allows a quarantined object to become available directly', () => {
    expect(canTransitionStorage('QUARANTINED', 'AVAILABLE').allowed).toBe(false);
  });

  it('never allows a purged object to return to availability', () => {
    expect(canTransitionStorage('PURGED', 'AVAILABLE').allowed).toBe(false);
  });

  it('warns when an available object loses integrity', () => {
    const result = canTransitionStorage('AVAILABLE', 'CORRUPT');
    expect(result.allowed).toBe(true);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('treats only AVAILABLE storage as retrievable', () => {
    expect(isStorageRetrievable('AVAILABLE')).toBe(true);
    expect(isStorageRetrievable('QUARANTINED')).toBe(false);
    expect(isStorageRetrievable('CORRUPT')).toBe(false);
  });
});

describe('upload session transitions', () => {
  it('permits the full happy path through quarantine and scanning', () => {
    expect(canTransitionUpload('INITIATED', 'UPLOADING').allowed).toBe(true);
    expect(canTransitionUpload('UPLOADING', 'BYTES_COMPLETE').allowed).toBe(true);
    expect(canTransitionUpload('BYTES_COMPLETE', 'QUARANTINED').allowed).toBe(true);
    expect(canTransitionUpload('QUARANTINED', 'SCANNING').allowed).toBe(true);
    expect(canTransitionUpload('SCANNING', 'COMMITTED').allowed).toBe(true);
  });

  it('never allows commit before scanning', () => {
    expect(canTransitionUpload('BYTES_COMPLETE', 'COMMITTED').allowed).toBe(false);
    expect(canTransitionUpload('QUARANTINED', 'COMMITTED').allowed).toBe(false);
  });

  it('never allows commit from INITIATED', () => {
    expect(canTransitionUpload('INITIATED', 'COMMITTED').allowed).toBe(false);
  });

  it('treats COMMITTED as terminal', () => {
    expect(canTransitionUpload('COMMITTED', 'UPLOADING').allowed).toBe(false);
    expect(canTransitionUpload('COMMITTED', 'ABANDONED').allowed).toBe(false);
  });

  it('treats ABANDONED and EXPIRED as terminal', () => {
    expect(canTransitionUpload('ABANDONED', 'UPLOADING').allowed).toBe(false);
    expect(canTransitionUpload('EXPIRED', 'UPLOADING').allowed).toBe(false);
  });

  it('reports an illegal transition with a blocking violation', () => {
    const result = canTransitionUpload('INITIATED', 'COMMITTED');
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.violation.code).toBe('ILLEGAL_TRANSITION');
      expect(result.violation.blocking).toBe(true);
    }
  });
});

describe('upload session resumption', () => {
  const clock = testClock();

  it('resumes an in-flight upload before its expiry', () => {
    const live = session({ state: 'UPLOADING', bytesReceived: 4 });
    expect(isSessionResumable(live, clock)).toBe(true);
  });

  it('refuses resumption after expiry', () => {
    const stale = session({ state: 'UPLOADING', bytesReceived: 4, expiresAt: '2026-02-01T00:00:00.000Z' });
    expect(isSessionResumable(stale, clock)).toBe(false);
  });

  it('refuses resumption once every declared byte has arrived', () => {
    const complete = session({ state: 'UPLOADING' });
    expect(isSessionResumable(complete, clock)).toBe(false);
  });

  it('refuses resumption of a quarantined session', () => {
    expect(isSessionResumable(session({ state: 'QUARANTINED' }), clock)).toBe(false);
  });
});

describe('upload session half-validity', () => {
  it('flags a scanning session that already references a committed version', () => {
    const inconsistent = session({ state: 'SCANNING', committedVersionId: 'ver-1' });
    expect(isSessionHalfValid(inconsistent)).toBe(true);
  });

  it('does not flag a consistent scanning session', () => {
    expect(isSessionHalfValid(session({ state: 'SCANNING' }))).toBe(false);
  });

  it('flags a quarantined session with no object reference', () => {
    expect(isQuarantineObjectMissing(session({ state: 'QUARANTINED' }))).toBe(true);
  });

  it('accepts a quarantined session that names its object', () => {
    const stored = session({ state: 'QUARANTINED', objectDigestRef: 'objref-1' });
    expect(isQuarantineObjectMissing(stored)).toBe(false);
  });
});

describe('malware scan fail-closed posture', () => {
  it('treats a clean scan as the only terminal clean result', () => {
    expect(isScanTerminalClean(pendingScan('s', 'CLEAN', undefined))).toBe(true);
    expect(isScanTerminalClean(pendingScan('s', 'PENDING', undefined))).toBe(false);
    expect(isScanTerminalClean(pendingScan('s', 'INFECTED', undefined))).toBe(false);
    expect(isScanTerminalClean(pendingScan('s', 'UNAVAILABLE', undefined))).toBe(false);
  });

  it('requires fail-closed while pending or unavailable', () => {
    expect(mustFailClosed(pendingScan('s', 'PENDING', undefined))).toBe(true);
    expect(mustFailClosed(pendingScan('s', 'UNAVAILABLE', undefined))).toBe(true);
    expect(mustFailClosed(pendingScan('s', 'INFECTED', undefined))).toBe(false);
    expect(mustFailClosed(pendingScan('s', 'CLEAN', undefined))).toBe(false);
  });
});

describe('weak integrity algorithms', () => {
  it('rejects MD5 and SHA-1', () => {
    expect(isWeakAlgorithm('MD5')).toBe(true);
    expect(isWeakAlgorithm('sha1')).toBe(true);
    expect(isWeakAlgorithm('SHA-1')).toBe(true);
  });

  it('accepts SHA-256 and SHA-512', () => {
    expect(isWeakAlgorithm('SHA-256')).toBe(false);
    expect(isWeakAlgorithm('SHA-512')).toBe(false);
  });
});
