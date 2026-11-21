import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';
import type { InterFlatQuery } from './interFlat.dto';

export function useRuleViolationPlaceholder(params?: InterFlatQuery) {
  return useRepositoryResult(() => interFlatRepository.getRuleViolations(params), [JSON.stringify(params)]);
}
