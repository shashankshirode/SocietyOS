import { useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import type { MoveOutRequestInput } from './noc.dto';
import { nocRepository } from './noc.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useMoveOutRequest() {
  const { activeContext } = useActiveResidentHome();
  const context = {
    activeHome: activeContext,
    dataScopeKey: activeContext.dataScopeKey,
  };
  return useRepositoryMutation((input: MoveOutRequestInput) => nocRepository.createMoveOut(context, input));
}
export default useMoveOutRequest;
