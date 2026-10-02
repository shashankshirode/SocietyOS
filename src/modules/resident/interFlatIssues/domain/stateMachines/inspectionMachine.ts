import type { Inspection, InspectionStatus } from '../types/inspection.types';
import { isInspectionTerminal } from '../types/inspection.types';
import type { DisputeActorType, DisputeDecision, DisputeTransitionResult } from '../types/primitives';
import { allowedWith, denied, violation } from '../types/primitives';

export type InspectionCommandKind =
  | 'REQUEST_INSPECTION'
  | 'SCHEDULE_INSPECTION'
  | 'START_INSPECTION'
  | 'COMPLETE_INSPECTION'
  | 'REQUEST_REVISIT'
  | 'CANCEL_INSPECTION';

export const INSPECTION_TARGET: Readonly<Record<InspectionCommandKind, InspectionStatus>> = {
  REQUEST_INSPECTION: 'REQUESTED',
  SCHEDULE_INSPECTION: 'SCHEDULED',
  START_INSPECTION: 'IN_PROGRESS',
  COMPLETE_INSPECTION: 'COMPLETED',
  REQUEST_REVISIT: 'NEEDS_REVISIT',
  CANCEL_INSPECTION: 'CANCELLED',
};

const INSPECTION_FROM: Readonly<Record<InspectionCommandKind, readonly InspectionStatus[]>> = {
  REQUEST_INSPECTION: ['REQUESTED'],
  SCHEDULE_INSPECTION: ['REQUESTED', 'NEEDS_REVISIT'],
  START_INSPECTION: ['SCHEDULED'],
  COMPLETE_INSPECTION: ['IN_PROGRESS', 'SCHEDULED'],
  REQUEST_REVISIT: ['COMPLETED'],
  CANCEL_INSPECTION: ['REQUESTED', 'SCHEDULED', 'IN_PROGRESS', 'NEEDS_REVISIT'],
};

const INSPECTION_ACTORS: Readonly<Record<InspectionCommandKind, readonly DisputeActorType[]>> = {
  REQUEST_INSPECTION: ['RESIDENT_REPORTER', 'RESIDENT_RESPONDENT', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER', 'FACILITY_MANAGER', 'SYSTEM'],
  SCHEDULE_INSPECTION: ['FACILITY_MANAGER', 'INSPECTOR', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER', 'SYSTEM'],
  START_INSPECTION: ['FACILITY_MANAGER', 'INSPECTOR'],
  COMPLETE_INSPECTION: ['FACILITY_MANAGER', 'INSPECTOR', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER'],
  REQUEST_REVISIT: ['RESIDENT_REPORTER', 'RESIDENT_RESPONDENT', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER', 'FACILITY_MANAGER'],
  CANCEL_INSPECTION: ['SOCIETY_ADMIN', 'COMMITTEE_MEMBER', 'FACILITY_MANAGER', 'SYSTEM'],
};

export function canApplyInspectionCommand(
  inspection: Inspection,
  command: InspectionCommandKind,
): boolean {
  if (isInspectionTerminal(inspection.status) && command !== 'REQUEST_REVISIT') {
    return false;
  }
  return INSPECTION_FROM[command].includes(inspection.status);
}

export function evaluateInspectionTransition(
  inspection: Inspection,
  command: InspectionCommandKind,
): DisputeDecision {
  if (isInspectionTerminal(inspection.status) && command !== 'REQUEST_REVISIT') {
    return denied([
      violation(
        'INSPECTION_ALREADY_TERMINAL',
        'inspection.status',
        `Inspection ${inspection.inspectionNumber} is already ${inspection.status}.`,
      ),
    ]);
  }
  if (!INSPECTION_FROM[command].includes(inspection.status)) {
    return denied([
      violation(
        'ILLEGAL_TRANSITION',
        'inspection.status',
        `Inspection command ${command} is not permitted from ${inspection.status}.`,
      ),
    ]);
  }
  return allowedWith([]);
}

export function evaluateInspectionActor(
  command: InspectionCommandKind,
  actorType: DisputeActorType,
): DisputeDecision {
  if (!INSPECTION_ACTORS[command].includes(actorType)) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        `inspection.${command}`,
        `Actor type ${actorType} may not issue ${command}.`,
      ),
    ]);
  }
  return allowedWith([]);
}

export function applyInspectionCommand(
  inspection: Inspection,
  command: InspectionCommandKind,
  now: string,
  mutate: (current: Inspection) => Inspection,
): DisputeTransitionResult<InspectionStatus> {
  const decision = evaluateInspectionTransition(inspection, command);
  if (!decision.allowed) {
    return {
      allowed: false,
      from: inspection.status,
      attempted: INSPECTION_TARGET[command],
      violations: decision.violations,
    };
  }
  const mutated = mutate({ ...inspection, status: INSPECTION_TARGET[command] });
  return { allowed: true, from: inspection.status, to: mutated.status, warnings: decision.warnings };
}
