import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { CreateVisitorPayload } from '../../../../shared/types/visitor.types';
import { visitorsRepository } from './visitors.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useCreateVisitorPass() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryMutation((payload: CreateVisitorPayload) => visitorsRepository.create(context, payload));
}
export default useCreateVisitorPass;
