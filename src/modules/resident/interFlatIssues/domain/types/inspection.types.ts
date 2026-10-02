import type { Absent } from '../../../../../shared/types/absence.types';

export type InspectionStatus =
  | 'REQUESTED'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'NEEDS_REVISIT'
  | 'CANCELLED';

export type InspectionOutcome =
  | 'FINDINGS_RECORDED'
  | 'NO_FINDINGS'
  | 'ACCESS_NOT_AVAILABLE'
  | 'INCONCLUSIVE';

export type Inspection = {
  readonly id: string;
  readonly inspectionNumber: string;
  readonly caseId: string;
  readonly societyId: string;
  readonly requestedByUserId: string;
  readonly requestedAt: string;
  readonly scheduledFor: string | Absent;
  readonly assignedInspectorUserId: string | Absent;
  readonly status: InspectionStatus;
  readonly findings: string | Absent;
  readonly observedSourceUnitId: string | Absent;
  readonly observedSourceIsSuspected: boolean;
  readonly rootCauseStatement: string | Absent;
  readonly recommendedAction: string | Absent;
  readonly outcome: InspectionOutcome | Absent;
  readonly evidenceIds: readonly string[];
  readonly completedAt: string | Absent;
  readonly revisitsRequested: number;
};

export type INSPECTION_COMMANDS =
  | 'REQUEST_INSPECTION'
  | 'SCHEDULE_INSPECTION'
  | 'START_INSPECTION'
  | 'COMPLETE_INSPECTION'
  | 'REQUEST_REVISIT'
  | 'CANCEL_INSPECTION';

export const INSPECTION_TERMINAL_STATUSES: readonly InspectionStatus[] = [
  'COMPLETED',
  'CANCELLED',
];

export function isInspectionTerminal(status: InspectionStatus): boolean {
  return INSPECTION_TERMINAL_STATUSES.includes(status);
}
