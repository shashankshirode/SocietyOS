import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useAuthSession } from '../../../core/auth/useAuthSession';
import { chatRepository } from '../../chat/data/chat.repository';
import type { ChatMessage } from '../../chat/domain/chat.types';

export function useDepartmentConversation(channelId: string, residenceId: string, residentUserId: string) {
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
      const page = await chatRepository.getDepartmentMessages(
        { actorUserId: session.userId, societyId: session.societyId }, channelId, residenceId,
        { cursor: null, pageSize: 30 },
      );
      setMessages(page.messages);
    } catch {
      setMessages([]);
      setErrorMessageKey('chat.access.membershipInactive');
    } finally {
      setIsLoading(false);
    }
  }, [channelId, residenceId, session?.societyId, session?.userId]);
  useEffect(() => { void load(); }, [load, version]);

  const send = useCallback(async (messageText: string) => {
    if (!session?.societyId) return null;
    try {
      return await chatRepository.sendDepartmentMessage(
        { actorUserId: session.userId, societyId: session.societyId },
        { channelId, residenceId, residentUserId, clientMessageId: `department:${session.userId}:${Date.now()}`, messageText },
      );
    } catch {
      setErrorMessageKey('chat.errors.sendFailed');
      return null;
    }
  }, [channelId, residenceId, residentUserId, session?.societyId, session?.userId]);
  return { messages, isLoading, errorMessageKey, send, retry: load, actorUserId: session?.userId ?? '' };
}
