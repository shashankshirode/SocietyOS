import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useAuthSession } from '../../../../core/auth/useAuthSession';
import { chatRepository } from '../../../chat/data/chat.repository';
import type { ChatConversationSummary } from '../../../chat/domain/chat.types';

export function useGuardResidentInbox() {
  const { session } = useAuthSession();
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
      setConversations(await chatRepository.getAssignedInbox({ actorUserId: session.userId, societyId: session.societyId }));
    } catch {
      setConversations([]);
      setErrorMessageKey('chat.errors.loadFailed');
    } finally {
      setIsLoading(false);
    }
  }, [session?.societyId, session?.userId]);

  useEffect(() => { void load(); }, [load, version]);
  return { conversations, isLoading, errorMessageKey, retry: load };
}
