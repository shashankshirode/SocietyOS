import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';
import { useMockStore } from '../../../../core/mockStore/useMockStore';
import type { InterFlatQuery } from './interFlat.dto';

export function useMyInterFlatIssues(params?: InterFlatQuery) {
  const { state } = useMockStore();
  const result = useRepositoryResult(() => interFlatRepository.getMyInterFlatIssues(params), [JSON.stringify(params)]);
  
  return {
    ...result,
    data: state.interFlatIssues,
  };
}
