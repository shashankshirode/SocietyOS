import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { nocRepository } from './noc.repository';

export function useMoveOutClearance(moveOutRequestId: string) {
  return useRepositoryResult(
    () => nocRepository.moveOutClearance(moveOutRequestId),
    [moveOutRequestId]
  );
}

