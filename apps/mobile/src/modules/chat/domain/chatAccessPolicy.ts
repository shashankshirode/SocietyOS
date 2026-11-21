import type {
  ChatAccessDecision,
  ChatChannelDefinition,
  ChatChannelMembership,
  ChatStaffIdentity,
} from './chat.types';

export type ChatAccessPolicyInput = {
  userId: string;
  societyId: string;
  channel: ChatChannelDefinition;
  membership?: ChatChannelMembership;
  staffIdentity?: ChatStaffIdentity;
  interactionAssignedUserId?: string;
  requiresSend?: boolean;
};

function isMembershipCurrent(membership: ChatChannelMembership, nowIso: string): boolean {
  if (membership.status !== 'active') return false;
  const now = new Date(nowIso).getTime();
  const starts = new Date(membership.validFromIso).getTime();
  const ends = membership.validUntilIso ? new Date(membership.validUntilIso).getTime() : null;
  return starts <= now && (ends === null || ends >= now);
}

export function resolveChatAccess(
  input: ChatAccessPolicyInput,
  nowIso = new Date().toISOString(),
): ChatAccessDecision {
  if (input.channel.societyId !== input.societyId) return { allowed: false, reason: 'wrongSociety' };
  if (!input.channel.isEnabled) return { allowed: false, reason: 'channelDisabled' };
  if (!input.membership) return { allowed: false, reason: 'membershipMissing' };
  if (input.membership.societyId !== input.societyId || input.membership.channelId !== input.channel.channelId) {
    return { allowed: false, reason: 'wrongSociety' };
  }
  if (!isMembershipCurrent(input.membership, nowIso)) return { allowed: false, reason: 'membershipInactive' };
  if (input.staffIdentity && input.staffIdentity.status !== 'active') {
    return { allowed: false, reason: 'staffInactive' };
  }
  if (input.staffIdentity?.chatPermissions) {
    const permission = input.requiresSend ? 'chat.channel.respond' : 'chat.channel.view';
    if (!input.staffIdentity.chatPermissions.includes(permission)) {
      return { allowed: false, reason: 'permissionMissing' };
    }
    if (
      input.channel.historyMode === 'individualStaffIsolated'
      && !input.staffIdentity.chatPermissions.includes('security.chat.viewAssignedInteractions')
      && !input.staffIdentity.chatPermissions.includes('security.chat.viewAllGuardInteractions')
    ) {
      return { allowed: false, reason: 'permissionMissing' };
    }
  }
  const permissionAllowed = input.requiresSend
    ? input.membership.permissions.canSend || input.membership.permissions.canRespond
    : input.membership.permissions.canRead;
  if (!permissionAllowed) return { allowed: false, reason: 'permissionMissing' };
  if (
    input.channel.historyMode === 'individualStaffIsolated'
    && input.interactionAssignedUserId !== input.userId
    && !input.membership.permissions.canViewAllGuardInteractions
    && !input.staffIdentity?.chatPermissions?.includes('security.chat.viewAllGuardInteractions')
  ) {
    return { allowed: false, reason: 'interactionNotAssigned' };
  }
  return { allowed: true, reason: 'allowed' };
}
