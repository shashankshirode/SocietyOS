import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';
import type { InterFlatQuery } from './interFlat.dto';

export function useRuleLibrary(params?: InterFlatQuery) {
  return useRepositoryResult(() => interFlatRepository.getRuleLibrary(params), [JSON.stringify(params)]);
}
