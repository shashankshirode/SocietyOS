import type { Absent } from '../../../../../shared/types/absence.types';
import type {
  DisputeActorType,
  DisputeDecision,
  DisputeTransitionResult,
  DisputeViolation,
} from '../types/primitives';
import { allowedWith, denied, violation } from '../types/primitives';
import type { MediatorNote, MediatorNoteVisibility } from '../types/mediation.types';

export type MediationStatus =
  | 'REQUESTED'
  | 'ASSIGNED'
  | 'IN_DISCUSSION'
  | 'RESOLUTION_PROPOSED'
  | 'AGREED'
  | 'REJECTED'
  | 'ESCALATED'
  | 'CLOSED';

export type Mediation = {
  readonly id: string;
  readonly caseId: string;
  readonly societyId: string;
  readonly status: MediationStatus;
  readonly mediatorUserId: string | Absent;
  readonly notes: readonly MediatorNote[];
  readonly requestedByUserId: string;
  readonly requestedAt: string;
  readonly assignedAt: string | Absent;
  readonly closedAt: string | Absent;
};

export type MediationCommandKind =
  | 'REQUEST_MEDIATION'
  | 'ASSIGN_MEDIATOR'
  | 'START_DISCUSSION'
  | 'RECORD_NOTE'
  | 'PROPOSE_RESOLUTION'
  | 'MARK_AGREED'
  | 'MARK_REJECTED'
  | 'ESCALATE'
  | 'CLOSE_MEDIATION';

export const MEDIATION_TARGET: Readonly<Record<MediationCommandKind, MediationStatus>> = {
  REQUEST_MEDIATION: 'REQUESTED',
  ASSIGN_MEDIATOR: 'ASSIGNED',
  START_DISCUSSION: 'IN_DISCUSSION',
  RECORD_NOTE: 'IN_DISCUSSION',
  PROPOSE_RESOLUTION: 'RESOLUTION_PROPOSED',
  MARK_AGREED: 'AGREED',
  MARK_REJECTED: 'REJECTED',
  ESCALATE: 'ESCALATED',
  CLOSE_MEDIATION: 'CLOSED',
};

const MEDIATION_FROM: Readonly<Record<MediationCommandKind, readonly MediationStatus[]>> = {
  REQUEST_MEDIATION: ['REQUESTED'],
  ASSIGN_MEDIATOR: ['REQUESTED', 'ESCALATED'],
  START_DISCUSSION: ['ASSIGNED'],
  RECORD_NOTE: ['ASSIGNED', 'IN_DISCUSSION', 'RESOLUTION_PROPOSED'],
  PROPOSE_RESOLUTION: ['ASSIGNED', 'IN_DISCUSSION', 'RESOLUTION_PROPOSED'],
  MARK_AGREED: ['RESOLUTION_PROPOSED', 'IN_DISCUSSION'],
  MARK_REJECTED: ['RESOLUTION_PROPOSED', 'IN_DISCUSSION'],
  ESCALATE: ['ASSIGNED', 'IN_DISCUSSION', 'RESOLUTION_PROPOSED', 'AGREED', 'REJECTED'],
  CLOSE_MEDIATION: ['AGREED', 'REJECTED', 'ESCALATED'],
};

const MEDIATION_ACTORS: Readonly<Record<MediationCommandKind, readonly DisputeActorType[]>> = {
  REQUEST_MEDIATION: ['RESIDENT_REPORTER', 'RESIDENT_RESPONDENT', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER'],
  ASSIGN_MEDIATOR: ['SOCIETY_ADMIN', 'SOCIETY_SECRETARY', 'SOCIETY_CHAIRPERSON', 'COMMITTEE_MEMBER'],
  START_DISCUSSION: ['MEDIATOR', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER'],
  RECORD_NOTE: ['MEDIATOR', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER'],
  PROPOSE_RESOLUTION: ['MEDIATOR', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER'],
  MARK_AGREED: ['SOCIETY_ADMIN', 'COMMITTEE_MEMBER'],
  MARK_REJECTED: ['SOCIETY_ADMIN', 'COMMITTEE_MEMBER'],
  ESCALATE: ['MEDIATOR', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER', 'RESIDENT_REPORTER', 'RESIDENT_RESPONDENT'],
  CLOSE_MEDIATION: ['SOCIETY_ADMIN', 'COMMITTEE_MEMBER'],
};

export function canApplyMediationCommand(
  mediation: Mediation,
  command: MediationCommandKind,
): boolean {
  return MEDIATION_FROM[command].includes(mediation.status);
}

export function evaluateMediationTransition(
  mediation: Mediation,
  command: MediationCommandKind,
): DisputeDecision {
  if (mediation.status === 'CLOSED') {
    return denied([
      violation('TERMINAL_STATE', 'mediation.status', `Mediation ${mediation.id} is closed.`),
    ]);
  }
  if (!MEDIATION_FROM[command].includes(mediation.status)) {
    return denied([
      violation(
        'MEDIATION_NOT_ACTIVE',
        'mediation.status',
        `Mediation command ${command} is not permitted from ${mediation.status}.`,
      ),
    ]);
  }
  return allowedWith([]);
}

export function evaluateMediationActor(
  command: MediationCommandKind,
  actorType: DisputeActorType,
): DisputeDecision {
  if (!MEDIATION_ACTORS[command].includes(actorType)) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        `mediation.${command}`,
        `Actor type ${actorType} may not issue ${command}.`,
      ),
    ]);
  }
  return allowedWith([]);
}

export function applyMediationCommand(
  mediation: Mediation,
  command: MediationCommandKind,
  now: string,
  mutate: (current: Mediation) => Mediation,
): DisputeTransitionResult<MediationStatus> {
  const decision = evaluateMediationTransition(mediation, command);
  if (!decision.allowed) {
    return {
      allowed: false,
      from: mediation.status,
      attempted: MEDIATION_TARGET[command],
      violations: decision.violations,
    };
  }
  const mutated = mutate({ ...mediation, status: MEDIATION_TARGET[command] });
  return { allowed: true, from: mediation.status, to: mutated.status, warnings: decision.warnings };
}

const NOTE_VISIBLE_TO_PARTIES: readonly MediatorNoteVisibility[] = ['ALL_PARTIES'];

export function noteVisibilityForActor(
  visibility: MediatorNoteVisibility,
  actorType: DisputeActorType,
): DisputeDecision {
  if (visibility === 'ALL_PARTIES') {
    return allowedWith([]);
  }
  if (visibility === 'COMMITTEE_AND_MEDIATOR') {
    const committee: readonly DisputeActorType[] = [
      'SOCIETY_ADMIN',
      'SOCIETY_SECRETARY',
      'SOCIETY_CHAIRPERSON',
      'COMMITTEE_MEMBER',
      'MEDIATOR',
    ];
    if (committee.includes(actorType)) {
      return allowedWith([]);
    }
    return denied([
      violation(
        'MEDIATION_NOTE_VISIBILITY_DENIED',
        'mediatorNote.visibility',
        'This note is restricted to the mediator and committee.',
      ),
    ]);
  }
  if (visibility === 'MEDIATOR_ONLY') {
    if (actorType === 'MEDIATOR') {
      return allowedWith([]);
    }
    return denied([
      violation(
        'MEDIATION_NOTE_VISIBILITY_DENIED',
        'mediatorNote.visibility',
        'This note is restricted to the assigned mediator.',
      ),
    ]);
  }
  return denied([
    violation(
      'MEDIATION_NOTE_VISIBILITY_DENIED',
      'mediatorNote.visibility',
      'The requested note visibility could not be evaluated; the request fails closed.',
    ),
  ]);
}

export function visibleNotesFor(
  notes: readonly MediatorNote[],
  actorType: DisputeActorType,
): readonly MediatorNote[] {
  return notes.filter((note) => noteVisibilityForActor(note.visibility, actorType).allowed);
}

export function partyVisibleNotes(notes: readonly MediatorNote[]): readonly MediatorNote[] {
  return notes.filter((note) => NOTE_VISIBLE_TO_PARTIES.includes(note.visibility));
}

export function mediatorNoteViolations(
  note: string,
  visibility: MediatorNoteVisibility,
): readonly DisputeViolation[] {
  const violations: DisputeViolation[] = [];
  if (note.trim().length < 5) {
    violations.push(violation('VALIDATION_FAILED', 'mediatorNote.note', 'A mediator note must describe what was discussed.'));
  }
  if (visibility === 'ALL_PARTIES' && note.length > 2000) {
    violations.push(violation('VALIDATION_FAILED', 'mediatorNote.note', 'A note shared with all parties must stay under 2000 characters.'));
  }
  return violations;
}
