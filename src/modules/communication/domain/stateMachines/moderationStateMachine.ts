import type {
  ModerationActionType,
  ModerationStatus,
  TransitionResult,
} from '../types';
import { violation } from '../types';

const MODERATION_TRANSITIONS: Readonly<
  Record<ModerationStatus, readonly ModerationStatus[]>
> = {
  SUBMITTED: ['UNDER_REVIEW', 'DISMISSED'],
  UNDER_REVIEW: ['ACTION_TAKEN', 'DISMISSED', 'ESCALATED'],
  ACTION_TAKEN: ['ESCALATED'],
  DISMISSED: ['ESCALATED'],
  ESCALATED: [],
};

const ACTIONS_REQUIRING_REASON: readonly ModerationActionType[] = [
  'MUTE_RESIDENT',
  'REMOVE_RESIDENT_ACCESS',
  'CLOSE_CHANNEL',
  'ESCALATE_TO_COMMITTEE',
];

export function canTransitionModeration(
  from: ModerationStatus,
  to: ModerationStatus,
): TransitionResult<ModerationStatus> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  if (!MODERATION_TRANSITIONS[from].includes(to)) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `moderation.status.${to}`,
        `Moderation case cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function requiresActionReason(action: ModerationActionType): boolean {
  return ACTIONS_REQUIRING_REASON.includes(action);
}

export function isModerationTerminal(status: ModerationStatus): boolean {
  return status === 'ESCALATED';
}

export function isModerationOpen(status: ModerationStatus): boolean {
  return status === 'SUBMITTED' || status === 'UNDER_REVIEW';
}

export function getModerationNextStates(
  status: ModerationStatus,
): readonly ModerationStatus[] {
  return MODERATION_TRANSITIONS[status];
}
