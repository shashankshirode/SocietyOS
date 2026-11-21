import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useAuthSession } from '../../../../core/auth/useAuthSession';
import { chatRepository } from '../../../chat/data/chat.repository';
import type { ChatMessage } from '../../../chat/domain/chat.types';

export function useGuardResidentConversation(interactionId: string) {
  const { session } = useAuthSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessageKey, setErrorMessageKey] = useState<string | null>(null);
  const version = useSyncExternalStore(chatRepository.subscribe, chatRepository.getVersion, chatRepository.getVersion);

  const load = useCallback(async () => {
    if (!session?.societyId) return;
    setIsLoading(true);
    setErrorMessageKey(null);
    try {
      const page = await chatRepository.getAssignedMessages(
        { actorUserId: session.userId, societyId: session.societyId },
        interactionId,
        { cursor: null, pageSize: 30 },
      );
      setMessages(page.messages);
    } catch {
      setMessages([]);
      setErrorMessageKey('chat.access.interactionNotAssigned');
    } finally {
      setIsLoading(false);
    }
  }, [interactionId, session?.societyId, session?.userId]);

  useEffect(() => { void load(); }, [load, version]);

  const send = useCallback(async (messageText: string) => {
    if (!session?.societyId || !messages[0]) return null;
    try {
      return await chatRepository.sendGuardMessage(
        { actorUserId: session.userId, societyId: session.societyId },
        {
          channelId: messages[0].channelId,
          interactionId,
          residenceId: messages[0].residenceId,
          residentUserId: messages[0].residentUserId,
          clientMessageId: `guard:${session.userId}:${Date.now()}`,
          messageText,
        },
      );
    } catch {
      setErrorMessageKey('chat.errors.sendFailed');
      return null;
    }
  }, [interactionId, messages, session?.societyId, session?.userId]);

  return { messages, isLoading, errorMessageKey, send, retry: load };
}
