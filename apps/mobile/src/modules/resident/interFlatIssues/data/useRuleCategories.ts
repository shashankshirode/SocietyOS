import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';

export function useRuleCategories() {
  return useRepositoryResult(() => interFlatRepository.getRuleCategories(), []);
}
