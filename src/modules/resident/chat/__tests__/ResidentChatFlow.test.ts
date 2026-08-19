import { chatRepository } from '../../../chat/data/chat.repository';
import { mapContextToActive } from '../../homeContext/state/residentHomeContext.store';
import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import { residentChatRepository } from '../data/residentChat.repository';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
describe('resident Chat flow', () => {
    it('lists only configured residence-scoped channels and marks unread as read', async () => {
        const primary = mapContextToActive(getRequiredItem(mockResidentHomeContexts, 0, "ResidentChatFlow.test.ts"));
        const secondary = mapContextToActive(getRequiredItem(mockResidentHomeContexts, 2, "ResidentChatFlow.test.ts"));
        const primaryChats = (await residentChatRepository.list(primary)).items;
        const secondaryChats = (await residentChatRepository.list(secondary)).items;
        expect(primaryChats).toHaveLength(5);
        expect(primaryChats.every((chat) => chat.homeContextId === primary.homeContextId)).toBe(true);
        expect(secondaryChats.every((chat) => chat.homeContextId === secondary.homeContextId)).toBe(true);
        expect(secondaryChats.some((chat) => chat.channel.code === 'securityDesk')).toBe(false);
        const security = primaryChats.find((chat) => chat.channel.code === 'securityGate');
        expect(security?.unreadCount).toBeGreaterThan(0);
        await residentChatRepository.markRead(primary, security?.id ?? '');
        const refreshed = (await residentChatRepository.list(primary)).items;
        expect(refreshed.find((chat) => chat.id === security?.id)?.unreadCount).toBe(0);
    });
    it('merges Guard A and Guard B messages for the resident while preserving attribution', async () => {
        const context = mapContextToActive(getRequiredItem(mockResidentHomeContexts, 0, "ResidentChatFlow.test.ts"));
        const security = ((await residentChatRepository.list(context)).items).find((chat) => chat.channel.code === 'securityGate');
        const detail = await residentChatRepository.detail(context, security?.id ?? '');
        const guardNames = detail.messages
            .filter((message) => message.senderSnapshot.senderType === 'securityGuard')
            .map((message) => message.senderSnapshot.displayNameAtSend);
        expect(guardNames).toEqual(expect.arrayContaining(['Amit Jadhav', 'Suresh Patil']));
    });
    it('routes a specific resident reply to the source guard interaction and deduplicates sends', async () => {
        const context = mapContextToActive(getRequiredItem(mockResidentHomeContexts, 0, "ResidentChatFlow.test.ts"));
        const requestContext = { activeHome: context, dataScopeKey: context.dataScopeKey };
        const input = {
            channelId: 'society-gv-securityGate',
            clientMessageId: 'resident-reply-dedupe-test',
            messageText: 'Please keep it at the gate.',
            replyToMessageId: 'gate-amit-1',
        };
        const first = await chatRepository.sendResidentMessage(requestContext, input);
        const duplicate = await chatRepository.sendResidentMessage(requestContext, input);
        expect(first.messageId).toBe(duplicate.messageId);
        expect(first.interactionId).toBe('interaction-amit-delivery');
        const amitMessages = await chatRepository.getAssignedMessages({ actorUserId: 'guard-amit', societyId: 'society-gv' }, 'interaction-amit-delivery', { cursor: null, pageSize: 50 });
        expect(amitMessages.messages.some((message) => message.messageId === first.messageId)).toBe(true);
    });
});

