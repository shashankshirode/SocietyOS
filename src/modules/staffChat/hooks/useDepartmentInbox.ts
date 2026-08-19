import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useAuthSession } from '../../../core/auth/useAuthSession';
import { chatRepository } from '../../chat/data/chat.repository';
import type { ChatChannelDefinition, ChatConversationSummary } from '../../chat/domain/chat.types';

export function useDepartmentInbox(requestedChannelId?: string) {
  const { session } = useAuthSession();
  const [channels, setChannels] = useState<ChatChannelDefinition[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(requestedChannelId ?? null);
  const [conversations, setConversations] = useState<ChatConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessageKey, setErrorMessageKey] = useState<string | null>(null);
  const version = useSyncExternalStore(chatRepository.subscribe, chatRepository.getVersion, chatRepository.getVersion);

  const load = useCallback(async () => {
    if (!session?.societyId) {
      setErrorMessageKey('chat.access.wrongSociety');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setErrorMessageKey(null);
    try {
      const [catalog, memberships] = await Promise.all([
        chatRepository.getSocietyChannels(session.societyId),
        chatRepository.getUserMemberships(session.societyId, session.userId),
      ]);
      const activeChannelIds = memberships.filter((item) => item.status === 'active').map((item) => item.channelId);
      const available = catalog.filter((channel) => channel.historyMode === 'sharedChannelHistory' && channel.isEnabled && activeChannelIds.includes(channel.channelId));
      setChannels(available);
      const nextChannelId = requestedChannelId && available.some((channel) => channel.channelId === requestedChannelId)
        ? requestedChannelId
        : selectedChannelId && available.some((channel) => channel.channelId === selectedChannelId)
          ? selectedChannelId
          : available[0]?.channelId ?? null;
      setSelectedChannelId(nextChannelId);
      if (nextChannelId) {
        setConversations(await chatRepository.getDepartmentInbox({ actorUserId: session.userId, societyId: session.societyId }, nextChannelId));
      } else {
        setConversations([]);
      }
    } catch {
      setConversations([]);
      setErrorMessageKey('chat.errors.loadFailed');
    } finally {
      setIsLoading(false);
    }
  }, [requestedChannelId, selectedChannelId, session?.societyId, session?.userId]);

  useEffect(() => { void load(); }, [load, version]);
  return { channels, selectedChannelId, setSelectedChannelId, conversations, isLoading, errorMessageKey, retry: load };
}
