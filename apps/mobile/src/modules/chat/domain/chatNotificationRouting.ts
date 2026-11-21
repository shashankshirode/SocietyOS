import type {
  ChatChannelDefinition,
  ChatChannelMembership,
  SecurityConversationSegment,
} from './chat.types';

export function resolveChatNotificationRecipients(input: {
  channel: ChatChannelDefinition;
  memberships: readonly ChatChannelMembership[];
  interaction?: SecurityConversationSegment;
  nowIso?: string;
}): string[] {
  const now = new Date(input.nowIso ?? new Date().toISOString()).getTime();
  if (input.channel.historyMode === 'individualStaffIsolated') {
    return input.interaction ? [input.interaction.assignedGuardUserId] : [];
  }
  return input.memberships
    .filter((membership) =>
      membership.channelId === input.channel.channelId
      && membership.societyId === input.channel.societyId
      && membership.status === 'active'
      && membership.permissions.canRead
      && new Date(membership.validFromIso).getTime() <= now
      && (!membership.validUntilIso || new Date(membership.validUntilIso).getTime() >= now)
    )
    .map((membership) => membership.userId);
}
