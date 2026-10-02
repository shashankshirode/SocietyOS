import type {
  ChannelStatus,
  MessageDeliveryState,
  TransitionResult,
} from '../types';
import { violation } from '../types';

const CHANNEL_TRANSITIONS: Readonly<Record<ChannelStatus, readonly ChannelStatus[]>> = {
  PENDING: ['ACTIVE', 'CLOSED'],
  ACTIVE: ['SUSPENDED', 'CLOSED'],
  SUSPENDED: ['ACTIVE', 'CLOSED'],
  CLOSED: [],
};

const MESSAGE_TRANSITIONS: Readonly<
  Record<MessageDeliveryState, readonly MessageDeliveryState[]>
> = {
  QUEUED: ['SENDING', 'EXPIRED', 'FAILED'],
  SENDING: ['SENT', 'FAILED', 'EXPIRED'],
  SENT: ['DELIVERED', 'FAILED', 'EXPIRED', 'WITHDRAWN'],
  DELIVERED: ['READ', 'EXPIRED', 'WITHDRAWN'],
  READ: ['EXPIRED', 'WITHDRAWN'],
  FAILED: ['SENDING', 'EXPIRED', 'WITHDRAWN'],
  EXPIRED: ['WITHDRAWN'],
  WITHDRAWN: [],
};

export function canTransitionChannel(
  from: ChannelStatus,
  to: ChannelStatus,
): TransitionResult<ChannelStatus> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  if (!CHANNEL_TRANSITIONS[from].includes(to)) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `channel.status.${to}`,
        `Channel cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function canTransitionMessage(
  from: MessageDeliveryState,
  to: MessageDeliveryState,
): TransitionResult<MessageDeliveryState> {
  if (from === to) {
    return { allowed: true, from, to, warnings: [] };
  }
  if (!MESSAGE_TRANSITIONS[from].includes(to)) {
    return {
      allowed: false,
      from,
      attempted: to,
      violation: violation(
        'ILLEGAL_TRANSITION',
        `message.deliveryState.${to}`,
        `Message cannot move from ${from} to ${to}.`,
      ),
    };
  }
  return { allowed: true, from, to, warnings: [] };
}

export function isChannelAcceptingMessages(status: ChannelStatus): boolean {
  return status === 'ACTIVE';
}

export function isMessageTerminal(state: MessageDeliveryState): boolean {
  return state === 'EXPIRED' || state === 'WITHDRAWN';
}

export function isMessageRetained(
  state: MessageDeliveryState,
  expiresAtIso: string,
  nowMs: number,
): boolean {
  if (isMessageTerminal(state)) {
    return false;
  }
  const expiresAtMs = Date.parse(expiresAtIso);
  if (Number.isNaN(expiresAtMs)) {
    return true;
  }
  return nowMs < expiresAtMs;
}

export function getChannelNextStates(
  status: ChannelStatus,
): readonly ChannelStatus[] {
  return CHANNEL_TRANSITIONS[status];
}

export function getMessageNextStates(
  state: MessageDeliveryState,
): readonly MessageDeliveryState[] {
  return MESSAGE_TRANSITIONS[state];
}
