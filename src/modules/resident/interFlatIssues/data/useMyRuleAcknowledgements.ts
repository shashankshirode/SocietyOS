import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';
import type { InterFlatQuery } from './interFlat.dto';

export function useMyRuleAcknowledgements(params?: InterFlatQuery) {
  return useRepositoryResult(() => interFlatRepository.getMyRuleAcknowledgements(params), [JSON.stringify(params)]);
}
