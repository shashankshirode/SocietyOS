import { canonicalPreimageSha256, optionalPart, requiredPart, requiredString, sortedStringListPart, type CanonicalPart } from '../crypto/canonicalJson';
import type { Absent } from '../../../../../shared/types/absence.types';
import type {
  ClearanceEvaluation,
  ClearanceEvaluationInput,
  ClearanceItemVerdict,
  ClearanceItemView,
  ClearanceOutcome,
  ClearanceOverride,
  ClearanceReading,
  ClearanceRequirement,
  ClearanceSnapshot,
} from '../types/clearance.types';
import { CLEARANCE_SOURCE_DOMAIN_ORDER } from '../types/clearance.types';
import type { DomainViolation } from '../types/primitives';

const UNAVAILABLE_VERDICT: ClearanceItemVerdict = 'UNVERIFIABLE';

function blocking(code: DomainViolation['code'], field: string): DomainViolation {
  return { code, field, blocking: true };
}

function findRequirement(
  requirements: readonly ClearanceRequirement[],
  requirementId: string,
): ClearanceRequirement | Absent {
  return requirements.find((requirement) => requirement.requirementId === requirementId);
}

function findReading(
  readings: readonly ClearanceReading[],
  requirementId: string,
): ClearanceReading | Absent {
  return readings.find((reading) => reading.requirementId === requirementId);
}

function findOverride(
  overrides: readonly ClearanceOverride[],
  requirementId: string,
): ClearanceOverride | Absent {
  return overrides.find((override) => override.requirementId === requirementId);
}

function isBlocking(verdict: ClearanceItemVerdict): boolean {
  return verdict === 'UNSATISFIED' || verdict === 'UNVERIFIABLE';
}

function sortItems(items: readonly ClearanceItemView[]): readonly ClearanceItemView[] {
  const domainRank = (domain: ClearanceItemView['domain']): number => {
    const index = CLEARANCE_SOURCE_DOMAIN_ORDER.indexOf(domain);
    return index === -1 ? CLEARANCE_SOURCE_DOMAIN_ORDER.length : index;
  };

  return [...items].sort((left, right) => {
    const byDomain = domainRank(left.domain) - domainRank(right.domain);

    if (byDomain !== 0) {
      return byDomain;
    }

    if (left.requirementId === right.requirementId) {
      return 0;
    }

    return left.requirementId < right.requirementId ? -1 : 1;
  });
}

function effectiveVerdict(
  requirement: ClearanceRequirement,
  reading: ClearanceReading | Absent,
  override: ClearanceOverride | Absent,
  settlementLinked: boolean,
): ClearanceItemVerdict {
  if (!settlementLinked && requirement.dependsOnSettlement) {
    return UNAVAILABLE_VERDICT;
  }

  if (reading === undefined) {
    return UNAVAILABLE_VERDICT;
  }

  if (override !== undefined) {
    return override.disposition === 'WAIVED' ? 'WAIVED' : 'OVERRIDDEN';
  }

  if (reading.applicability === 'NOT_APPLICABLE') {
    return 'NOT_APPLICABLE';
  }

  if (reading.availability === 'AVAILABLE') {
    return reading.satisfied ? 'SATISFIED' : 'UNSATISFIED';
  }

  if (reading.availability === 'UNAVAILABLE') {
    return requirement.blocksReadinessWhenSourceUnavailable ? UNAVAILABLE_VERDICT : 'UNSATISFIED';
  }

  return requirement.blocksReadinessWhenSourceUnavailable ? UNAVAILABLE_VERDICT : 'UNSATISFIED';
}

function buildView(
  requirement: ClearanceRequirement,
  verdict: ClearanceItemVerdict,
  reading: ClearanceReading | Absent,
): ClearanceItemView {
  return {
    requirementId: requirement.requirementId,
    kind: requirement.kind,
    domain: requirement.domain,
    severity: requirement.severity,
    labelKey: requirement.labelKey,
    descriptionKey: requirement.descriptionKey,
    accountableRole: requirement.accountableRole,
    verdict,
    blocking: isBlocking(verdict) && requirement.blocksReadinessWhenUnsatisfied,
    detailKey: reading === undefined ? 'detail.readingMissing' : reading.detailKey,
    evidenceRefs: reading === undefined ? [] : reading.evidenceRefs,
    sourceVersion: reading === undefined ? undefined : reading.sourceVersion,
    outstandingAmount: reading === undefined ? undefined : reading.outstandingAmount,
  };
}

export function evaluateClearance(input: ClearanceEvaluationInput): ClearanceEvaluation {
  const violations: DomainViolation[] = [];
  const settlementLinked = input.settlementSnapshotId !== undefined;

  for (const requirement of input.requirements) {
    if (requirement.dependsOnSettlement && !settlementLinked) {
      violations.push(
        blocking('LEDGER_NOT_RECONCILED', `requirement.${requirement.requirementId}.dependsOnSettlement`),
      );
    }
  }

  for (const override of input.overrides) {
    const requirement = findRequirement(input.requirements, override.requirementId);

    if (requirement === undefined) {
      violations.push(
        blocking('PRECONDITION_FAILED', `override.${override.requirementId}.unknownRequirement`),
      );
      continue;
    }

    if (override.reasonKey.trim().length === 0) {
      violations.push(blocking('PRECONDITION_FAILED', `override.${override.requirementId}.reasonKey`));
    }

    if (override.reasonDetail.trim().length === 0) {
      violations.push(
        blocking('PRECONDITION_FAILED', `override.${override.requirementId}.reasonDetail`),
      );
    }

    if (override.signature.documentChecksum.trim().length === 0) {
      violations.push(
        blocking('PRECONDITION_FAILED', `override.${override.requirementId}.signature.documentChecksum`),
      );
    }

    if (override.signature.signedByActorId !== override.overriddenByActorId) {
      violations.push(
        blocking('PRECONDITION_FAILED', `override.${override.requirementId}.signature.signedByActorId`),
      );
    }

    if (override.settlementSnapshotId === undefined && requirement.dependsOnSettlement) {
      violations.push(
        blocking(
          'LEDGER_NOT_RECONCILED',
          `override.${override.requirementId}.settlementSnapshotId`,
        ),
      );
    }
  }

  const items: ClearanceItemView[] = [];

  for (const requirement of input.requirements) {
    const reading = findReading(input.readings, requirement.requirementId);
    const override = findOverride(input.overrides, requirement.requirementId);
    const verdict = effectiveVerdict(requirement, reading, override, settlementLinked);
    items.push(buildView(requirement, verdict, reading));
  }

  const ordered = sortItems(items);
  const blockingIds = ordered.filter((item) => item.blocking).map((item) => item.requirementId);
  const unverifiableIds = ordered
    .filter((item) => item.verdict === UNAVAILABLE_VERDICT)
    .map((item) => item.requirementId);
  const outcome: ClearanceOutcome = blockingIds.length === 0 ? 'READY' : 'EXCEPTION';

  const snapshot: ClearanceSnapshot = {
    snapshotId: `cls-${input.moveOutRequestId}-r${input.moveOutRevision}`,
    moveOutRequestId: input.moveOutRequestId,
    moveOutRevision: input.moveOutRevision,
    policyVersion: input.policyVersion,
    evaluatedAt: input.evaluatedAt,
    evaluatedByActorId: input.evaluatedByActorId,
    outcome,
    items: ordered,
    blockingRequirementIds: blockingIds,
    unverifiableRequirementIds: unverifiableIds,
    overrides: input.overrides,
    supersedesSnapshotId: input.supersedesSnapshotId,
    checksum: '',
  };

  return {
    outcome,
    snapshot: { ...snapshot, checksum: snapshotChecksum(snapshot) },
    violations,
  };
}

function snapshotChecksum(snapshot: ClearanceSnapshot): string {
  const parts: readonly CanonicalPart[] = [
    requiredPart('moveOutRequestId', snapshot.moveOutRequestId),
    requiredPart('moveOutRevision', snapshot.moveOutRevision),
    requiredString('policyVersion', snapshot.policyVersion),
    requiredPart('evaluatedAt', snapshot.evaluatedAt),
    requiredString('outcome', snapshot.outcome),
    requiredString('supersedesSnapshotId', snapshot.supersedesSnapshotId ?? 'none'),
    sortedStringListPart('blockingRequirementIds', snapshot.blockingRequirementIds),
    sortedStringListPart('unverifiableRequirementIds', snapshot.unverifiableRequirementIds),
    optionalPart('itemVerdicts', snapshot.items.map((item) => `${item.requirementId}:${item.verdict}`)),
  ];

  return canonicalPreimageSha256('sos.clearance.snapshot.v1', parts);
}

export type ClearanceWaiverPolicy = {
  readonly waiverAllowedSeverities: readonly ClearanceRequirement['severity'][];
  readonly waiverAllowedKinds: readonly ClearanceRequirement['kind'][];
};

export function evaluateWaiverEligibility(
  requirement: ClearanceRequirement,
  policy: ClearanceWaiverPolicy,
): boolean {
  return (
    policy.waiverAllowedSeverities.includes(requirement.severity) ||
    policy.waiverAllowedKinds.includes(requirement.kind)
  );
}

export function staleReadingViolations(
  input: ClearanceEvaluationInput,
): readonly DomainViolation[] {
  return input.readings
    .filter((reading) => reading.availability === 'STALE')
    .map((reading) =>
      blocking('SNAPSHOT_SUPERSEDED', `reading.${reading.requirementId}.availability`),
    );
}
