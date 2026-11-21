import type { Absent } from '../../../../shared/types/absence.types';
import type {
  NoticePriority,
  NoticeRecipientState,
  NoticeStatus,
  TransitionResult,
} from '../types';
import { violation } from '../types';

const NOTICE_TRANSITIONS: Readonly<Record<NoticeStatus, readonly NoticeStatus[]>> = {
  DRAFT: ['SCHEDULED', 'PUBLISHED'],
  SCHEDULED: ['PUBLISHED', 'WITHDRAWN'],
  PUBLISHED: ['DELIVERING', 'DELIVERED', 'PARTIALLY_DELIVERED', 'WITHDRAWN'],
  DELIVERING: ['DELIVERED', 'PARTIALLY_DELIVERED', 'FAILED'],
  DELIVERED: ['PARTIALLY_DELIVERED', 'EXPIRED', 'WITHDRAWN'],
  PARTIALLY_DELIVERED: ['DELIVERING', 'DELIVERED', 'EXPIRED', 'WITHDRAWN'],
  FAILED: ['DELIVERING', 'WITHDRAWN'],
  EXPIRED: [],
  WITHDRAWN: [],
};

const RECIPIENT_TRANSITIONS: Readonly<
  Record<NoticeRecipientState, readonly NoticeRecipientState[]>
> = {
  PENDING: ['QUEUED', 'SUPPRESSED', 'FAILED'],
  QUEUED: ['DELIVERED', 'FAILED', 'SUPPRESSED'],
  DELIVERED: ['READ', 'ACKNOWLEDGED', 'FAILED'],
  READ: ['ACKNOWLEDGED', 'FAILED'],
  ACKNOWLEDGED: [],
  FAILED: ['QUEUED', 'SUPPRESSED'],
  SUPPRESSED: [],
};

const QUIET_HOURS_OVERRIDE_ALLOWED_PRIORITIES: readonly NoticePriority[] = [
  'CRITICAL',
  'HIGH',
];

export function canTransitionNotice(
  from: NoticeStatus,
  to: NoticeStatus,
): TransitionResult<NoticeStatus> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  if (!NOTICE_TRANSITIONS[from].includes(to)) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `notice.status.${to}`,
        `Notice cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function canTransitionNoticeRecipient(
  from: NoticeRecipientState,
  to: NoticeRecipientState,
): TransitionResult<NoticeRecipientState> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  if (!RECIPIENT_TRANSITIONS[from].includes(to)) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `noticeRecipient.state.${to}`,
        `Notice recipient cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function isQuietHoursOverridePermitted(
  priority: NoticePriority,
  quietHoursOverride: boolean,
): boolean {
  if (!quietHoursOverride) {
    return true;
  }
  return QUIET_HOURS_OVERRIDE_ALLOWED_PRIORITIES.includes(priority);
}

export function isNoticePublishable(
  status: NoticeStatus,
  audienceTotal: number,
  audienceFrozen: boolean,
): boolean {
  if (status !== 'DRAFT' && status !== 'SCHEDULED') {
    return false;
  }
  if (audienceTotal <= 0) {
    return false;
  }
  return audienceFrozen;
}

export function isNoticeTerminal(status: NoticeStatus): boolean {
  return status === 'EXPIRED' || status === 'WITHDRAWN';
}

export function isNoticeExpired(
  status: NoticeStatus,
  effectiveUntilIso: string | Absent,
  nowMs: number,
): boolean {
  if (isNoticeTerminal(status)) {
    return false;
  }
  if (effectiveUntilIso === undefined) {
    return false;
  }
  const untilMs = Date.parse(effectiveUntilIso);
  if (Number.isNaN(untilMs)) {
    return false;
  }
  return nowMs >= untilMs;
}

export function getNoticeNextStates(
  status: NoticeStatus,
): readonly NoticeStatus[] {
  return NOTICE_TRANSITIONS[status];
}

export function getNoticeRecipientNextStates(
  state: NoticeRecipientState,
): readonly NoticeRecipientState[] {
  return RECIPIENT_TRANSITIONS[state];
}
