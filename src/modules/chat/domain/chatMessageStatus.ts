import type { ChatMessageDeliveryStatus } from './chat.types';

const transitions: Readonly<Record<ChatMessageDeliveryStatus, readonly ChatMessageDeliveryStatus[]>> = {
  queued: ['sending', 'failed'],
  sending: ['sent', 'failed'],
  sent: ['delivered', 'failed'],
  delivered: ['seen'],
  seen: [],
  failed: ['queued', 'sending'],
};

export function canTransitionChatMessageStatus(
  current: ChatMessageDeliveryStatus,
  next: ChatMessageDeliveryStatus,
): boolean {
  return transitions[current].includes(next);
}
