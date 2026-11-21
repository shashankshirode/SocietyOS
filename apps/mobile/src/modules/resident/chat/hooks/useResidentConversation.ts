import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { ChatMessage } from '../../../chat/domain/chat.types';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { residentChatRepository } from '../data/residentChat.repository';
import type { ResidentChatConversation } from '../data/residentChat.types';
import { chatActions } from '../../../chat/state/chat.actions';
import { selectChatDraft } from '../../../chat/state/chat.selectors';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
const pendingClientIds = new Set<string>();
export function useResidentConversation(channelId: string) {
    const { activeContext } = useActiveResidentHome();
    const cacheKey = `${activeContext.homeContextId}:${channelId}`;
    const [conversation, setConversation] = useState<ResidentChatConversation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingOlder, setIsLoadingOlder] = useState(false);
    const [errorMessageKey, setErrorMessageKey] = useState<string | null>(null);
    const [draft, setDraftState] = useState(selectChatDraft(activeContext.homeContextId, channelId));
    const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
    const version = useSyncExternalStore(residentChatRepository.subscribe, residentChatRepository.getVersion, residentChatRepository.getVersion);
    const load = useCallback(async () => {
        setIsLoading(true);
        setErrorMessageKey(null);
        try {
            const next = await residentChatRepository.detail(activeContext, channelId);
            setConversation(next);
            await residentChatRepository.markRead(activeContext, channelId);
        }
        catch {
            setConversation(null);
            setErrorMessageKey('chat.errors.conversationUnavailable');
        }
        finally {
            setIsLoading(false);
        }
    }, [activeContext, channelId]);
    useEffect(() => {
        setConversation(null);
        chatActions.switchResidence(activeContext.homeContextId);
        chatActions.selectChannel(channelId);
        setDraftState(selectChatDraft(activeContext.homeContextId, channelId));
        setReplyTo(null);
        void load();
    }, [activeContext.homeContextId, cacheKey, channelId, load, version]);
    const setDraft = useCallback((value: string) => {
        chatActions.setDraft(activeContext.homeContextId, channelId, value);
        setDraftState(value);
    }, [activeContext.homeContextId, channelId]);
    const send = useCallback(async (body: string) => {
        const messageText = body.trim();
        if (!messageText)
            return null;
        const clientMessageId = `${cacheKey}:${Date.now()}:${messageText}`;
        if (pendingClientIds.has(clientMessageId))
            return null;
        pendingClientIds.add(clientMessageId);
        setErrorMessageKey(null);
        const optimistic: ChatMessage = {
            messageId: `optimistic:${clientMessageId}`,
            clientMessageId,
            societyId: activeContext.societyId,
            residenceId: activeContext.homeContextId,
            residentUserId: activeContext.residentId,
            channelId,
            ...includeWhenPresent("replyToMessageId", replyTo?.messageId),
            senderSnapshot: {
                senderUserId: activeContext.residentId,
                senderType: 'resident',
                displayNameAtSend: 'Resident',
                roleTitleAtSend: 'Resident',
                channelNameAtSend: conversation?.channel.configuredDisplayName ?? conversation?.channel.code ?? ''
            },
            messageText,
            sentAtIso: new Date().toISOString(),
            deliveryStatus: 'sending'
        };
        setConversation((current) => current ? { ...current, messages: [...current.messages, optimistic] } : current);
        try {
            const sent = await residentChatRepository.send(activeContext, {
                channelId,
                clientMessageId,
                messageText,
                ...includeWhenPresent("replyToMessageId", replyTo?.messageId)
            });
            setDraft('');
            setReplyTo(null);
            return sent;
        }
        catch {
            setErrorMessageKey('chat.errors.sendFailed');
            setConversation((current) => current ? {
                ...current,
                messages: current.messages.map((message) => message.clientMessageId === clientMessageId ? { ...message, deliveryStatus: 'failed' } : message)
            } : current);
            return null;
        }
        finally {
            pendingClientIds.delete(clientMessageId);
        }
    }, [activeContext, cacheKey, channelId, conversation?.channel.code, conversation?.channel.configuredDisplayName, replyTo?.messageId, setDraft]);
    const retryMessage = useCallback(async (message: ChatMessage) => {
        return send(message.messageText);
    }, [send]);
    const loadOlder = useCallback(async () => {
        if (!conversation?.hasMore || !conversation.nextCursor || isLoadingOlder)
            return;
        setIsLoadingOlder(true);
        try {
            const older = await residentChatRepository.detail(activeContext, channelId, conversation.nextCursor);
            setConversation({
                ...conversation,
                messages: [...older.messages, ...conversation.messages],
                nextCursor: older.nextCursor,
                hasMore: older.hasMore
            });
        }
        catch {
            setErrorMessageKey('chat.errors.olderMessagesFailed');
        }
        finally {
            setIsLoadingOlder(false);
        }
    }, [activeContext, channelId, conversation, isLoadingOlder]);
    const messageById = useMemo(() => new Map(conversation?.messages.map((message) => [message.messageId, message]) ?? []), [conversation?.messages]);
    return {
        conversation,
        isLoading,
        isLoadingOlder,
        errorMessageKey,
        draft,
        setDraft,
        replyTo,
        setReplyTo,
        send,
        retryMessage,
        loadOlder,
        retryLoad: load,
        messageById
    };
}

