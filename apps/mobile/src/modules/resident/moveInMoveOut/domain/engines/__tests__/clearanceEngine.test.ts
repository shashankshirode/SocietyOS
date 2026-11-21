import {
  evaluateClearance,
  evaluateWaiverEligibility,
  staleReadingViolations,
} from '../clearanceEngine';
import type {
  ClearanceEvaluationInput,
  ClearanceReading,
  ClearanceRequirement,
} from '../../types/clearance.types';
import { inr } from '../../types/money';

const POLICY_VERSION = 'clearance.policy.v1';

function requirement(
  overrides: Partial<ClearanceRequirement> = {},
): ClearanceRequirement {
  return {
    requirementId: 'req-dues',
    kind: 'NO_OUTSTANDING_DUES',
    domain: 'FINANCE',
    severity: 'MANDATORY',
    labelKey: 'label.noOutstandingDues',
    descriptionKey: 'description.noOutstandingDues',
    accountableRole: 'TREASURER',
    blocksReadinessWhenUnsatisfied: true,
    blocksReadinessWhenSourceUnavailable: true,
    dependsOnSettlement: true,
    ...overrides,
  };
}

function reading(overrides: Partial<ClearanceReading> = {}): ClearanceReading {
  return {
    requirementId: 'req-dues',
    domain: 'FINANCE',
    availability: 'AVAILABLE',
    applicability: 'APPLICABLE',
    satisfied: true,
    observedAt: '2026-10-01T00:00:00.000Z',
    sourceVersion: 'v1',
    detailKey: 'detail.duesClear',
    evidenceRefs: ['ledger-1'],
    unavailableReasonKey: undefined,
    outstandingAmount: inr(0),
    ...overrides,
  };
}

function input(overrides: Partial<ClearanceEvaluationInput> = {}): ClearanceEvaluationInput {
  return {
    moveOutRequestId: 'mov-1',
    moveOutRevision: 4,
    policyVersion: POLICY_VERSION,
    evaluatedAt: '2026-10-01T00:00:00.000Z',
    evaluatedByActorId: 'actor-treasurer',
    requirements: [requirement()],
    readings: [reading()],
    overrides: [],
    settlementSnapshotId: 'settle-1',
    supersedesSnapshotId: undefined,
    ...overrides,
  };
}

describe('clearanceEngine', () => {
  it('reports ready when every mandatory requirement is satisfied', () => {
    const evaluation = evaluateClearance(input());
    expect(evaluation.outcome).toBe('READY');
    expect(evaluation.snapshot.items[0]?.verdict).toBe('SATISFIED');
    expect(evaluation.snapshot.blockingRequirementIds).toEqual([]);
    expect(evaluation.violations).toEqual([]);
  });

  it('reports an exception when a mandatory requirement is unsatisfied', () => {
    const evaluation = evaluateClearance(
      input({ readings: [reading({ satisfied: false, outstandingAmount: inr(45000) })] }),
    );
    expect(evaluation.outcome).toBe('EXCEPTION');
    expect(evaluation.snapshot.blockingRequirementIds).toEqual(['req-dues']);
    expect(evaluation.snapshot.items[0]?.outstandingAmount?.minorUnits).toBe(45000);
  });

  it('treats a requirement with no reading as unverifiable and blocking', () => {
    const evaluation = evaluateClearance(input({ readings: [] }));
    expect(evaluation.outcome).toBe('EXCEPTION');
    expect(evaluation.snapshot.items[0]?.verdict).toBe('UNVERIFIABLE');
    expect(evaluation.snapshot.unverifiableRequirementIds).toEqual(['req-dues']);
    expect(evaluation.snapshot.items[0]?.detailKey).toBe('detail.readingMissing');
  });

  it('never silently passes a settlement dependent requirement without a settlement', () => {
    const evaluation = evaluateClearance(input({ settlementSnapshotId: undefined }));
    expect(evaluation.outcome).toBe('EXCEPTION');
    expect(evaluation.snapshot.items[0]?.verdict).toBe('UNVERIFIABLE');
    expect(evaluation.violations.map((violation) => violation.code)).toContain('LEDGER_NOT_RECONCILED');
  });

  it('blocks when the source is unavailable and the requirement demands it', () => {
    const evaluation = evaluateClearance(
      input({
        readings: [
          reading({
            availability: 'UNAVAILABLE',
            satisfied: false,
            detailKey: 'detail.ledgerDown',
            unavailableReasonKey: 'reason.ledgerUnavailable',
          }),
        ],
      }),
    );
    expect(evaluation.outcome).toBe('EXCEPTION');
    expect(evaluation.snapshot.items[0]?.verdict).toBe('UNVERIFIABLE');
  });

  it('does not block an optional requirement when its source is unavailable', () => {
    const evaluation = evaluateClearance(
      input({
        requirements: [
          requirement({
            severity: 'INFORMATIONAL',
            blocksReadinessWhenUnsatisfied: false,
            blocksReadinessWhenSourceUnavailable: false,
            dependsOnSettlement: false,
          }),
        ],
        readings: [reading({ availability: 'UNAVAILABLE', satisfied: false })],
      }),
    );
    expect(evaluation.outcome).toBe('READY');
    expect(evaluation.snapshot.items[0]?.verdict).toBe('UNSATISFIED');
    expect(evaluation.snapshot.items[0]?.blocking).toBe(false);
  });

  it('treats a not applicable requirement as satisfied without waiving it', () => {
    const evaluation = evaluateClearance(
      input({ readings: [reading({ applicability: 'NOT_APPLICABLE', satisfied: false })] }),
    );
    expect(evaluation.outcome).toBe('READY');
    expect(evaluation.snapshot.items[0]?.verdict).toBe('NOT_APPLICABLE');
  });

  it('marks a stale source as a superseded snapshot concern', () => {
    const stale = input({ readings: [reading({ availability: 'STALE' })] });
    expect(staleReadingViolations(stale).map((violation) => violation.code)).toEqual([
      'SNAPSHOT_SUPERSEDED',
    ]);
  });

  it('lets an override clear a blocking item but records it as overridden', () => {
    const evaluation = evaluateClearance(
      input({
        readings: [reading({ satisfied: false, outstandingAmount: inr(45000) })],
        overrides: [
          {
            requirementId: 'req-dues',
            disposition: 'OVERRIDDEN',
            reasonKey: 'reason.committyWaivedDues',
            reasonDetail: 'Committee accepted a 30 day plan',
            overriddenByActorId: 'actor-chair',
            overriddenAt: '2026-10-01T01:00:00.000Z',
            settlementSnapshotId: 'settle-1',
            signature: {
              signatureMethod: 'DIGITAL',
              signedByActorId: 'actor-chair',
              signedAt: '2026-10-01T01:00:00.000Z',
              documentId: 'doc-override-1',
              documentChecksum: 'override-checksum-1',
            },
          },
        ],
      }),
    );
    expect(evaluation.outcome).toBe('READY');
    expect(evaluation.snapshot.items[0]?.verdict).toBe('OVERRIDDEN');
    expect(evaluation.snapshot.overrides).toHaveLength(1);
  });

  it('refuses an override whose signed reason is missing', () => {
    const evaluation = evaluateClearance(
      input({
        readings: [reading({ satisfied: false, outstandingAmount: inr(45000) })],
        overrides: [
          {
            requirementId: 'req-dues',
            disposition: 'OVERRIDDEN',
            reasonKey: 'reason.waived',
            reasonDetail: 'Waived',
            overriddenByActorId: 'actor-chair',
            overriddenAt: '2026-10-01T01:00:00.000Z',
            settlementSnapshotId: 'settle-1',
            signature: {
              signatureMethod: 'DIGITAL',
              signedByActorId: 'actor-chair',
              signedAt: '2026-10-01T01:00:00.000Z',
              documentId: 'doc-override-1',
              documentChecksum: '   ',
            },
          },
        ],
      }),
    );
    expect(
      evaluation.violations.map((violation) => violation.field),
    ).toContain('override.req-dues.signature.documentChecksum');
  });

  it('refuses an override signed by somebody other than the overrider', () => {
    const evaluation = evaluateClearance(
      input({
        readings: [reading({ satisfied: false, outstandingAmount: inr(45000) })],
        overrides: [
          {
            requirementId: 'req-dues',
            disposition: 'OVERRIDDEN',
            reasonKey: 'reason.waived',
            reasonDetail: 'Waived',
            overriddenByActorId: 'actor-chair',
            overriddenAt: '2026-10-01T01:00:00.000Z',
            settlementSnapshotId: 'settle-1',
            signature: {
              signatureMethod: 'DIGITAL',
              signedByActorId: 'actor-someone-else',
              signedAt: '2026-10-01T01:00:00.000Z',
              documentId: 'doc-override-1',
              documentChecksum: 'override-checksum-1',
            },
          },
        ],
      }),
    );
    expect(
      evaluation.violations.map((violation) => violation.field),
    ).toContain('override.req-dues.signature.signedByActorId');
  });

  it('refuses an override of a settlement dependent item with no settlement attached', () => {
    const evaluation = evaluateClearance(
      input({
        settlementSnapshotId: 'settle-1',
        readings: [reading({ satisfied: false })],
        overrides: [
          {
            requirementId: 'req-dues',
            disposition: 'OVERRIDDEN',
            reasonKey: 'reason.waived',
            reasonDetail: 'Waived',
            overriddenByActorId: 'actor-chair',
            overriddenAt: '2026-10-01T01:00:00.000Z',
            settlementSnapshotId: undefined,
            signature: {
              signatureMethod: 'DIGITAL',
              signedByActorId: 'actor-chair',
              signedAt: '2026-10-01T01:00:00.000Z',
              documentId: 'doc-override-1',
              documentChecksum: 'override-checksum-1',
            },
          },
        ],
      }),
    );
    expect(evaluation.violations.map((violation) => violation.code)).toContain('LEDGER_NOT_RECONCILED');
  });

  it('refuses an override naming an unknown requirement', () => {
    const evaluation = evaluateClearance(
      input({
        overrides: [
          {
            requirementId: 'req-ghost',
            disposition: 'WAIVED',
            reasonKey: 'reason.x',
            reasonDetail: 'x',
            overriddenByActorId: 'actor-chair',
            overriddenAt: '2026-10-01T01:00:00.000Z',
            settlementSnapshotId: 'settle-1',
            signature: {
              signatureMethod: 'DIGITAL',
              signedByActorId: 'actor-chair',
              signedAt: '2026-10-01T01:00:00.000Z',
              documentId: 'doc-override-1',
              documentChecksum: 'override-checksum-1',
            },
          },
        ],
      }),
    );
    expect(evaluation.violations.map((violation) => violation.field)).toContain(
      'override.req-ghost.unknownRequirement',
    );
  });

  it('produces a checksum that changes when the outcome or any verdict changes', () => {
    const ready = evaluateClearance(input()).snapshot.checksum;
    const exception = evaluateClearance(
      input({ readings: [reading({ satisfied: false })] }),
    ).snapshot.checksum;
    expect(ready).toMatch(/^[0-9a-f]{64}$/);
    expect(ready).not.toBe(exception);
  });

  it('produces an identical checksum for an identical re evaluation', () => {
    expect(evaluateClearance(input()).snapshot.checksum).toBe(
      evaluateClearance(input()).snapshot.checksum,
    );
  });

  it('orders items by source domain so the snapshot is stable', () => {
    const evaluation = evaluateClearance(
      input({
        requirements: [
          requirement({ requirementId: 'req-vendor', kind: 'VENDOR_DUES_CLEARED', domain: 'VENDORS' }),
          requirement({ requirementId: 'req-parking', kind: 'PARKING_ALLOCATION_RELEASED', domain: 'PARKING' }),
          requirement({
            requirementId: 'req-meter',
            kind: 'UTILITY_METER_READING_RECORDED',
            domain: 'UTILITIES_METER',
            dependsOnSettlement: false,
          }),
        ],
        readings: [
          reading({ requirementId: 'req-vendor', domain: 'VENDORS' }),
          reading({ requirementId: 'req-parking', domain: 'PARKING' }),
          reading({ requirementId: 'req-meter', domain: 'UTILITIES_METER' }),
        ],
      }),
    );
    expect(evaluation.snapshot.items.map((item) => item.domain)).toEqual([
      'PARKING',
      'UTILITIES_METER',
      'VENDORS',
    ]);
  });

  it('links a superseding snapshot when a re evaluation follows an exception', () => {
    const evaluation = evaluateClearance(input({ supersedesSnapshotId: 'cls-mov-1-r2' }));
    expect(evaluation.snapshot.supersedesSnapshotId).toBe('cls-mov-1-r2');
  });

  it('gates waivers by severity and kind', () => {
    const policy = {
      waiverAllowedSeverities: ['INFORMATIONAL'] as const,
      waiverAllowedKinds: ['VENDOR_DUES_CLEARED'] as const,
    };
    expect(
      evaluateWaiverEligibility(requirement({ severity: 'INFORMATIONAL' }), policy),
    ).toBe(true);
    expect(
      evaluateWaiverEligibility(requirement({ kind: 'VENDOR_DUES_CLEARED' }), policy),
    ).toBe(true);
    expect(evaluateWaiverEligibility(requirement(), policy)).toBe(false);
  });
});
