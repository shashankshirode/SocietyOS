import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';
import type { InterFlatQuery } from './interFlat.dto';

export function useDisputeHistory(params?: InterFlatQuery) {
  return useRepositoryResult(() => interFlatRepository.getDisputeHistory(params), [JSON.stringify(params)]);
}
