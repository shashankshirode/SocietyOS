import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { CreateNocRequestInput } from './noc.dto';
import { nocRepository } from './noc.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useCreateNocRequest() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryMutation((input: CreateNocRequestInput) => nocRepository.createRequest(context, input));
}
export default useCreateNocRequest;
