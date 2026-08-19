import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';

export function useSendMessage() {
  return useRepositoryMutation((payload: { threadId: string; content: string }) =>
    residentConnectRepository.sendMessage(payload.threadId, payload.content)
  );
}
