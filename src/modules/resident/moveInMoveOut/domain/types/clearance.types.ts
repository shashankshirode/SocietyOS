import type { Absent } from '../../../../../shared/types/absence.types';
import type { Money } from './money';
import type { DomainViolation } from './primitives';

export type ClearanceSourceDomain =
  | 'FINANCE'
  | 'DOCUMENTS'
  | 'PARKING'
  | 'ACCESS_ASSETS'
  | 'UTILITIES_METER'
  | 'FACILITY_DAMAGE'
  | 'COMPLAINTS'
  | 'VENDORS';

export type ClearanceRequirementKind =
  | 'NO_OUTSTANDING_DUES'
  | 'NO_OPEN_PENALTIES'
  | 'NO_UNAPPLIED_ADVANCES'
  | 'POLICE_VERIFICATION_FILED'
  | 'TENANCY_DOCUMENTS_ARCHIVED'
  | 'PARKING_ALLOCATION_RELEASED'
  | 'ACCESS_CREDENTIALS_RETURNED'
  | 'COMMON_AREA_INSPECTION_CLEARED'
  | 'UNIT_DAMAGE_INSPECTION_CLEARED'
  | 'UTILITY_METER_READING_RECORDED'
  | 'OPEN_COMPLAINTS_RESOLVED'
  | 'VENDOR_DUES_CLEARED';

export type ClearanceRequirementSeverity = 'MANDATORY' | 'CONDITIONAL' | 'INFORMATIONAL';

export type ClearanceRequirement = {
  readonly requirementId: string;
  readonly kind: ClearanceRequirementKind;
  readonly domain: ClearanceSourceDomain;
  readonly severity: ClearanceRequirementSeverity;
  readonly labelKey: string;
  readonly descriptionKey: string;
  readonly accountableRole: string;
  readonly blocksReadinessWhenUnsatisfied: boolean;
  readonly blocksReadinessWhenSourceUnavailable: boolean;
  readonly dependsOnSettlement: boolean;
};

export type ClearanceSourceAvailability = 'AVAILABLE' | 'STALE' | 'UNAVAILABLE';

export type ClearanceApplicability = 'APPLICABLE' | 'NOT_APPLICABLE';

export type ClearanceReading = {
  readonly requirementId: string;
  readonly domain: ClearanceSourceDomain;
  readonly availability: ClearanceSourceAvailability;
  readonly applicability: ClearanceApplicability;
  readonly satisfied: boolean;
  readonly observedAt: string;
  readonly sourceVersion: string;
  readonly detailKey: string;
  readonly evidenceRefs: readonly string[];
  readonly unavailableReasonKey: string | Absent;
  readonly outstandingAmount: Money | Absent;
};

export type ClearanceItemVerdict =
  | 'SATISFIED'
  | 'UNSATISFIED'
  | 'WAIVED'
  | 'OVERRIDDEN'
  | 'UNVERIFIABLE'
  | 'NOT_APPLICABLE';

export type ClearanceItemView = {
  readonly requirementId: string;
  readonly kind: ClearanceRequirementKind;
  readonly domain: ClearanceSourceDomain;
  readonly severity: ClearanceRequirementSeverity;
  readonly labelKey: string;
  readonly descriptionKey: string;
  readonly accountableRole: string;
  readonly verdict: ClearanceItemVerdict;
  readonly blocking: boolean;
  readonly detailKey: string;
  readonly evidenceRefs: readonly string[];
  readonly sourceVersion: string | Absent;
  readonly outstandingAmount: Money | Absent;
};

export type ClearanceOutcome = 'READY' | 'EXCEPTION';

export type ClearanceOverrideDisposition = 'WAIVED' | 'OVERRIDDEN';

export type OverrideSignature = {
  readonly signatureMethod: 'DIGITAL' | 'WET_INK';
  readonly signedByActorId: string;
  readonly signedAt: string;
  readonly documentId: string;
  readonly documentChecksum: string;
};

export type ClearanceOverride = {
  readonly requirementId: string;
  readonly disposition: ClearanceOverrideDisposition;
  readonly reasonKey: string;
  readonly reasonDetail: string;
  readonly overriddenByActorId: string;
  readonly overriddenAt: string;
  readonly settlementSnapshotId: string | Absent;
  readonly signature: OverrideSignature;
};

export type ClearanceSnapshot = {
  readonly snapshotId: string;
  readonly moveOutRequestId: string;
  readonly moveOutRevision: number;
  readonly policyVersion: string;
  readonly evaluatedAt: string;
  readonly evaluatedByActorId: string;
  readonly outcome: ClearanceOutcome;
  readonly items: readonly ClearanceItemView[];
  readonly blockingRequirementIds: readonly string[];
  readonly unverifiableRequirementIds: readonly string[];
  readonly overrides: readonly ClearanceOverride[];
  readonly supersedesSnapshotId: string | Absent;
  readonly checksum: string;
};

export type ClearanceEvaluationInput = {
  readonly moveOutRequestId: string;
  readonly moveOutRevision: number;
  readonly policyVersion: string;
  readonly evaluatedAt: string;
  readonly evaluatedByActorId: string;
  readonly requirements: readonly ClearanceRequirement[];
  readonly readings: readonly ClearanceReading[];
  readonly overrides: readonly ClearanceOverride[];
  readonly settlementSnapshotId: string | Absent;
  readonly supersedesSnapshotId: string | Absent;
};

export type ClearanceEvaluation = {
  readonly outcome: ClearanceOutcome;
  readonly snapshot: ClearanceSnapshot;
  readonly violations: readonly DomainViolation[];
};

export const CLEARANCE_SOURCE_DOMAIN_ORDER: readonly ClearanceSourceDomain[] = [
  'FINANCE',
  'DOCUMENTS',
  'PARKING',
  'ACCESS_ASSETS',
  'UTILITIES_METER',
  'FACILITY_DAMAGE',
  'COMPLAINTS',
  'VENDORS',
];

export const CLEARANCE_VERDICT_PRIORITY: readonly ClearanceItemVerdict[] = [
  'UNVERIFIABLE',
  'UNSATISFIED',
  'OVERRIDDEN',
  'WAIVED',
  'NOT_APPLICABLE',
  'SATISFIED',
];
