import { chatRepository } from '../../../chat/data/chat.repository';
import type { SendResidentMessageInput } from '../../../chat/data/chat.repository.types';
import type { ActiveResidentHomeContext } from '../../homeContext/data/residentHomeContext.types';
import type { ResidentChatConversation, ResidentChatConversationSummary } from './residentChat.types';
import type { CursorPage } from '../../../../shared/hooks/useCursorPagination';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
const PAGE_SIZE = 30;
function requestContext(context: ActiveResidentHomeContext) {
    return { activeHome: context, dataScopeKey: context.dataScopeKey };
}
export const residentChatRepository = {
    subscribe: chatRepository.subscribe,
    getVersion: chatRepository.getVersion,
    async list(context: ActiveResidentHomeContext, cursor?: string): Promise<CursorPage<ResidentChatConversationSummary>> {
        const summaries = await chatRepository.getResidentChannels(requestContext(context), cursor, 20);
        const items = summaries.map((summary) => ({
            id: summary.channel.channelId,
            homeContextId: summary.residenceId,
            channel: summary.channel,
            unreadCount: summary.unreadCount,
            updatedAt: summary.updatedAtIso,
            lastMessage: summary.lastMessage
        }));
        return {
            items,
            ...includeWhenPresent("nextCursor", summaries.nextCursor),
            hasMore: summaries.hasMore
        };
    },
    async detail(context: ActiveResidentHomeContext, channelId: string, cursor: string | null = null): Promise<ResidentChatConversation> {
        const channel = (await chatRepository.getSocietyChannels(context.societyId))
            .find((item) => item.channelId === channelId);
        if (!channel)
            throw new Error('chat.errors.channelUnavailable');
        const page = await chatRepository.getResidentMessages(requestContext(context), channelId, { cursor, pageSize: PAGE_SIZE });
        const summary = (await chatRepository.getResidentChannels(requestContext(context)))
            .find((item) => item.channel.channelId === channelId);
        return {
            id: channelId,
            homeContextId: context.homeContextId,
            channel,
            unreadCount: summary?.unreadCount ?? 0,
            updatedAt: summary?.updatedAtIso ?? channel.updatedAtIso,
            messages: page.messages,
            nextCursor: page.nextCursor,
            hasMore: page.hasMore
        };
    },
    send(context: ActiveResidentHomeContext, input: SendResidentMessageInput) {
        return chatRepository.sendResidentMessage(requestContext(context), input);
    },
    markRead(context: ActiveResidentHomeContext, channelId: string) {
        return chatRepository.markChannelRead(requestContext(context), channelId);
    }
};

