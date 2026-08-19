import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';
import type { InterFlatQuery } from './interFlat.dto';

export function usePenaltyReadiness(params?: InterFlatQuery) {
  return useRepositoryResult(() => interFlatRepository.getPenaltyReadiness(params), [JSON.stringify(params)]);
}
