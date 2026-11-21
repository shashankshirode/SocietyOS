import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { residentChatRepository } from '../data/residentChat.repository';
import { useCursorPagination } from '../../../../shared/hooks/useCursorPagination';

export function useResidentChatConversations() {
  const { activeContext } = useActiveResidentHome();
  const version = useSyncExternalStore(
    residentChatRepository.subscribe,
    residentChatRepository.getVersion,
    residentChatRepository.getVersion,
  );

  const fetchConversations = useCallback(
    async (cursor?: string) => {
      return residentChatRepository.list(activeContext, cursor);
    },
    [activeContext]
  );

  const pagination = useCursorPagination(fetchConversations, [activeContext, version]);

  const unreadCount = useMemo(
    () => pagination.items.reduce((total, conversation) => total + conversation.unreadCount, 0),
    [pagination.items],
  );

  return {
    conversations: pagination.items,
    unreadCount,
    activeContext,
    isLoading: pagination.isInitialLoading,
    isRefreshing: pagination.isRefreshing,
    isLoadingMore: pagination.isLoadingMore,
    hasMore: pagination.hasMore,
    errorMessageKey: pagination.errorMessage ? 'chat.errors.loadFailed' : null,
    retry: pagination.retry,
    refresh: pagination.refresh,
    loadMore: pagination.loadMore,
  };
}
