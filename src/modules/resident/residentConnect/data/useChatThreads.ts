import { useRepositoryResult, useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useChatThreads() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  const result = useRepositoryResult(() => residentConnectRepository.getChatThreads(context), [context.dataScopeKey]);

  return {
    ...result,
    data: result.data || [],
  };
}

export function useMarkThreadRead() {
  return useRepositoryMutation((threadId: string) =>
    residentConnectRepository.markThreadRead(threadId)
  );
}
export default useChatThreads;
