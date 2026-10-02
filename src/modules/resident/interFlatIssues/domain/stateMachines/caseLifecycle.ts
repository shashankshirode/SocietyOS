import type { DisputeCase, DisputeCaseStatus } from '../types/case.types';
import { isCaseTerminal } from '../types/case.types';
import type {
  DisputeActorType,
  DisputeDecision,
  DisputeTransitionResult,
  DisputeViolation,
} from '../types/primitives';
import { allowedWith, denied, violation } from '../types/primitives';

export type CaseCommandKind =
  | 'OPEN_CASE'
  | 'RECORD_CLAIM'
  | 'RECORD_RESPONSE'
  | 'REQUEST_INSPECTION'
  | 'SCHEDULE_INSPECTION'
  | 'COMPLETE_INSPECTION'
  | 'REQUEST_MEDIATION'
  | 'ASSIGN_MEDIATOR'
  | 'PROPOSE_RESOLUTION'
  | 'SUBMIT_CLOSURE_PROOF'
  | 'VERIFY_CLOSURE_PROOF'
  | 'RESOLVE_CASE'
  | 'CLOSE_CASE'
  | 'WITHDRAW_CASE'
  | 'MARK_UNRESOLVED'
  | 'ESCALATE_CASE'
  | 'PLACE_LEGAL_HOLD'
  | 'RELEASE_LEGAL_HOLD';

const RESIDENT_ACTORS: readonly DisputeActorType[] = [
  'RESIDENT_REPORTER',
  'RESIDENT_RESPONDENT',
  'RESIDENT_AFFECTED',
];

const COMMITTEE_ACTORS: readonly DisputeActorType[] = [
  'SOCIETY_ADMIN',
  'SOCIETY_SECRETARY',
  'SOCIETY_CHAIRPERSON',
  'COMMITTEE_MEMBER',
];

const CLOSURE_ACTORS: readonly DisputeActorType[] = [
  'SOCIETY_ADMIN',
  'SOCIETY_SECRETARY',
  'SOCIETY_CHAIRPERSON',
  'COMMITTEE_MEMBER',
  'SYSTEM',
];

export const PERMITTED_ACTORS_BY_COMMAND: Readonly<Record<CaseCommandKind, readonly DisputeActorType[]>> = {
  OPEN_CASE: [...RESIDENT_ACTORS, 'SOCIETY_ADMIN', 'SYSTEM'],
  RECORD_CLAIM: [...RESIDENT_ACTORS, 'SOCIETY_ADMIN'],
  RECORD_RESPONSE: ['RESIDENT_RESPONDENT', 'RESIDENT_AFFECTED', 'SOCIETY_ADMIN'],
  REQUEST_INSPECTION: [...RESIDENT_ACTORS, ...COMMITTEE_ACTORS, 'FACILITY_MANAGER', 'SYSTEM'],
  SCHEDULE_INSPECTION: ['FACILITY_MANAGER', 'INSPECTOR', ...COMMITTEE_ACTORS, 'SYSTEM'],
  COMPLETE_INSPECTION: ['FACILITY_MANAGER', 'INSPECTOR', ...COMMITTEE_ACTORS],
  REQUEST_MEDIATION: [...RESIDENT_ACTORS, ...COMMITTEE_ACTORS],
  ASSIGN_MEDIATOR: COMMITTEE_ACTORS,
  PROPOSE_RESOLUTION: ['MEDIATOR', ...COMMITTEE_ACTORS],
  SUBMIT_CLOSURE_PROOF: [...RESIDENT_ACTORS, ...COMMITTEE_ACTORS],
  VERIFY_CLOSURE_PROOF: COMMITTEE_ACTORS,
  RESOLVE_CASE: COMMITTEE_ACTORS,
  CLOSE_CASE: CLOSURE_ACTORS,
  WITHDRAW_CASE: ['RESIDENT_REPORTER'],
  MARK_UNRESOLVED: COMMITTEE_ACTORS,
  ESCALATE_CASE: [...RESIDENT_ACTORS, ...COMMITTEE_ACTORS],
  PLACE_LEGAL_HOLD: COMMITTEE_ACTORS,
  RELEASE_LEGAL_HOLD: COMMITTEE_ACTORS,
};

export const TARGET_STATUS_BY_COMMAND: Readonly<Record<CaseCommandKind, DisputeCaseStatus>> = {
  OPEN_CASE: 'OPEN',
  RECORD_CLAIM: 'OPEN',
  RECORD_RESPONSE: 'RESPONSE_RECEIVED',
  REQUEST_INSPECTION: 'UNDER_INVESTIGATION',
  SCHEDULE_INSPECTION: 'INSPECTION_SCHEDULED',
  COMPLETE_INSPECTION: 'INSPECTION_COMPLETED',
  REQUEST_MEDIATION: 'MEDIATION_REQUESTED',
  ASSIGN_MEDIATOR: 'MEDIATION_ACTIVE',
  PROPOSE_RESOLUTION: 'RESOLUTION_PROPOSED',
  SUBMIT_CLOSURE_PROOF: 'AWAITING_CLOSURE_PROOF',
  VERIFY_CLOSURE_PROOF: 'AWAITING_CLOSURE_PROOF',
  RESOLVE_CASE: 'RESOLVED',
  CLOSE_CASE: 'CLOSED',
  WITHDRAW_CASE: 'WITHDRAWN',
  MARK_UNRESOLVED: 'UNRESOLVED',
  ESCALATE_CASE: 'ESCALATED',
  PLACE_LEGAL_HOLD: 'ESCALATED',
  RELEASE_LEGAL_HOLD: 'ESCALATED',
};

const ALLOWED_FROM: Readonly<Record<CaseCommandKind, readonly DisputeCaseStatus[]>> = {
  OPEN_CASE: ['DRAFT'],
  RECORD_CLAIM: ['OPEN', 'AWAITING_RESPONDENT_RESPONSE', 'RESPONSE_RECEIVED', 'UNDER_INVESTIGATION', 'MEDIATION_ACTIVE'],
  RECORD_RESPONSE: ['OPEN', 'AWAITING_RESPONDENT_RESPONSE', 'UNDER_INVESTIGATION'],
  REQUEST_INSPECTION: ['OPEN', 'RESPONSE_RECEIVED', 'UNDER_INVESTIGATION', 'INSPECTION_COMPLETED', 'MEDIATION_ACTIVE', 'ESCALATED'],
  SCHEDULE_INSPECTION: ['UNDER_INVESTIGATION'],
  COMPLETE_INSPECTION: ['UNDER_INVESTIGATION', 'INSPECTION_SCHEDULED'],
  REQUEST_MEDIATION: ['OPEN', 'RESPONSE_RECEIVED', 'UNDER_INVESTIGATION', 'INSPECTION_COMPLETED', 'ESCALATED'],
  ASSIGN_MEDIATOR: ['MEDIATION_REQUESTED'],
  PROPOSE_RESOLUTION: ['MEDIATION_ACTIVE', 'INSPECTION_COMPLETED', 'ESCALATED', 'RESOLUTION_PROPOSED'],
  SUBMIT_CLOSURE_PROOF: ['RESOLUTION_PROPOSED', 'AWAITING_CLOSURE_PROOF', 'RESOLVED'],
  VERIFY_CLOSURE_PROOF: ['AWAITING_CLOSURE_PROOF', 'RESOLUTION_PROPOSED'],
  RESOLVE_CASE: ['AWAITING_CLOSURE_PROOF', 'RESOLUTION_PROPOSED', 'INSPECTION_COMPLETED', 'MEDIATION_ACTIVE'],
  CLOSE_CASE: ['RESOLVED', 'UNRESOLVED', 'ESCALATED', 'WITHDRAWN'],
  WITHDRAW_CASE: ['OPEN', 'AWAITING_RESPONDENT_RESPONSE', 'RESPONSE_RECEIVED', 'UNDER_INVESTIGATION', 'MEDIATION_REQUESTED', 'MEDIATION_ACTIVE', 'RESOLUTION_PROPOSED', 'AWAITING_CLOSURE_PROOF'],
  MARK_UNRESOLVED: ['OPEN', 'AWAITING_RESPONDENT_RESPONSE', 'RESPONSE_RECEIVED', 'UNDER_INVESTIGATION', 'INSPECTION_SCHEDULED', 'INSPECTION_COMPLETED', 'MEDIATION_REQUESTED', 'MEDIATION_ACTIVE', 'RESOLUTION_PROPOSED', 'AWAITING_CLOSURE_PROOF', 'ESCALATED'],
  ESCALATE_CASE: ['OPEN', 'AWAITING_RESPONDENT_RESPONSE', 'RESPONSE_RECEIVED', 'UNDER_INVESTIGATION', 'INSPECTION_SCHEDULED', 'INSPECTION_COMPLETED', 'MEDIATION_REQUESTED', 'MEDIATION_ACTIVE', 'RESOLUTION_PROPOSED', 'AWAITING_CLOSURE_PROOF'],
  PLACE_LEGAL_HOLD: ['OPEN', 'AWAITING_RESPONDENT_RESPONSE', 'RESPONSE_RECEIVED', 'UNDER_INVESTIGATION', 'INSPECTION_SCHEDULED', 'INSPECTION_COMPLETED', 'MEDIATION_REQUESTED', 'MEDIATION_ACTIVE', 'RESOLUTION_PROPOSED', 'AWAITING_CLOSURE_PROOF', 'RESOLVED', 'ESCALATED'],
  RELEASE_LEGAL_HOLD: ['ESCALATED'],
};

export function commandPermitsActor(
  command: CaseCommandKind,
  actorType: DisputeActorType,
): boolean {
  return PERMITTED_ACTORS_BY_COMMAND[command].includes(actorType);
}

export function allowedSourceStatuses(command: CaseCommandKind): readonly DisputeCaseStatus[] {
  return ALLOWED_FROM[command];
}

export function canApplyCommand(
  disputeCase: DisputeCase,
  command: CaseCommandKind,
): boolean {
  if (isCaseTerminal(disputeCase.status) && command !== 'RELEASE_LEGAL_HOLD') {
    return false;
  }
  return ALLOWED_FROM[command].includes(disputeCase.status);
}

export function evaluateCommandActor(
  command: CaseCommandKind,
  actorType: DisputeActorType,
): DisputeDecision {
  if (!commandPermitsActor(command, actorType)) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        `command.${command}`,
        `Actor type ${actorType} may not issue ${command} on a dispute case.`,
      ),
    ]);
  }
  return allowedWith([]);
}

export function evaluateCaseTransition(
  disputeCase: DisputeCase,
  command: CaseCommandKind,
): DisputeDecision {
  if (isCaseTerminal(disputeCase.status) && command !== 'RELEASE_LEGAL_HOLD') {
    return denied([
      violation(
        'TERMINAL_STATE',
        'case.status',
        `Case ${disputeCase.caseNumber} is terminal in ${disputeCase.status}.`,
      ),
    ]);
  }
  if (!ALLOWED_FROM[command].includes(disputeCase.status)) {
    return denied([
      violation(
        'ILLEGAL_TRANSITION',
        'case.status',
        `Command ${command} is not permitted from ${disputeCase.status}.`,
      ),
    ]);
  }
  return allowedWith([]);
}

export function applyCaseCommand(
  disputeCase: DisputeCase,
  command: CaseCommandKind,
  now: string,
  mutate: (current: DisputeCase) => DisputeCase,
): DisputeTransitionResult<DisputeCaseStatus> {
  const decision = evaluateCaseTransition(disputeCase, command);
  if (!decision.allowed) {
    return {
      allowed: false,
      from: disputeCase.status,
      attempted: TARGET_STATUS_BY_COMMAND[command],
      violations: decision.violations,
    };
  }

  const target = TARGET_STATUS_BY_COMMAND[command];
  const mutated = mutate({ ...disputeCase, status: target, updatedAt: now });
  return { allowed: true, from: disputeCase.status, to: mutated.status, warnings: decision.warnings };
}
