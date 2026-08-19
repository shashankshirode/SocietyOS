import type { ChatChannelDefinition, ChatSenderSnapshot, ChatStaffIdentity } from '../domain/chat.types';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export function mapStaffIdentityToSenderSnapshot(input: {
    identity: ChatStaffIdentity;
    channel: ChatChannelDefinition;
    channelDisplayName: string;
    gateName?: string;
}): ChatSenderSnapshot {
    return {
        senderUserId: input.identity.userId,
        senderType: input.channel.code === 'securityGate' ? 'securityGuard' : 'departmentStaff',
        displayNameAtSend: input.identity.displayName,
        roleTitleAtSend: input.identity.roleTitle,
        channelNameAtSend: input.channelDisplayName,
        ...includeWhenPresent("gateNameAtSend", input.gateName),
        ...includeWhenPresent("avatarAssetId", input.identity.avatarAssetId)
    };
}

