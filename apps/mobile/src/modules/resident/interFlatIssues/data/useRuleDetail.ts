import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';

export function useRuleDetail(ruleId: string) {
  return useRepositoryResult(() => interFlatRepository.getRuleDetail(ruleId), [ruleId]);
}
