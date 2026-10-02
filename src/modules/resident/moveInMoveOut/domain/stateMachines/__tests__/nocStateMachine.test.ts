import {
  applyNocCommand,
  buildQrPayload,
  certificateContentChecksum,
  isNocTerminalStatus,
  nocStatusPath,
  parseQrPayload,
  serializeQrPayload,
  verifyNocCertificate,
} from '../nocStateMachine';
import type { NocCertificate, NocCommand, NocRequestState, NocStatus } from '../../types/noc.types';
import { inr } from '../../types/money';
import type { LifecycleActor, LifecycleActorType } from '../../types/primitives';
import type { Absent } from '../../../../../../shared/types/absence.types';

function makeActor(actorId: string, actorType: LifecycleActorType, overrides: Partial<LifecycleActor> = {}): LifecycleActor {
  return {
    actorId,
    actorType,
    displayName: actorId,
    societyId: 'soc-1',
    unitId: undefined,
    onBehalfOfResidentId: undefined,
    ...overrides,
  };
}

const SECRETARY = makeActor('actor-secretary', 'SOCIETY_SECRETARY');
const TREASURER = makeActor('actor-treasurer', 'TREASURER');
const ADMIN = makeActor('actor-admin', 'SOCIETY_ADMIN');
const RESIDENT = makeActor('actor-resident', 'RESIDENT');
const FOREIGN = makeActor('actor-secretary', 'SOCIETY_SECRETARY', { societyId: 'soc-other' });

function makeState(status: NocStatus, revision = 1): NocRequestState {
  return {
    nocRequestId: 'noc-req-1',
    requestNumber: 'NOC-2026-0001',
    kind: 'MOVE_OUT_NOC',
    status,
    revision,
    scope: {
      societyId: 'soc-1',
      unitId: 'unit-9',
      residentId: 'res-1',
      occupancyRelationshipId: 'rel-1',
    },
    linkedMoveOutRequestId: 'mov-1',
    linkedClearanceSnapshotId: 'snap-1',
    linkedSettlementId: 'settle-1',
    requestedByActorId: RESIDENT.actorId,
    requiredByDate: '2026-10-31',
    purposeKey: 'purpose.electricityTransfer',
    purposeDetail: 'State Electricity Board transfer',
    approval:
      status === 'APPROVED' || status === 'SIGNED' || status === 'ISSUED'
        ? {
            approvedAt: '2026-10-01T10:00:00.000Z',
            approvedByActorId: SECRETARY.actorId,
            approvalReference: 'approval-1',
            committeeReference: undefined,
          }
        : undefined,
    signature:
      status === 'SIGNED' || status === 'ISSUED'
        ? {
            signedAt: '2026-10-01T11:00:00.000Z',
            signedByActorId: SECRETARY.actorId,
            signatureMethod: 'DIGITAL',
            documentId: 'doc-1',
            documentChecksum: 'doc-checksum-1',
          }
        : undefined,
    certificateId: status === 'ISSUED' ? 'cert-1' : undefined,
    revocation: undefined,
    archive: undefined,
    cancellation: undefined,
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-01T09:00:00.000Z',
  };
}

function makeCommand(overrides: Partial<NocCommand> = {}): NocCommand {
  return {
    kind: 'BEGIN_REVIEW',
    actor: TREASURER,
    idempotencyKey: 'idem-1',
    expectedRevision: 1,
    occurredAt: '2026-10-01T12:00:00.000Z',
    approvalReference: undefined,
    committeeReference: undefined,
    rejectionReasonKey: undefined,
    rejectionReasonDetail: undefined,
    signatureDocumentId: undefined,
    signatureDocumentChecksum: undefined,
    signatureMethod: undefined,
    certificateId: undefined,
    revocationReasonKey: undefined,
    revocationReasonDetail: undefined,
    accessAlreadyRevoked: false,
    retentionPolicyKey: undefined,
    archiveReference: undefined,
    cancellationReasonKey: undefined,
    cancellationReasonDetail: undefined,
    ...overrides,
  };
}

const CONTENT = {
  certificateId: 'cert-1',
  certificateNumber: 'NOC-2026-0001',
  kind: 'MOVE_OUT_NOC',
  templateId: 'noc-move-out',
  templateVersion: 'v1',
  societyId: 'soc-1',
  unitId: 'unit-9',
  societyDisplayName: 'Green Meadows',
  unitDisplayLabel: 'B-1204',
  residentDisplayName: 'Asha Rao',
  issueDate: '2026-10-02',
  validUntil: undefined,
  clearanceSnapshotId: 'snap-1',
  settlementId: 'settle-1',
  settlementOutcomeKey: 'settlement.outstandingCleared',
  netSettlementAmount: inr(45000),
  issuingAuthorityRole: 'SOCIETY_SECRETARY',
  signatoryDisplayName: 'Ravi Menon',
  disclaimerKey: 'disclaimer.nocInformational',
} as const;

function makeCertificate(overrides: Partial<NocCertificate> = {}): NocCertificate {
  const contentChecksum = certificateContentChecksum(CONTENT);
  return {
    certificateId: 'cert-1',
    certificateNumber: 'NOC-2026-0001',
    status: 'ISSUED',
    content: CONTENT,
    verificationCode: 'verify-abc-123',
    contentChecksum,
    issuedAt: '2026-10-02T09:00:00.000Z',
    issuedByActorId: SECRETARY.actorId,
    revokedAt: undefined,
    revokedByActorId: undefined,
    linkedNocRequestId: 'noc-req-1',
    linkedMoveOutRequestId: 'mov-1',
    ...overrides,
  };
}

const FIXED_NOW = '2026-10-05T00:00:00.000Z';
const source = (certificate: NocCertificate | Absent) => ({
  findByCertificateNumber: (certificateNumber: string) =>
    certificate === undefined ? undefined : certificate.certificateNumber === certificateNumber ? certificate : undefined,
  now: () => FIXED_NOW,
});

describe('nocStateMachine', () => {
  it('declares the issuance path and marks revocation archive and cancellation as terminal', () => {
    expect(nocStatusPath()).toEqual([
      'REQUESTED',
      'UNDER_REVIEW',
      'APPROVED',
      'SIGNED',
      'ISSUED',
      'REVOKED',
      'ARCHIVED',
    ]);
    expect(isNocTerminalStatus('ISSUED')).toBe(false);
    expect(isNocTerminalStatus('REVOKED')).toBe(true);
    expect(isNocTerminalStatus('ARCHIVED')).toBe(true);
  });

  it('cannot be created by applying a command and cannot be issued without approval', () => {
    const create = applyNocCommand(makeState('REQUESTED'), makeCommand({ kind: 'SUBMIT_REQUEST' }));
    expect(create.allowed).toBe(false);

    const issue = applyNocCommand(
      { ...makeState('SIGNED'), approval: undefined, signature: undefined },
      makeCommand({ kind: 'RECORD_ISSUANCE', actor: SECRETARY, certificateId: 'cert-1' }),
    );
    expect(issue.allowed).toBe(false);
    if (!issue.allowed) {
      expect(issue.violations.map((violation) => violation.field)).toContain('state.approval');
    }
  });

  it('refuses approval without a linked clearance snapshot and settlement', () => {
    const state = {
      ...makeState('UNDER_REVIEW'),
      linkedClearanceSnapshotId: undefined,
      linkedSettlementId: undefined,
    };
    const outcome = applyNocCommand(
      state,
      makeCommand({ kind: 'GRANT_APPROVAL', actor: SECRETARY, approvalReference: 'approval-1' }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      const fields = outcome.violations.map((violation) => violation.field);
      expect(fields).toContain('state.linkedClearanceSnapshotId');
      expect(fields).toContain('state.linkedSettlementId');
    }
  });

  it('records the approval reference when approval is granted', () => {
    const outcome = applyNocCommand(
      makeState('UNDER_REVIEW'),
      makeCommand({
        kind: 'GRANT_APPROVAL',
        actor: SECRETARY,
        approvalReference: 'approval-9',
        committeeReference: 'committee-2',
      }),
    );
    expect(outcome.allowed).toBe(true);
    if (outcome.allowed) {
      expect(outcome.toStatus).toBe('APPROVED');
      expect(outcome.state.approval?.approvalReference).toBe('approval-9');
      expect(outcome.state.approval?.committeeReference).toBe('committee-2');
    }
  });

  it('clears the approval and signature when a request is rejected', () => {
    const outcome = applyNocCommand(
      makeState('APPROVED'),
      makeCommand({ kind: 'REJECT', actor: SECRETARY, rejectionReasonKey: 'reason.duesPending' }),
    );
    expect(outcome.allowed).toBe(true);
    if (outcome.allowed) {
      expect(outcome.toStatus).toBe('REJECTED');
      expect(outcome.state.approval).toBeUndefined();
      expect(outcome.state.signature).toBeUndefined();
    }
  });

  it('refuses a treasurer to approve', () => {
    const outcome = applyNocCommand(
      makeState('UNDER_REVIEW'),
      makeCommand({ kind: 'GRANT_APPROVAL', actor: TREASURER, approvalReference: 'a' }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('ACTOR_NOT_AUTHORIZED');
    }
  });

  it('refuses an actor from another society and one acting for another unit', () => {
    const foreign = applyNocCommand(makeState('REQUESTED'), makeCommand({ actor: FOREIGN }));
    expect(foreign.allowed).toBe(false);

    const otherUnit = applyNocCommand(
      makeState('REQUESTED'),
      makeCommand({ actor: makeActor('actor-resident', 'RESIDENT', { unitId: 'unit-1' }) }),
    );
    expect(otherUnit.allowed).toBe(false);
  });

  it('rejects a stale revision', () => {
    const outcome = applyNocCommand(
      makeState('UNDER_REVIEW', 6),
      makeCommand({ kind: 'GRANT_APPROVAL', actor: SECRETARY, expectedRevision: 5, approvalReference: 'a' }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('REVISION_MISMATCH');
    }
  });

  it('refuses to archive a request that has not been issued', () => {
    const outcome = applyNocCommand(
      makeState('APPROVED'),
      makeCommand({
        kind: 'ARCHIVE',
        actor: ADMIN,
        retentionPolicyKey: 'retention.noc',
        archiveReference: 'archive-1',
      }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('ILLEGAL_TRANSITION');
    }
  });

  it('requires a retention policy and archive reference when archiving an issued certificate', () => {
    const outcome = applyNocCommand(makeState('ISSUED'), makeCommand({ kind: 'ARCHIVE', actor: ADMIN }));
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      const fields = outcome.violations.map((violation) => violation.field);
      expect(fields).toContain('command.retentionPolicyKey');
      expect(fields).toContain('command.archiveReference');
    }
  });

  it('allows cancelling before signature without an access revocation claim', () => {
    for (const status of ['REQUESTED', 'UNDER_REVIEW', 'APPROVED'] as const) {
      const outcome = applyNocCommand(
        makeState(status),
        makeCommand({ kind: 'CANCEL', actor: RESIDENT, cancellationReasonKey: 'reason.withdrawn' }),
      );
      expect(outcome.allowed).toBe(true);
    }
  });

  it('refuses to cancel a signed request until access revocation is confirmed', () => {
    const outcome = applyNocCommand(
      makeState('SIGNED'),
      makeCommand({ kind: 'CANCEL', actor: RESIDENT, cancellationReasonKey: 'reason.withdrawn' }),
    );
    expect(outcome.allowed).toBe(false);
    if (!outcome.allowed) {
      expect(outcome.violations.map((violation) => violation.field)).toContain(
        'command.accessAlreadyRevoked',
      );
    }

    const confirmed = applyNocCommand(
      makeState('SIGNED'),
      makeCommand({
        kind: 'CANCEL',
        actor: RESIDENT,
        cancellationReasonKey: 'reason.withdrawn',
        accessAlreadyRevoked: true,
      }),
    );
    expect(confirmed.allowed).toBe(true);
  });

  it('walks request to issued and records the certificate id', () => {
    const steps: readonly (readonly [NocCommand['kind'], string])[] = [
      ['BEGIN_REVIEW', 'UNDER_REVIEW'],
      ['GRANT_APPROVAL', 'APPROVED'],
      ['RECORD_SIGNATURE', 'SIGNED'],
      ['RECORD_ISSUANCE', 'ISSUED'],
    ];

    let state = makeState('REQUESTED');

    for (const [kind, expected] of steps) {
      const outcome = applyNocCommand(
        state,
        makeCommand({
          kind,
          actor: kind === 'BEGIN_REVIEW' ? TREASURER : SECRETARY,
          expectedRevision: state.revision,
          approvalReference: 'approval-1',
          signatureDocumentId: 'doc-1',
          signatureDocumentChecksum: 'doc-checksum-1',
          signatureMethod: 'DIGITAL',
          certificateId: 'cert-1',
        }),
      );
      expect(outcome.allowed).toBe(true);
      if (outcome.allowed) {
        expect(outcome.toStatus).toBe(expected);
        state = outcome.state;
      }
    }

    expect(state.status).toBe('ISSUED');
    expect(state.certificateId).toBe('cert-1');
    expect(state.revision).toBe(5);
  });
});

describe('certificateContentChecksum', () => {
  it('is stable for identical content', () => {
    expect(certificateContentChecksum(CONTENT)).toBe(certificateContentChecksum({ ...CONTENT }));
  });

  it('changes when the net settlement amount changes', () => {
    expect(certificateContentChecksum(CONTENT)).not.toBe(
      certificateContentChecksum({ ...CONTENT, netSettlementAmount: inr(45001) }),
    );
  });

  it('changes when an absent reference becomes present', () => {
    expect(certificateContentChecksum({ ...CONTENT, settlementId: undefined })).not.toBe(
      certificateContentChecksum(CONTENT),
    );
  });

  it('does not treat an absent reference as the literal text absent', () => {
    expect(certificateContentChecksum({ ...CONTENT, validUntil: undefined })).not.toBe(
      certificateContentChecksum({ ...CONTENT, validUntil: 'absent' }),
    );
  });
});

describe('noc QR verification', () => {
  it('round trips a payload and carries no resident personal data', () => {
    const certificate = makeCertificate();
    const serialized = serializeQrPayload(buildQrPayload(certificate));
    const parsed = parseQrPayload(serialized);
    expect(parsed).toEqual(buildQrPayload(certificate));
    expect(serialized).not.toContain('Asha Rao');
    expect(serialized).not.toContain('Green Meadows');
    expect(serialized).not.toContain('B-1204');
  });

  it('verifies an untampered certificate as valid', () => {
    const certificate = makeCertificate();
    const outcome = verifyNocCertificate(
      serializeQrPayload(buildQrPayload(certificate)),
      source(certificate),
    );
    expect(outcome.verdict).toBe('VALID');
  });

  it('reports a revoked certificate as revoked rather than valid', () => {
    const certificate = makeCertificate({ status: 'REVOKED', revokedAt: '2026-10-04T00:00:00.000Z' });
    const outcome = verifyNocCertificate(
      serializeQrPayload(buildQrPayload(certificate)),
      source(certificate),
    );
    expect(outcome.verdict).toBe('REVOKED');
  });

  it('reports a checksum mismatch when the QR digest is altered', () => {
    const certificate = makeCertificate();
    const payload = buildQrPayload(certificate);
    const outcome = verifyNocCertificate(
      serializeQrPayload({ ...payload, contentChecksum: 'f'.repeat(64) }),
      source(certificate),
    );
    expect(outcome.verdict).toBe('CHECKSUM_MISMATCH');
  });

  it('recomputes the digest from content so an edited amount cannot keep a valid code', () => {
    const certificate = makeCertificate();
    const tamperedContent = { ...CONTENT, netSettlementAmount: inr(0) };
    const outcome = verifyNocCertificate(
      serializeQrPayload({
        certificateNumber: certificate.certificateNumber,
        verificationCode: certificate.verificationCode,
        contentChecksum: certificateContentChecksum(tamperedContent),
        issuerId: 'society-os',
        schemaVersion: 'sos.noc.qr.v1',
      }),
      source(certificate),
    );
    expect(outcome.verdict).not.toBe('VALID');
    expect(certificateContentChecksum(tamperedContent)).not.toBe(certificate.contentChecksum);
  });

  it('detects tampering when a stored digest no longer matches its own content', () => {
    const honest = makeCertificate();
    const certificate = makeCertificate({ contentChecksum: 'a'.repeat(64) });
    const outcome = verifyNocCertificate(
      serializeQrPayload({
        certificateNumber: certificate.certificateNumber,
        verificationCode: certificate.verificationCode,
        contentChecksum: honest.contentChecksum,
        issuerId: 'society-os',
        schemaVersion: 'sos.noc.qr.v1',
      }),
      source(certificate),
    );
    expect(outcome.verdict).toBe('CHECKSUM_MISMATCH');
  });

  it('reports an unknown certificate number as not found', () => {
    const outcome = verifyNocCertificate(
      'sos.noc.qr.v1|society-os|NOC-9999|code|digest',
      source(makeCertificate()),
    );
    expect(outcome.verdict).toBe('NOT_FOUND');
  });

  it('refuses privileged operations to the SYSTEM actor', () => {
    const system = makeActor('SYSTEM', 'SYSTEM');
    const privileged: ReadonlyArray<readonly [NocCommand['kind'], NocStatus]> = [
      ['BEGIN_REVIEW', 'REQUESTED'],
      ['GRANT_APPROVAL', 'UNDER_REVIEW'],
      ['REJECT', 'UNDER_REVIEW'],
      ['RECORD_SIGNATURE', 'APPROVED'],
      ['RECORD_ISSUANCE', 'SIGNED'],
    ];

    for (const [kind, status] of privileged) {
      const outcome = applyNocCommand(makeState(status), makeCommand({ kind, actor: system }));
      expect(outcome.allowed).toBe(false);
      if (!outcome.allowed) {
        expect(outcome.violations.map((violation) => violation.code)).toContain(
          'ACTOR_NOT_AUTHORIZED',
        );
      }
    }
  });

  it('refuses an unparseable or foreign issuer payload', () => {
    expect(verifyNocCertificate('not-a-payload', source(undefined)).verdict).toBe('UNPARSEABLE');
    expect(
      verifyNocCertificate('sos.noc.qr.v1|someone-else|NOC-1|code|digest', source(undefined)).verdict,
    ).toBe('UNPARSEABLE');
    expect(verifyNocPayloadWithFutureSchema()).toBe('UNPARSEABLE');
  });
});

function verifyNocPayloadWithFutureSchema(): string {
  const outcome = verifyNocCertificate(
    'sos.noc.qr.v2|society-os|NOC-1|code|digest',
    source(undefined),
  );
  return outcome.verdict;
}
