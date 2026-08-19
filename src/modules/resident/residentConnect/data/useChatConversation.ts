import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';

export function useChatConversation(threadId: string) {
  return useRepositoryResult(() => residentConnectRepository.getChatMessages(threadId), [threadId]);
}
